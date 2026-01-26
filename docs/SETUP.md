# 🛠️ Setup Guide - FC Manager Pro

Complete installation and configuration guide for the FC Manager Pro project.

## Prerequisites

Before starting, ensure you have:
- **Node.js** 18+ installed ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** installed
- **VS Code** (recommended) or any code editor
- **Firebase account** ([Sign up](https://firebase.google.com/))

## 📦 Initial Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/fc-manager-pro.git
cd fc-manager-pro
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Environment Variables

Create a `.env.local` file in the root directory (copy from `.env.example`):

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: For development
VITE_APP_ENV=development
```

**How to get Firebase web config:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a project (or select an existing one)
3. In Project settings → General, add a Web app
4. Copy the Firebase config values into `.env.local`

### 4. Firebase Setup

#### A. Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project"
3. Choose a name (e.g., "fc-manager-pro")
4. Follow the setup steps

#### B. Enable Email/Password Auth

1. Open Authentication → Sign-in method
2. Enable **Email/Password**
3. Save changes

#### C. Create Firestore Database

1. Open Firestore Database → Create database
2. Start in **test mode** for local development
3. Choose a region close to you

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The app should open at `http://localhost:5173`

## 🔧 VS Code Setup

See [VSCODE_SETUP.md](VSCODE_SETUP.md) for recommended extensions and configuration.

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed architecture information.

## 🗄️ Database Schema

See [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) for the current data model (Supabase schema retained as historical reference).

## 🚀 Development Workflow

### Starting Development

1. Create a new branch for your feature:
   ```bash
   git checkout -b phase-1/feature-name
   ```

2. Follow the TODO checklist in `docs/phases/PHASE_X.md`

3. Run the dev server:
   ```bash
   npm run dev
   ```

4. Test your changes

5. Commit and push:
   ```bash
   git add .
   git commit -m "feat: description of changes"
   git push origin phase-1/feature-name
   ```

### Building for Production

```bash
npm run build
# or
yarn build
```

Preview production build:
```bash
npm run preview
# or
yarn preview
```

## 🔍 Troubleshooting

### Common Issues

**Issue: "Cannot find module 'firebase'"**
- Solution: Run `npm install`

**Issue: "Missing VITE_FIREBASE_API_KEY"**
- Solution: Check your `.env.local` file exists and has correct values
- Restart the dev server after adding env variables

**Issue: Firebase auth or Firestore fails**
- Solution: Verify Auth Email/Password is enabled in Firebase Console
- Ensure Firestore database is created
- Double-check your Firebase web config values

**Issue: TypeScript errors**
- Solution: Run `npm run type-check` to see all errors
- Ensure all dependencies are installed

### Getting Help

1. Check existing issues on GitHub
2. Review the documentation files
3. Create a new issue with detailed information

## 📝 Next Steps

Once setup is complete:
1. Read [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) to understand the architecture
2. Review [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) to understand data models
3. Start with [Phase 1 TODO](phases/PHASE_1.md)

## 🔐 Security Notes

- Never commit `.env.local` to Git (it's in `.gitignore`)
- Only use the Firebase **web** config values in the client
- Do not paste Firebase Admin SDK keys into the frontend
- Always validate user input on both client and server

## 🎯 Ready to Start?

You're all set! Head to [docs/phases/PHASE_1.md](phases/PHASE_1.md) to begin development.
