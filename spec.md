# EVENTCHAIN   Event Discovery and Management Platform

## Overview
A single-page web application for discovering and managing technology-related events globally. Users can browse and register for events, while authenticated organizers can create and manage their events. The platform supports both free and paid events with ICP token payments.

## Authentication
- Internet Identity integration for organizer authentication
- Public access for event browsing and registration
- Optimized backend actor initialization with pre-cached instances and connection pooling
- Enhanced actor initialization flow with minimal delays and non-blocking operations
- Robust connection retry mechanisms with exponential backoff for transient failures
- User-friendly connection status messages with improved loading indicators
- Automatic actor reinitialization with cached state preservation
- Connection health monitoring and automatic recovery from "Actor not available" errors

## Core Features

### Public Features (No Authentication Required)

#### Event Discovery
- Home page displays events in a responsive grid layout with smooth loading skeletons for enhanced perceived performance
- Hero section featuring professional technology networking image with tagline: "Connect with innovators, learn from experts, and grow your network at the world's best technology events."
- Each event card shows title, banner image, category, date, and price (free or ICP amount)
- Event cards navigate to dedicated shareable URLs at `/event/{eventId}`
- Search functionality by event title
- Filter options by category, date range, location, and price (free/paid)
- Sort events by date, newest, or relevance
- Infinite scroll or pagination for event listings
- Dark mode toggle with local storage persistence

#### Event Details and Registration
- Individual event detail pages accessible via `/event/{eventId}` with reliable shareable URLs
- Robust event loading with direct backend queries using eventId parameter from URL
- Enhanced retry mechanism with multiple fallback strategies for reliable data fetching on shared links and page refreshes
- Comprehensive error handling that prevents "Event not found" issues on dedicated event pages
- Optimized Query hook timing with intelligent caching and connection management
- Display event banner, title, description, category, date, location, and price
- Show event capacity and current attendee count
- OpenStreetMap integration with clickable map that opens exact coordinates in new tab using format `https://www.openstreetmap.org/?mlat={lat}&mlon={lng}`
- For free events: Registration form with name and email fields
- For paid events: Display ICP price and payment flow before registration
- ICP payment integration with mock Stripe-like modal for paid events
- Registration only completes after successful ICP payment for paid events
- Fully functional social sharing with reliable URL generation and cross-platform compatibility:
  - Twitter (X) button opens prefilled tweet with event title and correct shareable event URL
  - Facebook button opens Facebook share dialog with correct event URL
  - LinkedIn button opens LinkedIn sharing window with event link and title using correct URL
  - Copy Link button copies correct event URL to clipboard and displays success toast/message with improved feedback for desktop and mobile

#### Static Pages
- About page (`/about`) highlighting EVENTCHAIN's mission to connect global tech innovators, developers, and enthusiasts
- About page includes "Developed by Abdulsalam Amtech" section with link to Twitter profile (https://x.com/abdulsalamtech)
- Services page (`/services`) explaining features like event discovery, registration management, and organizer tools
- Services page emphasizes ICP blockchain-backed transparency and decentralized hosting
- Contact page (`/contact`) displaying contact details: Twitter links (https://x.com/abdulsalamtech, https://x.com/integralforceicp) and email (integralforceicp@gmail.com)

### Organizer Features (Authentication Required)

#### Event Management Dashboard
- Dashboard at `/dashboard` showing organizer's events with enhanced backend actor validation and retry logic
- Event summary statistics (attendees, remaining capacity, revenue for paid events)
- Create new events with comprehensive form including:
  - Title, description, category
  - Date and time selection
  - Location name with latitude/longitude coordinates
  - Banner image upload
  - Capacity setting
  - Paid event toggle and price input (in ICP tokens)
  - Publish/unpublish toggle
- Edit existing events including price modifications
- Delete events with confirmation modal
- All protected actions validate backend actor availability with automatic retry mechanisms

#### Registration Management
- View list of registrants for each event
- Display registrant details (name, email, registration date, payment status for paid events)
- Export registrations functionality (CSV/JSON)
- Generate mock tickets for registered users with QR code placeholder

## Navigation
- Header navigation includes links to Home, About, Services, Contact, and Dashboard (for authenticated users)
- Footer includes links to all static pages and social media

## Backend Data Storage

### Event Data
The backend stores events with the following information:
- Event ID, title, description, category
- Date (timestamp), location name, coordinates (latitude/longitude)
- Banner image URL, organizer ID, capacity
- Price (Nat in ICP tokens), isPaid boolean flag
- Publication status
- List of registrations containing user ID, name, email, registration timestamp, and payment status

### Core Backend Operations
- Create, read, update, and delete events with price information and enhanced error handling
- Manage event registrations and payment verification with retry mechanisms
- Filter and search events by various criteria including price with optimized queries
- Handle image uploads for event banners with improved reliability
- Process ICP token payments for paid events with transaction verification
- Implement connection health checks and automatic recovery mechanisms
- Optimize query performance and caching strategies for faster response times

## Technical Requirements
- Responsive design with mobile-first approach maintaining existing theme and accessibility
- Modern blue/purple color scheme for technology theme
- Accessibility features with high contrast and semantic HTML
- Local timezone formatting for all dates
- Enhanced loading states and comprehensive error handling for all operations
- Smooth loading skeletons for event cards and key sections to improve perceived performance
- File storage integration for event banner images with reliability improvements
- ICP token payment integration with user-friendly payment modals and error recovery
- Price display in ICP tokens throughout the application
- OpenStreetMap integration with clickable behavior for external navigation
- Optimized share link generation with cross-platform compatibility and improved user feedback
- Enhanced toast/tooltip notifications for copy link functionality across all devices
- Pre-cached backend actor initialization with connection pooling and health monitoring
- Improved event fetching reliability with intelligent retry strategies and fallback mechanisms
- Comprehensive validation of backend actor availability with automatic recovery
- End-to-end testing coverage for all event operations across refreshes and navigation
- Performance optimization for Query hooks with intelligent caching and timing
- Application content in English language
