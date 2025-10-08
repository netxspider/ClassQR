import { db, auth } from '../config/firebase';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore';

export const volunteerService = {
  // Get volunteer statistics
  getVolunteerStats: async (volunteerId) => {
    try {
      const volunteerRef = doc(db, 'volunteers', volunteerId);
      const volunteerSnap = await getDoc(volunteerRef);
      
      if (!volunteerSnap.exists()) {
        return null;
      }

      const volunteerData = volunteerSnap.data();
      
      // Get activity records for this volunteer
      const activitiesQuery = query(
        collection(db, 'volunteerActivities'),
        where('volunteerId', '==', volunteerId),
        orderBy('date', 'desc')
      );
      
      const activitiesSnap = await getDocs(activitiesQuery);
      const activities = activitiesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Calculate statistics
      const totalActivities = activities.length;
      const attendedActivities = activities.filter(activity => activity.status === 'attended').length;
      const totalServiceHours = activities.reduce((total, activity) => total + (activity.hours || 0), 0);
      const attendancePercentage = totalActivities > 0 ? (attendedActivities / totalActivities) * 100 : 0;

      return {
        totalActivities,
        attendedActivities,
        serviceHours: totalServiceHours,
        attendancePercentage: Math.round(attendancePercentage * 10) / 10,
        volunteer: volunteerData,
        recentActivities: activities.slice(0, 5)
      };
    } catch (error) {
      console.error('Error getting volunteer stats:', error);
      throw error;
    }
  },

  // Mark activity attendance
  markActivityAttendance: async (volunteerId, activityId, location) => {
    try {
      const attendanceData = {
        volunteerId,
        activityId,
        timestamp: new Date().toISOString(),
        location: location ? {
          latitude: location.latitude,
          longitude: location.longitude,
          accuracy: location.accuracy
        } : null,
        status: 'attended'
      };

      const attendanceRef = doc(db, 'volunteerAttendance', `${volunteerId}_${activityId}`);
      await setDoc(attendanceRef, attendanceData);

      // Update activity record
      const activityRef = doc(db, 'volunteerActivities', activityId);
      const activitySnap = await getDoc(activityRef);
      
      if (activitySnap.exists()) {
        await updateDoc(activityRef, {
          [`volunteers.${volunteerId}`]: {
            status: 'attended',
            timestamp: attendanceData.timestamp,
            location: attendanceData.location
          }
        });
      }

      return attendanceData;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
  },

  // Get volunteer profile
  getVolunteerProfile: async (volunteerId) => {
    try {
      const volunteerRef = doc(db, 'volunteers', volunteerId);
      const volunteerSnap = await getDoc(volunteerRef);
      
      if (!volunteerSnap.exists()) {
        return null;
      }

      return {
        id: volunteerSnap.id,
        ...volunteerSnap.data()
      };
    } catch (error) {
      console.error('Error getting volunteer profile:', error);
      throw error;
    }
  },

  // Update volunteer profile
  updateVolunteerProfile: async (volunteerId, profileData) => {
    try {
      const volunteerRef = doc(db, 'volunteers', volunteerId);
      await updateDoc(volunteerRef, {
        ...profileData,
        updatedAt: new Date().toISOString()
      });
      
      return true;
    } catch (error) {
      console.error('Error updating volunteer profile:', error);
      throw error;
    }
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    try {
      const now = new Date().toISOString();
      const eventsQuery = query(
        collection(db, 'nssEvents'),
        where('date', '>=', now),
        orderBy('date', 'asc'),
        limit(10)
      );
      
      const eventsSnap = await getDocs(eventsQuery);
      const events = eventsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return events;
    } catch (error) {
      console.error('Error getting upcoming events:', error);
      throw error;
    }
  },

  // Get volunteer activities history
  getVolunteerActivities: async (volunteerId, limitCount = 20) => {
    try {
      const activitiesQuery = query(
        collection(db, 'volunteerActivities'),
        where('volunteerId', '==', volunteerId),
        orderBy('date', 'desc'),
        limit(limitCount)
      );
      
      const activitiesSnap = await getDocs(activitiesQuery);
      const activities = activitiesSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return activities;
    } catch (error) {
      console.error('Error getting volunteer activities:', error);
      throw error;
    }
  },

  // Get volunteer achievements
  getVolunteerAchievements: async (volunteerId) => {
    try {
      const achievementsQuery = query(
        collection(db, 'volunteerAchievements'),
        where('volunteerId', '==', volunteerId),
        orderBy('dateAwarded', 'desc')
      );
      
      const achievementsSnap = await getDocs(achievementsQuery);
      const achievements = achievementsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return achievements;
    } catch (error) {
      console.error('Error getting volunteer achievements:', error);
      throw error;
    }
  }
};