import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

type FirebaseEnv = {
  apiKey: string
  authDomain: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId: string
}

function getFirebaseEnv(): FirebaseEnv {
  const {
    VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID,
  } = import.meta.env

  if (!VITE_FIREBASE_API_KEY) {
    throw new Error('Missing VITE_FIREBASE_API_KEY environment variable')
  }
  if (!VITE_FIREBASE_AUTH_DOMAIN) {
    throw new Error('Missing VITE_FIREBASE_AUTH_DOMAIN environment variable')
  }
  if (!VITE_FIREBASE_PROJECT_ID) {
    throw new Error('Missing VITE_FIREBASE_PROJECT_ID environment variable')
  }
  if (!VITE_FIREBASE_STORAGE_BUCKET) {
    throw new Error('Missing VITE_FIREBASE_STORAGE_BUCKET environment variable')
  }
  if (!VITE_FIREBASE_MESSAGING_SENDER_ID) {
    throw new Error('Missing VITE_FIREBASE_MESSAGING_SENDER_ID environment variable')
  }
  if (!VITE_FIREBASE_APP_ID) {
    throw new Error('Missing VITE_FIREBASE_APP_ID environment variable')
  }

  return {
    apiKey: VITE_FIREBASE_API_KEY,
    authDomain: VITE_FIREBASE_AUTH_DOMAIN,
    projectId: VITE_FIREBASE_PROJECT_ID,
    storageBucket: VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: VITE_FIREBASE_APP_ID,
  }
}

const firebaseConfig = getFirebaseEnv()

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
