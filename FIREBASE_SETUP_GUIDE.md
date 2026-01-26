# 🔥 Firebase Setup Guide - Step by Step

This guide walks you through setting up Firebase (Auth + Firestore) for FC Manager Pro.

## ✅ Prerequisites

- A Firebase account: https://firebase.google.com/
- Project cloned locally
- `npm install` already run

## Step 1: Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click **Add project**
3. Name it (e.g., `fc-manager-pro`)
4. Finish the setup wizard

## Step 2: Add a Web App

1. In **Project settings → General**, click **Add app** → **Web**
2. Register the app (name it anything)
3. Copy the Firebase web configuration

## Step 3: Enable Email/Password Auth

1. Go to **Authentication → Sign-in method**
2. Enable **Email/Password**
3. Save changes

## Step 4: Create Firestore Database

1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **test mode** for local development
4. Pick a region close to you

## Step 5: Configure Environment Variables

1. Copy `.env.example` to `.env.local`
2. Paste your Firebase web config values:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## Step 6: Start the App

```bash
npm run dev
```

If everything is configured, the app should load without initialization errors.

---

### Notes
- This project uses Firebase Auth + Firestore (no Storage yet).
- Supabase setup is deprecated. See `SUPABASE_SETUP_GUIDE.md` for historical reference only.
