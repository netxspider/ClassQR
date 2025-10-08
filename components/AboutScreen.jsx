import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AboutScreen = () => {
  const nssHistory = `The National Service Scheme (NSS) was launched in Gandhiji's Birth Centenary Year 1969, in 37 Universities involving 40,000 students with the primary objective of developing the personality and character of the student youth through voluntary community service.`;

  const visionText = `To provide hands-on experience to young students in delivering community service and to strengthen their character and personality through community engagement.`;

  const missionText = `The mission of NSS is to engage students in meaningful community service activities that foster civic responsibility, leadership skills, and social awareness while contributing to national development.`;

  const objectives = [
    "Understand the community in which they work",
    "Understand themselves in relation to their community",
    "Identify the needs and problems of the community",
    "Develop among themselves a sense of social and civic responsibility",
    "Utilize their knowledge in finding practical solutions to individual and community problems",
    "Develop competence required for group-living and sharing of responsibilities",
    "Gain skills in mobilizing community participation",
    "Acquire leadership qualities and democratic attitudes",
    "Develop capacity to meet emergencies and natural disasters",
    "Practice national integration and social harmony"
  ];

  const achievements = [
    { year: "2020", achievement: "Best NSS Unit Award - State Level" },
    { year: "2021", achievement: "COVID Relief Camp - 500+ families served" },
    { year: "2022", achievement: "Tree Plantation Drive - 1000+ saplings planted" },
    { year: "2023", achievement: "Blood Donation Camp - 200+ units collected" },
    { year: "2024", achievement: "Digital Literacy Program - 300+ beneficiaries" }
  ];

  const organizationalStructure = {
    programOfficers: [
      { year: "2020-21", name: "Dr. Rajesh Kumar", position: "Program Officer" },
      { year: "2021-22", name: "Dr. Priya Sharma", position: "Program Officer" },
      { year: "2022-23", name: "Dr. Amit Singh", position: "Program Officer" },
      { year: "2023-24", name: "Dr. Sunita Devi", position: "Program Officer" },
      { year: "2024-25", name: "Dr. Manoj Kumar", position: "Program Officer" }
    ],
    assistantProgramOfficers: [
      { year: "2020-21", name: "Prof. Neha Gupta", position: "Assistant Program Officer" },
      { year: "2021-22", name: "Prof. Rahul Verma", position: "Assistant Program Officer" },
      { year: "2022-23", name: "Prof. Kavita Singh", position: "Assistant Program Officer" },
      { year: "2023-24", name: "Prof. Deepak Jha", position: "Assistant Program Officer" },
      { year: "2024-25", name: "Prof. Anita Kumari", position: "Assistant Program Officer" }
    ],
    studentLeaders: [
      { year: "2024-25", name: "Arnavraj Singh", position: "NSS Secretary" },
      { year: "2024-25", name: "Priyanka Sharma", position: "Joint Secretary" },
      { year: "2024-25", name: "Vikash Kumar", position: "Treasurer" },
      { year: "2024-25", name: "Sneha Kumari", position: "Cultural Coordinator" }
    ]
  };

  const committees = [
    { name: "Executive Committee", members: 8, focus: "Policy & Planning" },
    { name: "Event Management", members: 12, focus: "Program Coordination" },
    { name: "Community Outreach", members: 15, focus: "Social Service" },
    { name: "Documentation", members: 6, focus: "Record Keeping" },
    { name: "Finance & Audit", members: 5, focus: "Financial Management" }
  ];

  const SpecialCard = ({ title, children, icon, color = "#2c3e50" }) => (
    <View style={[styles.card, { borderLeftColor: color }]}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <Text style={[styles.cardTitle, { color }]}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons name="school" size={60} color="#e74c3c" />
        </View>
        <Text style={styles.mainTitle}>VVIT Purnia</Text>
        <Text style={styles.subtitle}>National Service Scheme Unit</Text>
        <Text style={styles.establishedText}>Established: 2018</Text>
      </View>

      {/* NSS History */}
      <SpecialCard title="NSS History" icon="library" color="#3498db">
        <Text style={styles.historyText}>{nssHistory}</Text>
      </SpecialCard>

      {/* Vision */}
      <SpecialCard title="Our Vision" icon="eye" color="#9b59b6">
        <Text style={styles.visionText}>{visionText}</Text>
      </SpecialCard>

      {/* Mission */}
      <SpecialCard title="Our Mission" icon="flag" color="#e67e22">
        <Text style={styles.missionText}>{missionText}</Text>
      </SpecialCard>

      {/* Objectives */}
      <SpecialCard title="NSS Objectives" icon="list" color="#27ae60">
        {objectives.map((objective, index) => (
          <View key={index} style={styles.objectiveItem}>
            <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
            <Text style={styles.objectiveText}>{objective}</Text>
          </View>
        ))}
      </SpecialCard>

      {/* College NSS Unit Details */}
      <SpecialCard title="VVIT NSS Unit" icon="business" color="#34495e">
        <View style={styles.unitDetail}>
          <Ionicons name="calendar" size={20} color="#34495e" />
          <Text style={styles.unitText}>Year of Establishment: 2018</Text>
        </View>
        <View style={styles.unitDetail}>
          <Ionicons name="people" size={20} color="#34495e" />
          <Text style={styles.unitText}>Active Volunteers: 150+</Text>
        </View>
        <View style={styles.unitDetail}>
          <Ionicons name="location" size={20} color="#34495e" />
          <Text style={styles.unitText}>Vishveshwarya Vishwavidyalaya Institute of Technology</Text>
        </View>
        <View style={styles.unitDetail}>
          <Ionicons name="mail" size={20} color="#34495e" />
          <Text style={styles.unitText}>nss@vvitpurnia.edu.in</Text>
        </View>
      </SpecialCard>

      {/* Achievements */}
      <SpecialCard title="Our Achievements" icon="trophy" color="#f39c12">
        {achievements.map((achievement, index) => (
          <View key={index} style={styles.achievementItem}>
            <View style={styles.achievementYear}>
              <Text style={styles.yearText}>{achievement.year}</Text>
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementText}>{achievement.achievement}</Text>
            </View>
          </View>
        ))}
      </SpecialCard>

      {/* Organizational Structure - Program Officers */}
      <SpecialCard title="Program Officers (Year Wise)" icon="person" color="#8e44ad">
        {organizationalStructure.programOfficers.map((officer, index) => (
          <View key={index} style={styles.officerItem}>
            <Text style={styles.officerYear}>{officer.year}</Text>
            <View>
              <Text style={styles.officerName}>{officer.name}</Text>
              <Text style={styles.officerPosition}>{officer.position}</Text>
            </View>
          </View>
        ))}
      </SpecialCard>

      {/* Assistant Program Officers */}
      <SpecialCard title="Assistant Program Officers" icon="people-circle" color="#16a085">
        {organizationalStructure.assistantProgramOfficers.map((officer, index) => (
          <View key={index} style={styles.officerItem}>
            <Text style={styles.officerYear}>{officer.year}</Text>
            <View>
              <Text style={styles.officerName}>{officer.name}</Text>
              <Text style={styles.officerPosition}>{officer.position}</Text>
            </View>
          </View>
        ))}
      </SpecialCard>

      {/* Student Leaders */}
      <SpecialCard title="Current Student Leaders (2024-25)" icon="star" color="#e74c3c">
        {organizationalStructure.studentLeaders.map((leader, index) => (
          <View key={index} style={styles.leaderItem}>
            <View style={styles.leaderIcon}>
              <Ionicons name="person-circle" size={24} color="#e74c3c" />
            </View>
            <View>
              <Text style={styles.leaderName}>{leader.name}</Text>
              <Text style={styles.leaderPosition}>{leader.position}</Text>
            </View>
          </View>
        ))}
      </SpecialCard>

      {/* Committees */}
      <SpecialCard title="NSS Committees" icon="git-network" color="#2ecc71">
        {committees.map((committee, index) => (
          <View key={index} style={styles.committeeItem}>
            <View style={styles.committeeHeader}>
              <Text style={styles.committeeName}>{committee.name}</Text>
              <View style={styles.membersBadge}>
                <Text style={styles.membersText}>{committee.members} members</Text>
              </View>
            </View>
            <Text style={styles.committeeFocus}>{committee.focus}</Text>
          </View>
        ))}
      </SpecialCard>

      {/* Special Cells */}
      <SpecialCard title="Special Cells" icon="medical" color="#c0392b">
        <View style={styles.cellItem}>
          <Ionicons name="heart" size={20} color="#c0392b" />
          <View style={styles.cellContent}>
            <Text style={styles.cellName}>Blood Cell</Text>
            <Text style={styles.cellDescription}>Organizes blood donation camps and maintains donor database</Text>
          </View>
        </View>
        <View style={styles.cellItem}>
          <Ionicons name="camera" size={20} color="#c0392b" />
          <View style={styles.cellContent}>
            <Text style={styles.cellName}>Media Cell</Text>
            <Text style={styles.cellDescription}>Documentation, photography, and social media management</Text>
          </View>
        </View>
      </SpecialCard>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          "NOT ME, BUT YOU" - NSS Motto
        </Text>
        <Text style={styles.footerSubText}>
          Serving the Nation • Building Character • Creating Leaders
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#2c3e50',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  logoContainer: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 50,
    marginBottom: 15,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#ecf0f1',
    textAlign: 'center',
    marginBottom: 5,
  },
  establishedText: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#ffffff',
    margin: 15,
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  cardContent: {
    marginTop: 5,
  },
  historyText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    textAlign: 'justify',
  },
  visionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    textAlign: 'justify',
    fontStyle: 'italic',
  },
  missionText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#2c3e50',
    textAlign: 'justify',
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  objectiveText: {
    fontSize: 15,
    color: '#2c3e50',
    marginLeft: 10,
    flex: 1,
    lineHeight: 22,
  },
  unitDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  unitText: {
    fontSize: 15,
    color: '#2c3e50',
    marginLeft: 10,
    flex: 1,
  },
  achievementItem: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  achievementYear: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    minWidth: 60,
  },
  yearText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  achievementContent: {
    flex: 1,
    marginLeft: 15,
  },
  achievementText: {
    fontSize: 15,
    color: '#2c3e50',
    fontWeight: '500',
  },
  officerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  officerYear: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: 'bold',
    minWidth: 70,
  },
  officerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  officerPosition: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  leaderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  leaderIcon: {
    marginRight: 15,
  },
  leaderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  leaderPosition: {
    fontSize: 14,
    color: '#e74c3c',
    marginTop: 2,
    fontWeight: '500',
  },
  committeeItem: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
  },
  committeeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  committeeName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  membersBadge: {
    backgroundColor: '#2ecc71',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  membersText: {
    fontSize: 12,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  committeeFocus: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  cellItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  cellContent: {
    flex: 1,
    marginLeft: 15,
  },
  cellName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 3,
  },
  cellDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  footer: {
    backgroundColor: '#2c3e50',
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  footerSubText: {
    fontSize: 14,
    color: '#bdc3c7',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default AboutScreen;