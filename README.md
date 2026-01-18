# SquadUp (Vite + Tailwind)

Local dev:

1. npm install
2. npm run dev

Build:

- npm run build
- npm run preview

Notes: This project uses Vite, React 18, Tailwind CSS and lucide-react for icons. If the UI appears unstyled, ensure `src/index.css` is imported in `src/main.jsx` and Tailwind is configured (already included here).

---

## Firebase Setup (Firestore + Auth)

This project is configured to use Firebase Authentication (Email/Password and Google Sign-in) and Firestore for storing posts.

Steps:

1. Create a Firebase project in the Firebase Console.
2. Enable **Authentication** and turn on **Email/Password** and **Google** providers.
3. Enable **Firestore** in native mode.
4. Copy your Firebase config values into a `.env.local` file using the `.env.local.example` file as a template.

Example `.env.local`:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Run locally:

```
npm install
npm run dev
```

Deploying:

- When deploying (Firebase Hosting, Vercel, etc.) make sure to set the same environment variables for your hosting environment.

Security rules:

- Add Firestore rules that require authenticated users to write posts and allow public reads, e.g.:

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && request.auth.token.email == resource.data.authorEmail;
    }
  }
}
```
