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
