# QR Code Scanning Troubleshooting Guide

## Common Issues and Solutions

### 📱 **Issue: Camera Permission Granted But No QR Detection**

#### **Possible Causes:**
1. **Camera not properly initialized**
2. **Barcode scanner not enabled**
3. **QR lock mechanism stuck**
4. **Focus/lighting issues**

#### **Solutions:**

##### **1. Check Camera Implementation**
```jsx
// Ensure proper camera setup
<CameraView
  style={styles.camera}
  facing="back"
  onBarcodeScanned={processing ? undefined : handleBarcodeScanned}
  barcodeScannerSettings={{
    barcodeTypes: ['qr'], // Focus only on QR codes
  }}
  enableBarCodeScanner={true} // Explicitly enable scanner
/>
```

##### **2. Reset Scanning State**
- Use the "Try Again" button in the camera interface
- Close and reopen camera modal
- Check debug logs for scanning status

##### **3. Test with Debug Button**
- Use "Test Scan (Debug)" button to verify QR processing logic
- This bypasses camera and tests the validation system directly

#### **Debug Steps:**
1. **Check Console Logs:**
   ```
   📷 Barcode detected: {type: 'qr', data: '...'}
   ✅ Processing QR scan...
   🔒 Scan blocked - already processing or locked
   ```

2. **Verify Camera Permissions:**
   ```
   📸 Requesting camera permission...
   ✅ Camera permission granted
   📱 Opening camera modal...
   ```

3. **Test Manual Reset:**
   - Tap "Reset Scanning" button in camera view
   - This clears any stuck locks

---

### 🔒 **Issue: QR Scanning Gets Stuck/Locked**

#### **Symptoms:**
- Camera opens but doesn't respond to QR codes
- Console shows "Scan blocked - already processing or locked"

#### **Solutions:**

##### **1. Manual Reset Function**
```jsx
const resetScanningState = () => {
  console.log('🔄 Manual reset triggered');
  qrLock.current = false;
  setProcessing(false);
  setScanning(true);
};
```

##### **2. Automatic Timeout Reset**
```jsx
// Add timeout to automatically reset stuck scans
useEffect(() => {
  let timeoutId;
  if (processing) {
    timeoutId = setTimeout(() => {
      console.log('⏰ Scan timeout - resetting');
      setProcessing(false);
      qrLock.current = false;
    }, 10000); // 10 second timeout
  }
  return () => clearTimeout(timeoutId);
}, [processing]);
```

---

### 📍 **Issue: Location Verification Failures**

#### **Common Error Messages:**
- "Location verification failed: You must be within 10 meters"
- "Location data not available"

#### **Solutions:**

##### **1. Check Location Permissions**
```jsx
const locationStatus = await LocationService.getLocationPermission();
if (locationStatus !== 'granted') {
  // Request location permission
  await LocationService.requestLocationPermission();
}
```

##### **2. Verify GPS Accuracy**
```jsx
const location = await LocationService.getCurrentLocation({
  accuracy: Location.Accuracy.High, // High accuracy required
  timeout: 10000,
  maximumAge: 60000
});
```

##### **3. Test Location Distance**
```jsx
// Check if you're really within 10 meters
console.log('Student location:', studentLocation);
console.log('Teacher location:', session.location);
console.log('Distance:', locationVerification.distance);
```

---

### ⏰ **Issue: QR Code Expiry Problems**

#### **Error Message:** "QR Code has expired (>30 seconds old)"

#### **Solutions:**

##### **1. Ensure Fresh QR Generation**
- Teacher should generate new QR codes for each session
- Don't reuse old QR codes

##### **2. Quick Scanning**
- Scan within 30 seconds of generation
- Have camera ready before teacher generates QR

##### **3. Check System Time**
```jsx
// Verify client-server time sync
console.log('Client time:', Date.now());
console.log('QR expiry time:', session.expiryTime);
console.log('Time difference:', session.expiryTime - Date.now());
```

---

### 🎓 **Issue: Section Mismatch Errors**

#### **Error Message:** "Section mismatch: This QR code is for section X"

#### **Solutions:**

##### **1. Verify Student Section**
```jsx
console.log('Student section:', studentData.section);
console.log('QR session section:', session.section);
```

##### **2. Check User Profile**
- Ensure student is enrolled in correct section
- Update section in Firebase user profile if needed

##### **3. Case Sensitivity**
- Section codes are case-sensitive
- "K24KS" ≠ "k24ks"

---

### 📶 **Issue: Network/Firebase Connection Problems**

#### **Symptoms:**
- "Session not found" errors
- Long delays in processing
- Firebase timeout errors

#### **Solutions:**

##### **1. Check Network Connection**
```jsx
// Test Firebase connection
const testConnection = async () => {
  try {
    const testRef = ref(rtdb, 'test');
    await set(testRef, { timestamp: Date.now() });
    console.log('✅ Firebase connection OK');
  } catch (error) {
    console.error('❌ Firebase connection failed:', error);
  }
};
```

##### **2. Firebase Rules Issues**
- Check Realtime Database rules
- Ensure proper authentication
- Verify read/write permissions

##### **3. Retry Mechanism**
```jsx
const scanWithRetry = async (sessionId, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await qrService.scanQRCode(sessionId, ...);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};
```

---

## Testing Checklist

### **Before Scanning:**
- [ ] Camera permission granted
- [ ] Location permission granted (if required)
- [ ] Good lighting conditions
- [ ] Stable internet connection
- [ ] Fresh QR code (< 30 seconds old)

### **During Scanning:**
- [ ] QR code clearly visible in frame
- [ ] Phone held steady
- [ ] Within 10 meters of teacher
- [ ] Correct section enrollment

### **Debug Tools:**
- [ ] Use "Test Scan (Debug)" button
- [ ] Check console logs for errors
- [ ] Try "Reset Scanning" if stuck
- [ ] Test with manual code entry

---

## Advanced Debugging

### **Console Log Analysis:**

#### **Successful Scan Flow:**
```
📷 Barcode detected: {type: 'qr', data: '1759663416419zxn76rnzt'}
✅ Processing QR scan...
📍 Getting student location for attendance...
📍 Location obtained: {latitude: 31.247, longitude: 75.703}
📍 Location verification: {verified: true, distance: 3.2}
✅ Attendance marked successfully!
```

#### **Failed Scan Flow:**
```
📷 Barcode detected: {type: 'qr', data: 'invalid-session'}
✅ Processing QR scan...
❌ QR Scan Error: Error: QR Code not found or session is not active
🔓 Resetting scan lock and processing state
```

### **Performance Monitoring:**
```jsx
// Add timing logs
const startTime = Date.now();
const result = await qrService.scanQRCode(...);
console.log(`⏱️ Scan completed in ${Date.now() - startTime}ms`);
```

### **Error Classification:**
1. **Camera Issues** - Hardware/permission problems
2. **Network Issues** - Firebase/connectivity problems  
3. **Validation Issues** - Business logic failures
4. **UI Issues** - State management problems

---

## Production Recommendations

1. **Remove Debug Button** - Only for development
2. **Add Error Analytics** - Track common failure patterns
3. **Implement Offline Support** - Cache for network issues
4. **Add Performance Monitoring** - Track scan success rates
5. **User Feedback System** - Report issues directly

---

## Emergency Fallbacks

1. **Manual Code Entry** - When camera fails
2. **Teacher Override** - Manual attendance marking
3. **Offline Mode** - Local storage with sync
4. **Alternative Methods** - Bluetooth, NFC, etc.

This guide covers the most common QR scanning issues and provides systematic solutions for each problem type.