import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AchievementRecognition = () => {
  const achievements = [
    {
      id: 1,
      title: "Outstanding Volunteer Award 2024",
      recipient: "Arnavraj Singh",
      category: "Individual Excellence",
      date: "2024-09-15",
      description: "Recognized for exceptional community service and leadership in digital literacy programs",
      level: "National",
      icon: "trophy",
      color: "#f39c12"
    },
    {
      id: 2,
      title: "Best NSS Unit Award",
      recipient: "VVIT NSS Unit",
      category: "Institutional Excellence",
      date: "2024-08-20",
      description: "Awarded for innovative community development projects and volunteer engagement",
      level: "State",
      icon: "medal",
      color: "#e74c3c"
    },
    {
      id: 3,
      title: "Community Impact Champion",
      recipient: "Priyanka Sharma",
      category: "Social Impact",
      date: "2024-07-10",
      description: "Recognized for leading successful rural health awareness campaigns",
      level: "Regional",
      icon: "star",
      color: "#9b59b6"
    },
    {
      id: 4,
      title: "Innovation in Social Service",
      recipient: "Vikash Kumar",
      category: "Innovation",
      date: "2024-06-05",
      description: "Awarded for developing mobile-based solutions for community problem solving",
      level: "University",
      icon: "bulb",
      color: "#3498db"
    }
  ];

  const recognitionPrograms = [
    {
      title: "Volunteer of the Month",
      description: "Monthly recognition for outstanding volunteer contributions",
      criteria: "Minimum 20 hours of community service",
      reward: "Certificate + Special Badge",
      icon: "calendar",
      color: "#27ae60"
    },
    {
      title: "Leadership Excellence Award",
      description: "Annual award for exceptional leadership in NSS activities",
      criteria: "Leadership role + Impact assessment",
      reward: "Trophy + Cash Prize",
      icon: "ribbon",
      color: "#e67e22"
    },
    {
      title: "Community Hero Badge",
      description: "Special recognition for extraordinary community impact",
      criteria: "100+ service hours + Community testimonials",
      reward: "Special Badge + Media Recognition",
      icon: "shield-checkmark",
      color: "#8e44ad"
    }
  ];

  const hallOfFame = [
    { year: "2023", name: "Rahul Singh", achievement: "Best Project Leader" },
    { year: "2022", name: "Sneha Kumari", achievement: "Community Service Excellence" },
    { year: "2021", name: "Amit Kumar", achievement: "Innovation in Social Work" },
    { year: "2020", name: "Kavita Sharma", achievement: "Outstanding Volunteer" }
  ];

  const upcomingOpportunities = [
    {
      title: "NSS National Award 2024",
      deadline: "2024-11-15",
      category: "National Recognition",
      eligibility: "Outstanding volunteers with 2+ years experience"
    },
    {
      title: "Youth Leadership Award",
      deadline: "2024-10-30",
      category: "Leadership Excellence",
      eligibility: "Student leaders with proven impact"
    },
    {
      title: "Community Innovation Prize",
      deadline: "2024-12-01",
      category: "Innovation",
      eligibility: "Innovative community development projects"
    }
  ];

  const AchievementCard = ({ achievement }) => (
    <View style={[styles.achievementCard, { borderLeftColor: achievement.color }]}>
      <View style={styles.achievementHeader}>
        <View style={[styles.achievementIcon, { backgroundColor: achievement.color + '20' }]}>
          <Ionicons name={achievement.icon} size={28} color={achievement.color} />
        </View>
        <View style={styles.achievementInfo}>
          <Text style={styles.achievementTitle}>{achievement.title}</Text>
          <Text style={styles.achievementRecipient}>{achievement.recipient}</Text>
          <View style={styles.achievementMeta}>
            <Text style={styles.achievementLevel}>{achievement.level}</Text>
            <Text style={styles.achievementDate}>{new Date(achievement.date).toLocaleDateString()}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.achievementDescription}>{achievement.description}</Text>
      
      <View style={styles.categoryBadge}>
        <Text style={styles.categoryText}>{achievement.category}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="trophy" size={40} color="#ffffff" />
        <Text style={styles.headerTitle}>Achievement & Recognition</Text>
        <Text style={styles.headerSubtitle}>Celebrating Excellence in Service</Text>
      </View>

      {/* Recent Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        {achievements.map((achievement) => (
          <AchievementCard key={achievement.id} achievement={achievement} />
        ))}
      </View>

      {/* Recognition Programs */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recognition Programs</Text>
        <Text style={styles.sectionDescription}>
          Various awards and recognition opportunities available for volunteers
        </Text>
        
        {recognitionPrograms.map((program, index) => (
          <View key={index} style={styles.programCard}>
            <View style={styles.programHeader}>
              <Ionicons name={program.icon} size={24} color={program.color} />
              <Text style={styles.programTitle}>{program.title}</Text>
            </View>
            
            <Text style={styles.programDescription}>{program.description}</Text>
            
            <View style={styles.programDetails}>
              <View style={styles.detailRow}>
                <Ionicons name="checkmark-circle" size={16} color="#27ae60" />
                <Text style={styles.detailText}>Criteria: {program.criteria}</Text>
              </View>
              <View style={styles.detailRow}>
                <Ionicons name="gift" size={16} color="#e74c3c" />
                <Text style={styles.detailText}>Reward: {program.reward}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.applyButton}>
              <Text style={styles.applyButtonText}>Learn More</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Hall of Fame */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hall of Fame</Text>
        <View style={styles.hallOfFameContainer}>
          {hallOfFame.map((entry, index) => (
            <View key={index} style={styles.fameCard}>
              <Text style={styles.fameYear}>{entry.year}</Text>
              <Text style={styles.fameName}>{entry.name}</Text>
              <Text style={styles.fameAchievement}>{entry.achievement}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Upcoming Opportunities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming Opportunities</Text>
        <Text style={styles.sectionDescription}>
          Don't miss these upcoming recognition opportunities
        </Text>
        
        {upcomingOpportunities.map((opportunity, index) => (
          <View key={index} style={styles.opportunityCard}>
            <View style={styles.opportunityHeader}>
              <Text style={styles.opportunityTitle}>{opportunity.title}</Text>
              <View style={styles.deadlineBadge}>
                <Ionicons name="time" size={12} color="#e74c3c" />
                <Text style={styles.deadlineText}>
                  {new Date(opportunity.deadline).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            <Text style={styles.opportunityCategory}>{opportunity.category}</Text>
            <Text style={styles.opportunityEligibility}>{opportunity.eligibility}</Text>
            
            <TouchableOpacity style={styles.nominateButton}>
              <Text style={styles.nominateButtonText}>Nominate / Apply</Text>
              <Ionicons name="arrow-forward" size={16} color="#ffffff" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Call to Action */}
      <View style={styles.ctaSection}>
        <View style={styles.ctaContent}>
          <Ionicons name="star" size={48} color="#f39c12" />
          <Text style={styles.ctaTitle}>Nominate a Volunteer</Text>
          <Text style={styles.ctaText}>
            Know someone who deserves recognition? Nominate outstanding volunteers for awards and recognition.
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Submit Nomination</Text>
          </TouchableOpacity>
        </View>
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
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 10,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bdc3c7',
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    lineHeight: 20,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderLeftWidth: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  achievementHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  achievementIcon: {
    padding: 10,
    borderRadius: 10,
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 3,
  },
  achievementRecipient: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
    marginBottom: 5,
  },
  achievementMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievementLevel: {
    fontSize: 12,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  achievementDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  achievementDescription: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
    marginBottom: 15,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  programCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  programHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  programTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  programDescription: {
    fontSize: 14,
    color: '#2c3e50',
    marginBottom: 15,
    lineHeight: 20,
  },
  programDetails: {
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    color: '#2c3e50',
    marginLeft: 8,
  },
  applyButton: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  hallOfFameContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  fameCard: {
    backgroundColor: '#ffffff',
    width: (width - 45) / 2,
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  fameYear: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 5,
  },
  fameName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 3,
    textAlign: 'center',
  },
  fameAchievement: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  opportunityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderTopWidth: 3,
    borderTopColor: '#27ae60',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  opportunityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  opportunityTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
    marginRight: 10,
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffe6e6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  deadlineText: {
    fontSize: 10,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginLeft: 3,
  },
  opportunityCategory: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: '600',
    marginBottom: 8,
  },
  opportunityEligibility: {
    fontSize: 13,
    color: '#7f8c8d',
    marginBottom: 15,
    lineHeight: 18,
  },
  nominateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#27ae60',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
  },
  nominateButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginRight: 8,
  },
  ctaSection: {
    backgroundColor: '#ffffff',
    margin: 15,
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  ctaContent: {
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 10,
  },
  ctaText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    backgroundColor: '#f39c12',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AchievementRecognition;