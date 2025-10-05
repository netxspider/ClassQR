import * as Location from 'expo-location';

export class LocationService {
  // Get current location with high accuracy
  static async getCurrentLocation() {
    try {
      console.log('📍 Requesting location permission for student...');
      
      // Request permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }
      
      console.log('✅ Location permission granted, getting position...');
      
      // Get current position with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeout: 15000, // 15 seconds timeout
        maximumAge: 30000 // Accept location up to 30 seconds old
      });
      
      const result = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp
      };
      
      console.log('📍 Student location obtained:', result);
      return result;
      
    } catch (error) {
      console.error('❌ Error getting student location:', error);
      throw error;
    }
  }
  
  // Check if location services are enabled
  static async isLocationEnabled() {
    try {
      const enabled = await Location.hasServicesEnabledAsync();
      return enabled;
    } catch (error) {
      console.error('Error checking location services:', error);
      return false;
    }
  }
  
  // Get location permission status
  static async getLocationPermission() {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status;
    } catch (error) {
      console.error('Error getting location permission:', error);
      return 'undetermined';
    }
  }
  
  // Request location permission
  static async requestLocationPermission() {
    try {
      console.log('📍 Requesting location permission...');
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('📍 Location permission status:', status);
      return status;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      throw error;
    }
  }
  
  // Calculate distance between two points (for validation)
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // distance in metres
  }
}