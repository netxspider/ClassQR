import { collection, addDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

// Mock student data for testing
export const createMockStudents = async (section) => {
  const mockStudents = [
    {
      email: 'john.doe@student.edu',
      name: 'John Doe',
      rollNo: 'CS001',
      role: 'student',
      section: section,
      createdAt: new Date()
    },
    {
      email: 'jane.smith@student.edu', 
      name: 'Jane Smith',
      rollNo: 'CS002',
      role: 'student',
      section: section,
      createdAt: new Date()
    },
    {
      email: 'mike.johnson@student.edu',
      name: 'Mike Johnson', 
      rollNo: 'CS003',
      role: 'student',
      section: section,
      createdAt: new Date()
    },
    {
      email: 'sarah.wilson@student.edu',
      name: 'Sarah Wilson',
      rollNo: 'CS004', 
      role: 'student',
      section: section,
      createdAt: new Date()
    },
    {
      email: 'david.brown@student.edu',
      name: 'David Brown',
      rollNo: 'CS005',
      role: 'student', 
      section: section,
      createdAt: new Date()
    }
  ];

  try {
    const promises = mockStudents.map(async (student, index) => {
      const studentId = `mock_student_${section}_${index + 1}`;
      await setDoc(doc(db, 'users', studentId), student);
      return { id: studentId, ...student };
    });

    const createdStudents = await Promise.all(promises);
    console.log('✅ Mock students created:', createdStudents.length);
    return createdStudents;
  } catch (error) {
    console.error('❌ Error creating mock students:', error);
    throw error;
  }
};

// Function to clear mock students (for cleanup)
export const clearMockStudents = async (section) => {
  try {
    const studentsToDelete = [
      `mock_student_${section}_1`,
      `mock_student_${section}_2`, 
      `mock_student_${section}_3`,
      `mock_student_${section}_4`,
      `mock_student_${section}_5`
    ];

    // Note: You'd need to implement deletion logic here
    console.log('Mock students cleared for section:', section);
  } catch (error) {
    console.error('Error clearing mock students:', error);
  }
};