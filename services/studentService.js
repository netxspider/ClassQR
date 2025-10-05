import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../config/firebase';

class StudentService {
  // Get student's attendance history
  async getStudentAttendanceHistory(studentId, section) {
    try {
      console.log('📚 Fetching attendance history for student:', { studentId, section });
      
      const q = query(
        collection(db, 'attendance-history'),
        where('section', '==', section),
        orderBy('timestamp', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const attendanceHistory = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // Check if this student was present in this attendance session
        const studentPresent = data.scannedStudents?.some(student => 
          student.id === studentId || student.email?.includes(studentId)
        );
        
        if (studentPresent) {
          attendanceHistory.push({
            id: doc.id,
            ...data,
            studentData: data.scannedStudents.find(student => 
              student.id === studentId || student.email?.includes(studentId)
            )
          });
        }
      });
      
      console.log('📊 Found attendance records:', attendanceHistory.length);
      return attendanceHistory;
    } catch (error) {
      console.error('Error fetching student attendance:', error);
      throw error;
    }
  }

  // Get current month attendance statistics
  async getMonthlyAttendanceStats(studentId, section) {
    try {
      const attendanceHistory = await this.getStudentAttendanceHistory(studentId, section);
      
      // Get current month start and end
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);
      
      // Filter attendance for current month
      const monthlyAttendance = attendanceHistory.filter(record => {
        const recordDate = record.timestamp?.toDate ? record.timestamp.toDate() : new Date(record.timestamp);
        return recordDate >= monthStart && recordDate <= monthEnd;
      });

      // Calculate statistics
      const totalDaysPresent = monthlyAttendance.length;
      const totalWorkingDays = this.getWorkingDaysInMonth(currentYear, currentMonth);
      const attendancePercentage = totalWorkingDays > 0 ? (totalDaysPresent / totalWorkingDays) * 100 : 0;
      
      // Location verification stats
      const locationStats = monthlyAttendance.reduce((stats, record) => {
        const studentData = record.studentData;
        if (studentData?.locationVerification) {
          if (studentData.locationVerification.verified) {
            stats.verified++;
          } else {
            stats.unverified++;
          }
        } else {
          stats.noLocation++;
        }
        return stats;
      }, { verified: 0, unverified: 0, noLocation: 0 });

      // Recent attendance (last 7 days)
      const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
      const recentAttendance = monthlyAttendance.filter(record => {
        const recordDate = record.timestamp?.toDate ? record.timestamp.toDate() : new Date(record.timestamp);
        return recordDate >= sevenDaysAgo;
      });

      return {
        currentMonth: now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        totalDaysPresent,
        totalWorkingDays,
        attendancePercentage: Math.round(attendancePercentage * 100) / 100,
        daysAbsent: totalWorkingDays - totalDaysPresent,
        locationStats,
        recentAttendance: recentAttendance.length,
        monthlyAttendance: monthlyAttendance.map(record => ({
          date: record.date,
          timestamp: record.timestamp,
          method: record.method,
          locationVerified: record.studentData?.locationVerification?.verified || false,
          distance: record.studentData?.locationVerification?.distance || null
        }))
      };
    } catch (error) {
      console.error('Error calculating monthly stats:', error);
      throw error;
    }
  }

  // Calculate working days in a month (excluding weekends)
  getWorkingDaysInMonth(year, month) {
    const totalDays = new Date(year, month + 1, 0).getDate();
    let workingDays = 0;
    
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(year, month, day);
      const dayOfWeek = date.getDay();
      
      // Count Monday to Friday (1-5) as working days
      if (dayOfWeek >= 1 && dayOfWeek <= 5) {
        workingDays++;
      }
    }
    
    return workingDays;
  }

  // Get attendance trends (weekly breakdown)
  getAttendanceTrends(monthlyAttendance) {
    const weeks = {};
    
    monthlyAttendance.forEach(record => {
      const date = record.timestamp?.toDate ? record.timestamp.toDate() : new Date(record.timestamp);
      const weekNumber = Math.ceil(date.getDate() / 7);
      
      if (!weeks[weekNumber]) {
        weeks[weekNumber] = 0;
      }
      weeks[weekNumber]++;
    });
    
    return weeks;
  }
}

export const studentService = new StudentService();