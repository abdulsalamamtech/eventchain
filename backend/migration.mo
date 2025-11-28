import OrderedMap "mo:base/OrderedMap";
import Text "mo:base/Text";
import Principal "mo:base/Principal";
import List "mo:base/List";
import Float "mo:base/Float";
import Nat "mo:base/Nat";

module {
  type OldRegistration = {
    userId : Text;
    name : Text;
    email : Text;
    registrationDate : Int;
    paymentStatus : ?Text;
  };

  type OldEvent = {
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
    isPaid : Bool;
    price : Nat;
    registrations : [OldRegistration];
  };

  type OldActor = {
    userProfiles : OrderedMap.Map<Principal, { name : Text }>;
    events : OrderedMap.Map<Text, OldEvent>;
    configuration : ?{
      secretKey : Text;
      allowedCountries : [Text];
    };
  };

  type NewRegistration = {
    userId : Text;
    name : Text;
    email : Text;
    registrationDate : Int;
    paymentStatus : ?Text;
  };

  type NewEvent = {
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
    isPaid : Bool;
    price : Nat;
    registrations : [NewRegistration];
  };

  type NewActor = {
    userProfiles : OrderedMap.Map<Principal, { name : Text }>;
    events : OrderedMap.Map<Text, NewEvent>;
    configuration : ?{
      secretKey : Text;
      allowedCountries : [Text];
    };
  };

  public func run(old : OldActor) : NewActor {
    let textMap = OrderedMap.Make<Text>(Text.compare);
    let events = textMap.map<OldEvent, NewEvent>(
      old.events,
      func(_eventId, oldEvent) {
        {
          oldEvent with
          registrations = List.toArray(List.fromArray(oldEvent.registrations));
        };
      },
    );
    {
      userProfiles = old.userProfiles;
      events;
      configuration = old.configuration;
    };
  };
};
