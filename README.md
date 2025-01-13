# React Native Firebase Auth App

A sample React Native application demonstrating Firebase Authentication with email/password login, persistent sessions, and user profile management using Firestore. Built with Expo and TypeScript.

## Features

- 🔐 Email & Password Authentication
- 💾 Persistent Login Sessions
- 👤 User Profile Management
- 📱 Bottom Tab Navigation
- 🔄 Auto-login on App Restart
- 📦 Firestore Database Integration
- 🔍 TypeScript Support

## Tech Stack

- React Native with Expo
- Firebase Authentication
- Cloud Firestore
- React Navigation v6
- TypeScript
- AsyncStorage
- Expo Vector Icons

## Project Structure

```
src/
├── contexts/
│   └── AuthContext.tsx    # Authentication context and logic
├── navigation/
│   └── RootNavigator.tsx  # Navigation configuration
├── screens/
│   ├── HomeScreen.tsx     # Main dashboard screen
│   ├── LoginScreen.tsx    # User login screen
│   ├── ProfileScreen.tsx  # User profile management
│   └── RegisterScreen.tsx # New user registration
└── types.ts              # TypeScript type definitions
```

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd react-native-firebase-auth
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Create a new Firebase project
   - Enable Email/Password authentication
   - Create a Firestore database
   - Add your Firebase configuration in the app

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-messaging-sender-id",
  appId: "your-app-id"
};
```

4. Start the development server:
```bash
npx expo start
```

## Firebase Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication with Email/Password method
3. Create a Firestore database
4. Set up Firestore security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Core Functionality

### Authentication Flow
- Users can register with email, password, name, and phone number
- Login with email and password
- Automatic session persistence
- Secure logout functionality

### User Data Management
- User profiles stored in Firestore
- Local data caching with AsyncStorage
- Automatic profile loading on session restore
- Profile updates with real-time sync

### Navigation
- Protected routes for authenticated users
- Public routes for authentication screens
- Bottom tab navigation for main app screens
- Type-safe navigation with TypeScript

## User Profile Structure

```typescript
interface UserProfile {
  email: string;
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}
```

## Dependencies

```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/native-stack": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "firebase": "^10.x",
  "expo": "^49.x",
  "@expo/vector-icons": "^13.x"
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Navigation](https://reactnavigation.org/)
- [Expo Documentation](https://docs.expo.dev/)

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/react-native-firebase-auth](https://github.com/yourusername/react-native-firebase-auth)
