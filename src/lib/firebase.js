import { initializeApp } from 'firebase/app'
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Firebase configuration
// Use environment variables in production: define these with VITE_ prefix
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBtaSarfuXM9eOwXm3mT2bZtcTLoogPn7A',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'powderlegacy-b2111.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'powderlegacy-b2111',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'powderlegacy-b2111.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '410422679743',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:410422679743:web:aeb690ade10fa5e0118e0a',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-6R3FZDQN4G'
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)

// Initialize analytics only in supported environments (e.g., browsers)
let analytics = null
try {
  // Avoid SSR/window errors
  if (typeof window !== 'undefined') {
    analyticsSupported().then((ok) => {
      if (ok) analytics = getAnalytics(app)
    })
  }
} catch (_) {
  // ignore analytics errors
}

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export { analytics }
