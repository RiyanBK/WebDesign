# MVP Implementation Plan

## Day 1-2 (Core Framework)
- Users  (COMPLETE)
- Calendar (COMPLETE)
- Database setup (COMPLETE)

## Day 3-4 (Essential Features)
- Friends and Meetings (IN PROGRESS)
- UI and App (IN PROGRESS)

## Day 5 (Enhancement & Testing)
- UI and App Enhancements (IN PROGRESS)
- Final testing and refinement (INCOMPLETE)

//more information in `README.md`

## Users

**Priority:** [P0]
**Implementation Timeline:** [Day 1]

**Core Requirements:**
- Store user schedules and logins (COMPLETE)

**Technical Components:**
- Needs a database to maintain user data (COMPLETE)
- Class structure to create, update, and use user data (COMPLETE)

**Simplifications:**
- Friends list is P1 (IN PROGRESS)
- Just holds calendar class and does not automatically import (IN PROGRESS)

**Dependencies:**
- Database setup


## Calendar

**Priority:** [P0]
**Implementation Timeline:** [Day 1-2]

**Core Requirements:**
- Can create times when a user is blocked (INCOMPLETE)

**Technical Components:**
- Database storage for calendar (COMPLETE)
- I would recommend a subclass for meetings/scheduled times

**Simplifications:**
- Importing calendars from other sites is P2 (INCOMPLETE)
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
- Users and Calendars



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


**Summary of Implementations from Employee work #1**

1. **Event Editing and Deletion:**
   - Implemented a dropdown menu on the calendar view events.
   - Clicking an event shows options to edit or delete.
   - **Edit**: Opens the event modal with pre-filled data, allowing the user to modify and save changes.
   - **Delete**: Removes the event from Firestore and the UI (requires correct Firestore rules).

2. **Friend Request System:**
   - In the "Search" tab, a user enters another user's exact email.
   - If a matching user is found (and not the current user), a confirmation option appears to send a friend request.
   - On confirmation, a success message appears.
   - The recipient sees the friend request under the "Messages" tab, with options to accept or reject.

3. **Profile Tab (Basic View):**
   - Clicking the "Profile" icon displays the user’s own email.
   - Shows a dropdown menu listing all accepted friends.
   - Each friend is accompanied by a unique colored square.

4. **Color-Coded Friend Events on the Calendar:**
   - User’s events remain red.
   - Each friend’s events have their own unique color, different from red.
   - Clicking a friend’s event shows a tooltip at the cursor’s position with the friend’s email.

**Addressing Permissions Errors:**
- "Missing or insufficient permissions" errors were encountered when viewing friend events, or deleting events due to Firestore security rules.
- I provided a `firestore.rules` file with appropriate permissions:
  - Users can read/write their own events.
  - Users can read their friends’ events (checked against their `friends` array).
  - Users can read/update friendship documents if they’re involved (as sender or receiver).
  - Users can delete their own events.
### note from riyan: the firestore.rules don't work and it needs different permissions to work
  
**How to Use the Provided Firestore Rules:**
1. **Local `firestore.rules` File:**
   - Place the provided rules in `firestore.rules` at your project root (or desired location).

2. **Using the Firebase Console (Optional):**
   - Copy and paste the rules into the Firebase Console under Firestore > Rules and publish them.

By following these steps and ensuring your data model matches the assumptions (events have `userId`, users have a `friends` array, friendships have `senderId`, `receiverId`, and `status`), the code and features should work smoothly without permission issues.
