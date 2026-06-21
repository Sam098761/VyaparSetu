import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Tamari Asali Clerk Key! 🔐
const PUBLISHABLE_KEY = "pk_test_cmVndWxhci1tYXJsaW4tMTcuY2xlcmsuYWNjb3VudHMuZGV2JA";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
