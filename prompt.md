## Gemini Refined Prompt

Optimized Development Prompt for EVENTCHAIN

1. Project Overview & Objective

App Name: EVENTCHAIN
Purpose: A dynamic, modern web application for discovering, registering for, and managing technology-related events globally. The app must cater to two primary user types: public visitors seeking events and authenticated organizers managing their event content.
Goal: Create a responsive, single-page application (SPA) with real-time data synchronization.

2. Technology Stack & Data Storage

Frontend Framework: React (or modern Angular)

Styling: Tailwind CSS (fully responsive, mobile-first design)

Data Persistence & Realtime: Firebase Firestore for all data (events, registration, user profiles).

Authentication: Firebase Auth integration, utilizing provided custom tokens for initial user sign-in (signInWithCustomToken). User roles must be based on the authenticated userId.

Mapping: Integrate a mapping solution (e.g., Google Maps API or Leaflet) for event locations.

Design Principle: Single File Architecture (All components/logic in one file).

3. Data Model (Firestore Structure)

The application will use a central events collection and a registrations sub-collection for each event.

| Collection Path | Data Fields (Schema) | Description |
| /artifacts/{appId}/public/data/events/{eventId} | title (string), description (string), category (string - e.g., 'Web3', 'AI/ML', 'DevOps'), date (timestamp), locationName (string), geolocation (map: {lat, lng}), bannerImageUrl (string), organizerId (string - userId of creator), capacity (number), isPublished (boolean) | Main event data. |
| /artifacts/{appId}/public/data/events/{eventId}/registrations/{regId} | userId (string), name (string), email (string), registrationDate (timestamp) | List of users who have registered for this specific event. |

4. Public (Unauthenticated) Features

The application's home page must provide a rich, interactive experience for all visitors.

4.1. Event Listing & Filtering (Home Page)

Display: Show all published events in an attractive, modern card layout.

Search & Filter Bar:

Full-Text Search: Allow searching across title, description, and locationName.

Category Filter: Multi-select dropdown (e.g., AI/ML, Web3, Cybersecurity).

Date Filter: Filters for 'Today', 'This Week', 'Next 30 Days', or a custom date range.

Location Filter: A text input or dropdown to filter by city/state.

Sorting: Options to sort results by 'Date (Soonest First - Default)', 'Newest Posted', and 'Relevance (for search results)'.

Infinite Scroll/Pagination: Implement smooth loading for large lists of events.

4.2. Event Details & Registration

Dedicated Event Page: Each event must have a clean, unique URL (e.g., /event/{eventId}).

Visuals: Display the banner image prominently.

Location & Map: Embed a non-interactive Google Map showing the event location based on the stored geolocation (lat/lng).

Registration Form (Public): A simple form (Name, Email) to register. This action creates a document in the event's registrations sub-collection. Display current attendance/capacity status.

Sharing: A one-click button to copy the dedicated event URL to the clipboard and buttons for social media sharing (mocked).

4.3. Static Pages

Include navigable, basic content for:

Home (Event Listing)

About (App Mission, History)

Services (Features offered to Organizers)

Footer (Standard navigation, links).

5. Authenticated (Organizer) Features

Users who successfully authenticate via Internet Identity (handled by the provided __initial_auth_token mechanism) are considered Organizers.

5.1. Organizer Dashboard

A dedicated route (/dashboard) showing the organizer's activities.

My Events List: A list of all events created by the authenticated userId.

Quick Stats: For each event, display the total number of registered attendees and the remaining capacity.

Action Buttons: Links to 'Edit', 'View Registrations', and 'Delete' the event.

5.2. Event Management (CRUD)

Create/Edit Form: A comprehensive form allowing organizers to:

Input all events fields (Title, Description, Category, Date, Capacity, Location Name).

An input field for the Location Name that auto-suggests or is linked to the map interface to capture the geolocation (lat/lng).

Set the isPublished status.

Delete: A modal confirmation box (not alert()) before deleting an event and its associated registrations.

5.3. Registration Management

Registrant Viewer: A dedicated page or modal for organizers to view the list of people registered for their specific event.

Data Export: A button to mock exporting the list of registrants (Name, Email, Registration Date) as a CSV/JSON file (via console logging the data).

Ticket Mockup: Upon successful registration, display a mock 'ticket' card with the user's name, event title, and a placeholder for a QR Code.

6. UI/UX Requirements

Aesthetics: Modern, clean, professional design using a bright color palette (with an emphasis on deep blues or purples for tech themes). Use rounded corners and subtle shadows extensively.

Responsiveness: Perfect display across all screen sizes (mobile, tablet, desktop). The event cards should utilize a grid layout that adapts based on viewport width.

Dark Mode: Implement a toggle switch to enable/disable a persistent dark mode theme.

Loading States: Display a clear loading indicator while data is being fetched from Firestore or the LLM API.

Error Handling: Display user-friendly messages for form validation errors, network issues, and permission denial (e.g., non-organizer attempting to access /dashboard).

Accessibility: Ensure high contrast and use appropriate semantic HTML elements.

Time Zones: All event dates must be displayed in a user-friendly format, indicating the local time zone where the event is taking place.