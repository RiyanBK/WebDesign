# WebDesign

# Rendez-View Web App

## Current Implementation Status
- [x] Users: Core authentication and user storage implemented
- [x] Calendar: Basic calendar interface created
- [x] Database: Firebase configuration complete
- [ ] Friends: Basic friend system: In progress; users are not showing up when searching in search tab. you need to use multiple email accounts to create multiple accounts in order to test this
- [ ] UI and App: In progress; basic calendar and search tabs' UI is created, but none of the other tabs
- [ ] AI Integration: Not started

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git

### Installation Steps

1. Clone the repository:
```bash
git clone [your-repository-url]
cd rendez-view
```

2. Install dependencies:
```bash
npm install
```

3. Install required packages:
```bash
npm install firebase lucide-react react react-dom
npm install -D tailwindcss postcss autoprefixer
```

4. Initialize Tailwind CSS:
```bash
npx tailwindcss init -p
```

5. Configure Firebase:
- Create a project at [Firebase Console](https://console.firebase.google.com)
- Enable Authentication (Email/Password)
- Enable Firestore Database
- Copy your Firebase config to `src/firebase.js`

### Starting the Development Server

```bash
npm run dev
```
Access the app at `http://localhost:5173`

NOTE: You are not testing this using `firebase serve`. You are testing this using npm hosting and React. In order to make code compatible with Firebase:

1. Convert file to js
```bash
npm run build
```

2. Copy files to Firebase
Move the files that were created in `WebDesign/rendez-view/dist` into  `WebDesign/public`.

3. Go back into Firebase and upload
```bash
cd ..
firebase serve
```

Do NOT edit the files created to copy into `WebDesign/public`. Edit all the files in the rendez-view directory and use `npm run dev` to test. When done testing, carry out the above steps.

## Project Structure
```
rendez-view/
├── src/
│   ├── components/
│   │   ├── CalendarApp.jsx
│   │   ├── EventModal.jsx
│   │   └── LoginForm.jsx
│   ├── App.jsx
│   ├── firebase.js
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## Features Implemented
- User authentication (signup/login)
- Basic calendar display
- Event creation

## Next Steps
- Friend search and requests
- Friend event display (in purple)
- Complete UI enhancements P2
- Add location integration P2
- Implement AI suggestions P2