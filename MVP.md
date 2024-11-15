# MVP Implementation Plan

## Day 1-2 (Core Framework)
- Users
- Calendar
- Database setup

## Day 3-4 (Essential Features)
- Friends and Meetings
- UI and App

## Day 5 (Enhancement & Testing)
- UI and App Enhancements
- Final testing and refinement

## Users

**Priority:** [P0]
**Implementation Timeline:** [Day 1]

**Core Requirements:**
- Store user schedules and logins

**Technical Components:**
- Needs a database to maintain user data
- Class structure to create, update, and use user data

**Simplifications:**
- Friends list is P1
- Just holds calander class and does not automatically import

**Dependencies:**
- Database setup



## Calendar

**Priority:** [P0]
**Implementation Timeline:** [Day 1-2]

**Core Requirements:**
- Can create times when a user is blocked
- [Essential functionality 2]

**Technical Components:**
- Database storage for calendar
- I would recommend a subclass for meetings/scheduled times

**Simplifications:**
- Importing calendars from other sites is P2
- No security features
- No automatic comparison to friend's schedules

**Dependencies:**
- No dependencies to set up, but is dependent on user class for it to be interfaced with properly



## UI and App

**Priority:** [P0]
**Implementation Timeline:** [Day 2-4]

**Core Requirements:**
- Functioning website that can allows user login and view calendars
- User input on the site should be written to the database

**Technical Components:**
- Website
- Database

**Simplifications:**
- Website should be minimalized to only allow users to log in, and view calendars

**Dependencies:**
- Users and Calandars



## Meetings

**Priority:** [P1]
**Implementation Timeline:** [Day 4-5]

**Core Requirements:**
- Allow users to send meeting requests to friended users
- If accepted, this event should be added to both calendars

**Technical Components:**
- Database to store meetings and send requests

**Simplifications:**
- No AI comparison to friend schedules
- Users may have to manually check to check for schedule conflicts

**Dependencies:**
- Calendar and Friends List