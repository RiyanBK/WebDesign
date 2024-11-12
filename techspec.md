# Technical Specification: Rendez-View Web App

## Project Overview

**Rendez-View** is a scheduling web application aimed at making it easier for people to coordinate meeting times and locations with friends and groups. The app is targeted toward users aged 13 and up who enjoy social connection and discovering new places. Rendez-View provides AI-driven scheduling suggestions based on users' uploaded schedules and suggests nearby locations for meeting.

---

## Game Flow (Application Flow)

1. **User Registration and Login**  
   - Users create an account or log in to access the app’s scheduling features.
   - Integration with Google or Apple for single sign-on options.

2. **Uploading Calendar**  
   - Users import their schedules from Google Calendar or iCal.
   - The system parses the uploaded calendar data to determine available and busy blocks.

3. **Adding Friends and Viewing Schedules**  
   - Users add friends who also use Rendez-View and set permissions for viewing schedules.
   - Friends’ schedules are displayed alongside the user’s for easy comparison.

4. **AI-Driven Suggestion for Meeting Time and Location**  
   - The AI processes users’ schedules to identify common free slots.
   - Suggestions for nearby meeting places are generated using the Google Places API.

5. **Confirming and Customizing Schedules**  
   - Users can confirm the AI’s suggestions or manually select a time and location.

---

## Core Mechanics

### Calendar Upload
- **Description**: Allows users to upload schedules for analysis.
- **User Actions**: Import calendar data via API integration.
- **Technical**: Google Calendar and iCal API integration to retrieve event data.
- **Security**: OAuth2 is implemented to ensure secure calendar access with user consent.

### Friend Scheduling
- **Description**: Users add friends and gain access to view their schedules.
- **User Actions**: Add friends, view shared availability, select time slots.
- **Technical**: Friend list and permission system; database to store connections.
- **Security**: Access to friends' schedules is limited by user-defined permissions, ensuring that only authorized users can view each other's availability.

### AI Meeting Suggestions
- **Description**: The AI analyzes schedules and proposes the best meeting times and locations.
- **User Actions**: View, accept, or adjust suggestions.
- **Technical**: Algorithm for finding common free blocks and suggesting meeting places via Google Places APIs.
- **Security and Privacy**: Data used for AI suggestions remains anonymized to ensure that private schedule details aren’t exposed unintentionally.
---

## User Interface

### Main Dashboard
- **Components**: Calendar view, friend list, notification center for suggestions.
- **User Actions**: Toggle between personal calendar and friend schedule views.

### Friend Schedule View
- **Components**: Overlayed friend schedules for easy availability checks.
- **User Actions**: Manually select shared availability times.

### Meeting Suggestion View
- **Components**: AI-recommended times and locations displayed for confirmation.
- **User Actions**: Accept, modify, or reject suggestions.

---

## Technical Requirements

### Backend
- **API Integrations**: Google Calendar, iCal, and Google Places API for real-time data.
- **Data Storage**: Firebase or a similar database for storing user profiles, schedules, friendships, and AI suggestions.
- **AI Service**: The backend hosts an AI module that analyzes users' schedules to propose optimal meeting times and locations.

### Frontend
- **Framework**: Built with React, this client-side interface enables users to interact dynamically with calendar data, friends' schedules, and AI-generated meeting suggestions.
- **Responsiveness**: Design for accessibility on mobile and desktop.

---

## Data Flow

### Database Schemas
- **User Profile**: Contains data on user info, friend list, and calendar settings.
- **Schedules**: Parsed calendar data with busy/free time blocks for each user.
- **AI Suggestions**: Stores recommended meeting times and locations for users.

---

## Summary of Technologies
- **Frontend**: React
- **Backend**: Firebase, Google Calendar API, iCal API, Google Places API
- **Data Storage**: Firebase or compatible database for real-time updates

This technical specification provides a structured guide for developing the core functionalities of the Rendez-View web app, from initial user onboarding to AI-driven scheduling and UI requirements.

## Classes and Details

### User Class

**Variables:**
- `username` (String): Unique identifier for each user.
- `name` (String): User's name.
- `email` (String): User's email for Google login.
- `password` (String): User's password for login.
- `friends` (List<User>): List of user IDs representing user's friends.
- `permissions` (List<String>): Maps viewing permissions to each user.
- `schedule` (List<eventName, time>): User's schedule data.
- `location` (String): User's location.

**Methods:**
- `addFriend(friend_id)`: Adds a friend with the specified user ID `friend_id`.
- `setPermission(friend_id, level)`: Sets viewing permissions for a particular friend.
- `getPermission(friend_id)`: Returns viewing permissions for a particular friend.
- `uploadSchedule(calendar_data)`: Uploads raw schedule data from Google Calendar or iCal.
- `viewFriendSchedule(friend_id)`: Returns the schedule of a specified friend.
- `login(email, password)`: Authenticates a user with email and password.
- `login(user_id, password)`: Authenticates a user with username and password.


### Meeting Class

**Variables:**
- `meeting_id` (String): Unique identifier for each meeting.
- `time` (String): Time for the meeting.
- `location` (String): Location for the meeting.
- `accept` (boolean): Whether the meeting is accepted.

### MeetingManager Class

**Methods:**
- `pickMeeting(List<Meeting>)`: Uses an algorithm to suggest a list of meetings based on user's schedules and locations. Users update the `accept` variable based on their availability.
- `confirmMeeting(List<Meeting>)`: If both users accept a meeting, it adds the meeting to both users' schedules.

### Figma: https://www.figma.com/board/WU4elqiWFVf5RrE9gzy8SM/scheduling_app?node-id=0-1&node-type=canvas&t=ojyl2TwezApu8vAq-0