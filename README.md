# 📱 ClassQR - Smart Attendance Management System

<div align="center">

![ClassQR Logo](./assets/icon.png)

**A modern, location-verified QR-based attendance system built with React Native & Firebase**

[![Expo SDK](https://img.shields.io/badge/Expo-54.0.12-blue.svg)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.4-green.svg)](https://reactnative.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange.svg)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/License-MIT-red.svg)](LICENSE)

</div>

---

## 🎯 **Overview**

ClassQR is a comprehensive mobile attendance management system that combines QR code technology with GPS location verification to ensure authentic attendance marking. Designed for educational institutions, it provides separate interfaces for teachers and students with real-time attendance tracking and analytics.

### ✨ **Key Features**

- 🔐 **Role-based Authentication** - Separate login for teachers and students
- 📍 **Location Verification** - GPS-based proximity checking (10-meter radius)
- ⏱️ **Real-time QR Codes** - 30-second expiry with automatic renewal
- 📊 **Attendance Analytics** - Monthly statistics and detailed reporting
- 🔒 **Security First** - Anti-spoofing measures and session management
- 📱 **Cross-platform** - Works on both iOS and Android devices

---

## 🚀 **Getting Started**

### **Prerequisites**

- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator or Android Emulator
- Physical device for location testing

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/netxspider/ClassQR.git
   cd ClassQR
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project
   - Enable Authentication, Firestore, and Realtime Database
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Update Firebase configuration in `config/firebase.js`

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - Scan QR code with Expo Go app (recommended for testing)
   - Or press `i` for iOS simulator, `a` for Android emulator

---

## 🏗️ **Project Structure**

```
ClassQR/
├── 📱 App.js                     # Main application entry point
├── 📄 app.json                   # Expo configuration & permissions
├── 📦 package.json               # Dependencies and scripts
├── 
├── 📁 components/                # Reusable UI components
│   ├── 🔐 Login.jsx             # Authentication login form
│   ├── 📝 Signup.jsx            # User registration form
│   └── 🎯 QRGenerator.jsx       # QR code generation & display
├── 
├── 📁 navigation/                # App navigation structure  
│   ├── 🧭 StackNavigation.jsx   # Main stack navigator
│   └── 📋 BottomTabNavigation.jsx # Role-based tab navigation
├── 
├── 📁 pages/                     # Authentication screens
│   └── 🔑 AuthScreen.jsx        # Login/signup switcher
├── 
├── 📁 Teacher/                   # Teacher-specific screens
│   ├── 📊 TDashboard.jsx        # Teacher dashboard & analytics
│   ├── 📝 AttendanceScreen.jsx  # QR generation & management
│   └── ✅ MarkAttendanceScreen.jsx # Student attendance review
├── 
├── 📁 Student/                   # Student-specific screens
│   ├── 📱 SDashboard.jsx        # Student dashboard & stats
│   └── 📷 SimpleScanQRScreen.jsx # QR scanning with location
├── 
├── 📁 services/                  # Business logic & API calls
│   ├── 🔥 firebase.js           # Firebase configuration
│   ├── 🎯 qrService.js          # QR session management
│   ├── 📍 locationService.js    # GPS & location utilities
│   └── 👤 studentService.js     # Student analytics & data
├── 
└── 📁 assets/                    # Images, icons & static files
    ├── 🎨 icon.png              # App icon
    ├── 🌟 splash-icon.png       # Splash screen
    └── 🎭 adaptive-icon.png     # Android adaptive icon
```

---

## 👥 **User Flows**

### 👨‍🏫 **Teacher Workflow**

1. **📋 Dashboard** - View total enrolled students and recent activity
2. **📝 Generate QR** - Create location-verified QR code (30-second expiry)
3. **✅ Mark Attendance** - Review and approve student scans in real-time
4. **📊 Analytics** - Access detailed attendance reports and statistics

### 👨‍🎓 **Student Workflow** 

1. **📱 Dashboard** - View monthly attendance percentage and history
2. **📷 Scan QR** - Camera-based QR scanning with location verification
3. **✅ Confirmation** - Instant feedback on attendance marking success
4. **📊 Track Progress** - Monitor attendance trends and monthly stats

---

## 🔧 **Core Technologies**

### **Frontend Framework**
- **React Native 0.81.4** - Cross-platform mobile development
- **Expo SDK 54.0.12** - Development platform and build tools
- **React Navigation 7** - Screen navigation and routing

### **Backend Services**
- **Firebase Authentication** - Secure user management
- **Firebase Firestore** - User profiles and persistent data
- **Firebase Realtime Database** - Live QR sessions and attendance

### **Key Libraries**
- **expo-camera 17.0.8** - Camera access and QR code scanning
- **expo-location 19.0.7** - GPS location services
- **react-native-qrcode-svg 6.3.15** - QR code generation
- **@react-native-async-storage/async-storage 2.2.0** - Local data storage

---

## 🛡️ **Security Features**

### **Authentication & Authorization**
- Role-based access control (Teacher/Student)
- Section-based user segregation
- Firebase Authentication integration
- Secure session management

### **Anti-Spoofing Measures**
- **Time-limited QR codes** (30-second expiry)
- **GPS location verification** (10-meter proximity)
- **Session-based validation** (server-side verification)
- **Real-time database** (prevents replay attacks)

### **Location Verification Process**
```
Teacher generates QR → Captures GPS coordinates → Stores in secure session
                                                          ↓
Student scans QR → Gets current GPS → Calculates distance → Validates <10m
```

---

## 📍 **Location Verification Details**

The app uses **Haversine formula** to calculate the great-circle distance between teacher and student locations:

```javascript
// Distance calculation in meters
const distance = calculateDistance(
  teacherLat, teacherLng,    // From QR session
  studentLat, studentLng     // From device GPS
);

// Verification rule
const isValid = distance <= 10; // Must be within 10 meters
```

**GPS Accuracy Requirements:**
- High accuracy mode enabled (`Location.Accuracy.High`)
- 15-second timeout for location acquisition
- Fallback to cached location (max 30 seconds old)

---

## 🎯 **QR Code Structure**

Generated QR codes contain the following JSON data:

```json
{
  "sessionId": "unique_session_identifier",
  "section": "student_section_code", 
  "timestamp": 1759665094677,
  "location": {
    "latitude": 12.9716,
    "longitude": 77.5946,
    "accuracy": 8.2,
    "timestamp": 1759665094500
  },
  "expiresAt": 1759665124677
}
```

---

## 📱 **Permissions Required**

### **iOS (Info.plist)**
```xml
<key>NSCameraUsageDescription</key>
<string>Camera access required for QR code scanning</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location access required for attendance verification</string>
```

### **Android (AndroidManifest.xml)**
```xml
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
```

---

## 🔥 **Firebase Configuration**

### **Required Services**
1. **Authentication** - Email/password authentication
2. **Firestore Database** - User profiles and persistent data  
3. **Realtime Database** - Live QR sessions and attendance tracking

### **Security Rules Example**

**Firestore Rules:**
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

**Realtime Database Rules:**
```json
{
  "rules": {
    "qr-sessions": {
      "$sessionId": {
        ".read": "auth != null",
        ".write": "auth != null"
      }
    }
  }
}
```

---

## 🧪 **Testing & Development**

### **Development Setup**
```bash
# Start development server
npm start

# Clear cache and restart
npx expo start --clear

# Run on specific platform
npx expo start --ios
npx expo start --android
```

### **Testing Location Features**
- **Physical device recommended** for GPS functionality
- **Enable location services** in device settings
- **Grant app permissions** for camera and location
- **Test in different locations** to verify 10-meter rule

### **Debugging Tools**
- Expo Developer Tools for debugging
- Console logs for QR generation and scanning
- Firebase Console for real-time data monitoring
- Location simulation in iOS Simulator

---

## 📊 **Analytics & Reporting**

### **Student Analytics**
- Monthly attendance percentage
- Daily attendance history
- Streak tracking and goals
- Attendance trends and insights

### **Teacher Analytics**  
- Section-wise attendance statistics
- Real-time attendance monitoring
- Historical attendance data
- Export capabilities (future feature)

---

## 🚀 **Deployment**

### **Building for Production**

1. **Configure app.json**
   ```json
   {
     "expo": {
       "name": "ClassQR",
       "version": "1.0.0",
       "platforms": ["ios", "android"]
     }
   }
   ```

2. **Build commands**
   ```bash
   # Build for iOS App Store
   expo build:ios --type archive
   
   # Build for Google Play Store  
   expo build:android --type app-bundle
   ```

3. **Over-the-Air Updates**
   ```bash
   # Publish updates instantly
   expo publish
   ```

---

## 🤝 **Contributing**

We welcome contributions to ClassQR! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow React Native best practices
- Write meaningful commit messages
- Test on both iOS and Android platforms
- Update documentation for new features

---

## 📋 **Roadmap**

### **Upcoming Features**
- [ ] 🌐 Web dashboard for teachers
- [ ] 📧 Email attendance reports
- [ ] 📈 Advanced analytics and insights
- [ ] 🔔 Push notifications for attendance
- [ ] 📱 Offline mode support
- [ ] 🎨 Customizable themes
- [ ] 📊 Export attendance data (CSV/PDF)
- [ ] 🔄 Integration with existing LMS platforms

---

## 🐛 **Known Issues**

- Location accuracy may vary based on device GPS capability
- QR scanning performance depends on camera quality
- Battery usage increases during active location monitoring
- Some Android devices may require location optimization disabled

---

## 📞 **Support**

### **Getting Help**
- 📖 Check the [Documentation](docs/)
- 🐛 Report issues on [GitHub Issues](https://github.com/netxspider/ClassQR/issues)
- 💬 Join our [Community Discord](discord-link)
- 📧 Email support: support@classqr.app

### **FAQ**
**Q: Why does location verification sometimes fail?**
A: Ensure GPS is enabled, app has location permissions, and you're testing on a physical device.

**Q: Can students mark attendance without being present?**
A: No. The app requires both QR code scanning and GPS verification within 10 meters.

**Q: How accurate is the location verification?**
A: Typical GPS accuracy is 3-5 meters outdoors, with 10-meter tolerance for classroom environments.

---

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 **Acknowledgments**

- **Expo Team** for the excellent development platform
- **Firebase Team** for robust backend services  
- **React Native Community** for continuous innovation
- **Open Source Contributors** who make projects like this possible

---

<div align="center">

**Made with ❤️ by [netxspider](https://github.com/netxspider)**

**⭐ Star this repo if you found it helpful!**

</div>