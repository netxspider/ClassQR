import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  setDoc, 
  getDoc,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

export const teacherService = {
  // Get all students with the same section as teacher
  async getStudentsBySection(section) {
    try {
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        where('section', '==', section)
      );
      
      const querySnapshot = await getDocs(studentsQuery);
      const students = [];
      
      querySnapshot.forEach((doc) => {
        students.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return students;
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },

  // Get today's attendance for a specific section
  async getTodayAttendance(section) {
    try {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD format
      
      const attendanceDoc = await getDoc(
        doc(db, 'attendance', `${section}_${dateString}`)
      );
      
      if (attendanceDoc.exists()) {
        return attendanceDoc.data();
      } else {
        return null; // No attendance taken today
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
  },

  // Create attendance record for today
  async createTodayAttendance(section, studentsList) {
    try {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      
      const attendanceData = {
        section: section,
        date: dateString,
        createdAt: new Date(),
        students: studentsList.map(student => ({
          id: student.id,
          name: student.name || student.email.split('@')[0], // Use email prefix if no name
          rollNo: student.rollNo || 'N/A',
          status: 'absent', // Default to absent
          timestamp: null
        })),
        totalStudents: studentsList.length,
        presentCount: 0,
        absentCount: studentsList.length
      };
      
      await setDoc(doc(db, 'attendance', `${section}_${dateString}`), attendanceData);
      return attendanceData;
    } catch (error) {
      console.error('Error creating attendance:', error);
      throw error;
    }
  },

  // Update attendance record
  async updateAttendance(section, attendanceData) {
    try {
      const today = new Date();
      const dateString = today.toISOString().split('T')[0];
      
      await setDoc(doc(db, 'attendance', `${section}_${dateString}`), {
        ...attendanceData,
        updatedAt: new Date()
      });
      
      return attendanceData;
    } catch (error) {
      console.error('Error updating attendance:', error);
      throw error;
    }
  },

  // Get recent attendance records
  async getRecentAttendance(section, days = 7) {
    try {
      // This would require more complex querying, for now return empty
      // In a full implementation, you'd query multiple date ranges
      return [];
    } catch (error) {
      console.error('Error fetching recent attendance:', error);
      throw error;
    }
  }
};