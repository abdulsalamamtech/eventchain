import AccessControl "authorization/access-control";
import Principal "mo:base/Principal";
import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Debug "mo:base/Debug";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import List "mo:base/List";
import Float "mo:base/Float";
import Nat "mo:base/Nat";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import Migration "migration";

(with migration = Migration.run)
persistent actor {
  // Initialize the user system state
  let accessControlState = AccessControl.initState();

  // Initialize auth (first caller becomes admin, others become users)
  public shared ({ caller }) func initializeAccessControl() : async () {
    AccessControl.initialize(accessControlState, caller);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };

  public type UserProfile = {
    name : Text;
    // Other user metadata if needed
  };

  transient let principalMap = OrderedMap.Make<Principal>(Principal.compare);
  var userProfiles = principalMap.empty<UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view profiles");
    };
    principalMap.get(userProfiles, caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own profile");
    };
    principalMap.get(userProfiles, user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can save profiles");
    };
    userProfiles := principalMap.put(userProfiles, caller, profile);
  };

  // Storage for event banners
  let storage = Storage.new();
  include MixinStorage(storage);

  // Event and registration types
  public type Registration = {
    userId : Text;
    name : Text;
    email : Text;
    registrationDate : Int;
    paymentStatus : ?Text; // Added for paid events
  };

  public type Event = {
    eventId : Text;
    title : Text;
    description : Text;
    category : Text;
    date : Int;
    locationName : Text;
    lat : Float;
    lng : Float;
    bannerUrl : Text;
    organizerId : Text;
    capacity : Nat;
    isPublished : Bool;
    isPaid : Bool; // New field for paid events
    price : Nat; // New field for event price in ICP tokens
    registrations : [Registration];
  };

  // OrderedMap for events
  transient let textMap = OrderedMap.Make<Text>(Text.compare);
  var events = textMap.empty<Event>();

  // Create event
  public shared ({ caller }) func createEvent(event : Event) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated organizers can create events");
    };
    events := textMap.put(events, event.eventId, event);
  };

  // Update event
  public shared ({ caller }) func updateEvent(eventId : Text, updatedEvent : Event) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated organizers can update events");
    };

    // Verify ownership
    switch (textMap.get(events, eventId)) {
      case (null) { Debug.trap("Event not found") };
      case (?existingEvent) {
        let callerPrincipalText = Principal.toText(caller);
        if (existingEvent.organizerId != callerPrincipalText and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Only the event organizer or admin can update this event");
        };
        events := textMap.put(events, eventId, updatedEvent);
      };
    };
  };

  // Delete event
  public shared ({ caller }) func deleteEvent(eventId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated organizers can delete events");
    };

    // Verify ownership
    switch (textMap.get(events, eventId)) {
      case (null) { Debug.trap("Event not found") };
      case (?existingEvent) {
        let callerPrincipalText = Principal.toText(caller);
        if (existingEvent.organizerId != callerPrincipalText and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Only the event organizer or admin can delete this event");
        };
        events := textMap.delete(events, eventId);
      };
    };
  };

  // Get event by ID (public)
  public query func getEvent(eventId : Text) : async ?Event {
    textMap.get(events, eventId);
  };

  // Get all events (public)
  public query func getAllEvents() : async [Event] {
    var eventList = List.nil<Event>();
    for ((_, event) in textMap.entries(events)) {
      eventList := List.push(event, eventList);
    };
    List.toArray(eventList);
  };

  // Register for event (public - no authentication required per spec)
  public shared func registerForEvent(eventId : Text, registration : Registration) : async () {
    switch (textMap.get(events, eventId)) {
      case (null) { Debug.trap("Event not found") };
      case (?event) {
        if (event.registrations.size() >= event.capacity) {
          Debug.trap("Event is full");
        };

        // Check payment status for paid events
        if (event.isPaid) {
          switch (registration.paymentStatus) {
            case (null) { Debug.trap("Payment required for this event") };
            case (?status) {
              if (status != "paid") {
                Debug.trap("Payment not completed");
              };
            };
          };
        };

        let updatedRegistrations = List.push(registration, List.fromArray(event.registrations));
        let updatedEvent = {
          event with
          registrations = List.toArray(updatedRegistrations);
        };
        events := textMap.put(events, eventId, updatedEvent);
      };
    };
  };

  // Get registrations for event (organizer or admin only)
  public query ({ caller }) func getRegistrations(eventId : Text) : async [Registration] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view registrations");
    };

    switch (textMap.get(events, eventId)) {
      case (null) { Debug.trap("Event not found") };
      case (?event) {
        let callerPrincipalText = Principal.toText(caller);
        if (event.organizerId != callerPrincipalText and not AccessControl.isAdmin(accessControlState, caller)) {
          Debug.trap("Unauthorized: Only the event organizer or admin can view registrations");
        };
        event.registrations;
      };
    };
  };

  // Search events by title (public)
  public query func searchEvents(searchTerm : Text) : async [Event] {
    var eventList = List.nil<Event>();
    for ((_, event) in textMap.entries(events)) {
      if (Text.contains(Text.toLowercase(event.title), #text(Text.toLowercase(searchTerm)))) {
        eventList := List.push(event, eventList);
      };
    };
    List.toArray(eventList);
  };

  // Filter events by category (public)
  public query func filterEventsByCategory(category : Text) : async [Event] {
    var eventList = List.nil<Event>();
    for ((_, event) in textMap.entries(events)) {
      if (event.category == category) {
        eventList := List.push(event, eventList);
      };
    };
    List.toArray(eventList);
  };

  // Filter events by date range (public)
  public query func filterEventsByDateRange(startDate : Int, endDate : Int) : async [Event] {
    var eventList = List.nil<Event>();
    for ((_, event) in textMap.entries(events)) {
      if (event.date >= startDate and event.date <= endDate) {
        eventList := List.push(event, eventList);
      };
    };
    List.toArray(eventList);
  };

  // Filter events by price (public)
  public query func filterEventsByPrice(isPaid : Bool) : async [Event] {
    var eventList = List.nil<Event>();
    for ((_, event) in textMap.entries(events)) {
      if (event.isPaid == isPaid) {
        eventList := List.push(event, eventList);
      };
    };
    List.toArray(eventList);
  };

  // Get events by organizer (caller must be the organizer or admin)
  public query ({ caller }) func getEventsByOrganizer(organizerId : Text) : async [Event] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can view organizer events");
    };

    let callerPrincipalText = Principal.toText(caller);
    if (organizerId != callerPrincipalText and not AccessControl.isAdmin(accessControlState, caller)) {
      Debug.trap("Unauthorized: Can only view your own events");
    };

    var eventList = List.nil<Event>();
    for ((_, event) in textMap.entries(events)) {
      if (event.organizerId == organizerId) {
        eventList := List.push(event, eventList);
      };
    };
    List.toArray(eventList);
  };

  // Get published events (public)
  public query func getPublishedEvents() : async [Event] {
    var eventList = List.nil<Event>();
    for ((_, event) in textMap.entries(events)) {
      if (event.isPublished) {
        eventList := List.push(event, eventList);
      };
    };
    List.toArray(eventList);
  };

  // Get upcoming events (public)
  public query func getUpcomingEvents() : async [Event] {
    let currentTime = Time.now();
    var eventList = List.nil<Event>();
    for ((_, event) in textMap.entries(events)) {
      if (event.date > currentTime) {
        eventList := List.push(event, eventList);
      };
    };
    List.toArray(eventList);
  };

  // Get past events (public)
  public query func getPastEvents() : async [Event] {
    let currentTime = Time.now();
    var eventList = List.nil<Event>();
    for ((_, event) in textMap.entries(events)) {
      if (event.date < currentTime) {
        eventList := List.push(event, eventList);
      };
    };
    List.toArray(eventList);
  };

  // Stripe integration
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Debug.trap("Unauthorized: Only admins can configure Stripe");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { Debug.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Debug.trap("Unauthorized: Only authenticated users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
