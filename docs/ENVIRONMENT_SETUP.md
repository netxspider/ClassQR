# Environment Variables Setup Guide

This guide explains how to configure environment variables for the ClassQR project.

## 📋 Quick Setup

1. **Copy the example file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file with your Firebase credentials:**
   ```bash
   nano .env  # or use your preferred editor
   ```

3. **Fill in your Firebase project details** (see below for how to get these values)

## 🔑 Getting Firebase Configuration Values

### Step 1: Access Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your ClassQR project (or create a new one)

### Step 2: Get Configuration Values
1. Click on **Settings gear ⚙️** → **Project settings**
2. Scroll down to **"Your apps"** section
3. Click on **Web app** (or add one if you haven't)
4. In the **SDK setup and configuration**, you'll see:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",           // → EXPO_PUBLIC_API_KEY
  authDomain: "project.firebaseapp.com",  // → EXPO_PUBLIC_AUTH_DOMAIN
  databaseURL: "https://project-default-rtdb.region.firebasedatabase.app", // → EXPO_PUBLIC_DATABASE_URL
  projectId: "your-project-id",  // → EXPO_PUBLIC_PROJECT_ID
  storageBucket: "project.firebasestorage.app", // → EXPO_PUBLIC_STORAGE_BUCKET
  messagingSenderId: "123456789", // → EXPO_PUBLIC_MESSAGING_SENDER_ID
  appId: "1:123:web:abc123",    // → EXPO_PUBLIC_APP_ID
  measurementId: "G-ABC123"     // → EXPO_PUBLIC_MEASUREMENT_ID
};
```

### Step 3: Copy Values to .env
Replace the placeholder values in your `.env` file:

```bash
# Replace 'your_api_key_here' with actual values from Firebase
EXPO_PUBLIC_API_KEY=AIzaSyAYTBHuWmrEeDTdBQDFLLyUJtqk1L6OPbI
EXPO_PUBLIC_AUTH_DOMAIN=classqr-d744c.firebaseapp.com
EXPO_PUBLIC_DATABASE_URL=https://classqr-d744c-default-rtdb.asia-southeast1.firebasedatabase.app
EXPO_PUBLIC_PROJECT_ID=classqr-d744c
EXPO_PUBLIC_STORAGE_BUCKET=classqr-d744c.firebasestorage.app
EXPO_PUBLIC_MESSAGING_SENDER_ID=87963962135
EXPO_PUBLIC_APP_ID=1:87963962135:web:1c1102d70587ce31470552
EXPO_PUBLIC_MEASUREMENT_ID=G-3PYSZLF4EW
```

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env` file in `.gitignore` (already configured)
- Use `.env.example` to document required variables
- Use `EXPO_PUBLIC_` prefix for client-side variables
- Validate environment variables before using them

### ❌ DON'T:
- Commit `.env` file to version control
- Share your `.env` file in public channels
- Include sensitive keys in screenshots or documentation
- Use environment variables for server-side secrets in client code

## 🧪 Testing Configuration

### Verify Environment Variables are Loaded:
```bash
npx expo start
```

You should see:
```
env: load .env
env: export EXPO_PUBLIC_API_KEY EXPO_PUBLIC_AUTH_DOMAIN...
```

### Debug Configuration Issues:
If you see errors like "Missing required environment variable", check that:

1. ✅ `.env` file exists in project root
2. ✅ All required variables are set (no empty values)
3. ✅ Variable names match exactly (case-sensitive)
4. ✅ No extra spaces around `=` sign
5. ✅ Values don't have quotes unless needed

## 🔧 Troubleshooting

### Problem: "Missing required environment variable"
**Solution:** Check that all required variables are in your `.env` file:
```bash
# Required variables:
EXPO_PUBLIC_API_KEY=...
EXPO_PUBLIC_AUTH_DOMAIN=...  
EXPO_PUBLIC_PROJECT_ID=...
EXPO_PUBLIC_APP_ID=...
```

### Problem: "Firebase configuration error"
**Solution:** Verify your Firebase project settings match the values in `.env`

### Problem: Environment variables not loading
**Solution:** 
1. Restart the Expo development server: `npx expo start --clear`
2. Check `.env` file format (no extra spaces, proper syntax)
3. Ensure `.env` is in the project root directory

## 📝 Development vs Production

### Development (.env)
- Use your development Firebase project
- Enable debug logging if needed
- Test with your own credentials

### Production
- Use CI/CD environment variables
- Never commit production secrets
- Use separate Firebase project for production

## 🚀 Deployment Notes

When deploying to production:

1. **Expo EAS Build:** Environment variables are automatically included
2. **Manual builds:** Ensure `.env` is available during build process
3. **CI/CD:** Set environment variables in your CI/CD system (GitHub Actions, etc.)

## 📞 Need Help?

If you're having trouble with environment variables:

1. Check this guide first
2. Verify your Firebase project is properly configured
3. Test with a fresh `.env` file copied from `.env.example`
4. Check the [Expo documentation](https://docs.expo.dev/guides/environment-variables/) for more details

---

**🔐 Remember: Never commit your actual `.env` file to version control!**