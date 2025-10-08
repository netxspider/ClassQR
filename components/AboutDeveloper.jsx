import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const AboutDeveloper = () => {
  const developer = {
    name: "Arnavraj Singh",
    role: "Full Stack Developer & NSS Volunteer",
    bio: "A passionate developer dedicated to creating digital solutions for social causes. Currently pursuing Computer Science and actively involved in NSS activities, focusing on bridging technology and community service.",
    email: "arnavraj@example.com",
    phone: "+91 9876543210",
    location: "Purnia, Bihar, India",
    college: "Vikram Vinayak Institute of Technology",
    course: "B.Tech Computer Science Engineering",
    year: "Final Year (2024)",
    nssExperience: "3+ years",
    projects: "15+ Community Projects"
  };

  const skills = [
    { name: "React Native", level: 90, color: "#61dafb" },
    { name: "JavaScript", level: 85, color: "#f7df1e" },
    { name: "Firebase", level: 80, color: "#ffca28" },
    { name: "Node.js", level: 75, color: "#339933" },
    { name: "Python", level: 70, color: "#3776ab" },
    { name: "UI/UX Design", level: 65, color: "#ff6b6b" }
  ];

  const projects = [
    {
      name: "ClassQR - NSS Volunteer Management",
      description: "QR-based attendance system with location verification for NSS activities",
      tech: ["React Native", "Firebase", "Expo"],
      status: "Active",
      users: "500+ volunteers",
      icon: "qr-code"
    },
    {
      name: "VolunteerHub Portal",
      description: "Web platform for volunteer registration and activity management",
      tech: ["React", "Node.js", "MongoDB"],
      status: "Completed",
      users: "1000+ users",
      icon: "people"
    },
    {
      name: "Digital Literacy Initiative",
      description: "Mobile app teaching basic digital skills to rural communities",
      tech: ["React Native", "SQLite"],
      status: "In Progress",
      users: "200+ learners",
      icon: "book"
    },
    {
      name: "Community Health Tracker",
      description: "Health monitoring system for rural health camps",
      tech: ["Flutter", "Firebase"],
      status: "Beta",
      users: "50+ health workers",
      icon: "medical"
    }
  ];

  const achievements = [
    {
      title: "Best Student Developer Award 2024",
      organization: "VVIT College",
      date: "March 2024"
    },
    {
      title: "Outstanding NSS Volunteer",
      organization: "Bihar NSS Directorate",
      date: "January 2024"
    },
    {
      title: "Hackathon Winner - Social Impact",
      organization: "TechForGood Hackathon",
      date: "October 2023"
    },
    {
      title: "Community Service Excellence",
      organization: "NSS State Unit",
      date: "August 2023"
    }
  ];

  const socialLinks = [
    {
      platform: "LinkedIn",
      username: "arnavraj-singh",
      url: "https://linkedin.com/in/arnavraj-singh",
      icon: "logo-linkedin",
      color: "#0077b5"
    },
    {
      platform: "GitHub",
      username: "arnavraj",
      url: "https://github.com/arnavraj",
      icon: "logo-github",
      color: "#333333"
    },
    {
      platform: "Twitter",
      username: "@arnavraj_dev",
      url: "https://twitter.com/arnavraj_dev",
      icon: "logo-twitter",
      color: "#1da1f2"
    },
    {
      platform: "Instagram",
      username: "arnavraj.codes",
      url: "https://instagram.com/arnavraj.codes",
      icon: "logo-instagram",
      color: "#e4405f"
    }
  ];

  const openLink = (url) => {
    Linking.openURL(url);
  };

  const sendEmail = () => {
    Linking.openURL(`mailto:${developer.email}`);
  };

  const makeCall = () => {
    Linking.openURL(`tel:${developer.phone}`);
  };

  const SkillBar = ({ skill }) => (
    <View style={styles.skillContainer}>
      <View style={styles.skillHeader}>
        <Text style={styles.skillName}>{skill.name}</Text>
        <Text style={styles.skillPercentage}>{skill.level}%</Text>
      </View>
      <View style={styles.skillBarContainer}>
        <View 
          style={[
            styles.skillBarFill, 
            { 
              width: `${skill.level}%`, 
              backgroundColor: skill.color 
            }
          ]} 
        />
      </View>
    </View>
  );

  const ProjectCard = ({ project }) => (
    <View style={styles.projectCard}>
      <View style={styles.projectHeader}>
        <Ionicons name={project.icon} size={24} color="#3498db" />
        <View style={styles.projectTitleContainer}>
          <Text style={styles.projectName}>{project.name}</Text>
          <View style={[styles.statusBadge, { 
            backgroundColor: project.status === 'Active' ? '#27ae60' : 
                           project.status === 'Completed' ? '#2ecc71' : 
                           project.status === 'Beta' ? '#f39c12' : '#95a5a6'
          }]}>
            <Text style={styles.statusText}>{project.status}</Text>
          </View>
        </View>
      </View>
      
      <Text style={styles.projectDescription}>{project.description}</Text>
      
      <View style={styles.projectTech}>
        {project.tech.map((tech, index) => (
          <View key={index} style={styles.techBadge}>
            <Text style={styles.techText}>{tech}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.projectFooter}>
        <View style={styles.usersInfo}>
          <Ionicons name="people" size={14} color="#7f8c8d" />
          <Text style={styles.usersText}>{project.users}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Ionicons name="person" size={60} color="#ffffff" />
          </View>
        </View>
        
        <Text style={styles.developerName}>{developer.name}</Text>
        <Text style={styles.developerRole}>{developer.role}</Text>
        
        <View style={styles.contactButtons}>
          <TouchableOpacity style={styles.contactButton} onPress={sendEmail}>
            <Ionicons name="mail" size={20} color="#ffffff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactButton} onPress={makeCall}>
            <Ionicons name="call" size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* About Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About Me</Text>
        <Text style={styles.bioText}>{developer.bio}</Text>
        
        <View style={styles.infoGrid}>
          <View style={styles.infoCard}>
            <Ionicons name="school" size={24} color="#3498db" />
            <Text style={styles.infoLabel}>College</Text>
            <Text style={styles.infoValue}>{developer.college}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="book" size={24} color="#e74c3c" />
            <Text style={styles.infoLabel}>Course</Text>
            <Text style={styles.infoValue}>{developer.course}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="calendar" size={24} color="#f39c12" />
            <Text style={styles.infoLabel}>Year</Text>
            <Text style={styles.infoValue}>{developer.year}</Text>
          </View>
          
          <View style={styles.infoCard}>
            <Ionicons name="location" size={24} color="#27ae60" />
            <Text style={styles.infoLabel}>Location</Text>
            <Text style={styles.infoValue}>{developer.location}</Text>
          </View>
        </View>
      </View>

      {/* NSS Journey */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>NSS Journey</Text>
        <View style={styles.nssCard}>
          <View style={styles.nssHeader}>
            <Ionicons name="heart" size={32} color="#e74c3c" />
            <View style={styles.nssInfo}>
              <Text style={styles.nssTitle}>National Service Scheme</Text>
              <Text style={styles.nssSubtitle}>VVIT NSS Unit Volunteer</Text>
            </View>
          </View>
          
          <Text style={styles.nssDescription}>
            Passionate about community service and social development. Leading various initiatives 
            including digital literacy programs, health awareness campaigns, and environmental 
            conservation projects.
          </Text>
          
          <View style={styles.nssStats}>
            <View style={styles.nssStat}>
              <Text style={styles.nssStatValue}>{developer.nssExperience}</Text>
              <Text style={styles.nssStatLabel}>Experience</Text>
            </View>
            <View style={styles.nssStat}>
              <Text style={styles.nssStatValue}>{developer.projects}</Text>
              <Text style={styles.nssStatLabel}>Projects</Text>
            </View>
            <View style={styles.nssStat}>
              <Text style={styles.nssStatValue}>120+</Text>
              <Text style={styles.nssStatLabel}>Service Hours</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Skills */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Technical Skills</Text>
        {skills.map((skill, index) => (
          <SkillBar key={index} skill={skill} />
        ))}
      </View>

      {/* Projects */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Projects</Text>
        <Text style={styles.sectionDescription}>
          Some of the community-focused projects I've developed
        </Text>
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </View>

      {/* Achievements */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Achievements & Recognition</Text>
        {achievements.map((achievement, index) => (
          <View key={index} style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <Ionicons name="trophy" size={20} color="#f39c12" />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>{achievement.title}</Text>
              <Text style={styles.achievementOrg}>{achievement.organization}</Text>
              <Text style={styles.achievementDate}>{achievement.date}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* Social Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Connect With Me</Text>
        <View style={styles.socialGrid}>
          {socialLinks.map((link, index) => (
            <TouchableOpacity 
              key={index} 
              style={[styles.socialCard, { borderTopColor: link.color }]}
              onPress={() => openLink(link.url)}
            >
              <Ionicons name={link.icon} size={24} color={link.color} />
              <Text style={styles.socialPlatform}>{link.platform}</Text>
              <Text style={styles.socialUsername}>{link.username}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Contact Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Get In Touch</Text>
        <View style={styles.contactCard}>
          <Text style={styles.contactTitle}>Let's collaborate on projects that matter!</Text>
          <Text style={styles.contactDescription}>
            Always interested in discussing new opportunities, community projects, 
            or just connecting with fellow developers and volunteers.
          </Text>
          
          <View style={styles.contactInfo}>
            <TouchableOpacity style={styles.contactRow} onPress={sendEmail}>
              <Ionicons name="mail" size={20} color="#3498db" />
              <Text style={styles.contactText}>{developer.email}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.contactRow} onPress={makeCall}>
              <Ionicons name="call" size={20} color="#27ae60" />
              <Text style={styles.contactText}>{developer.phone}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          "Technology is best when it brings people together and serves the community."
        </Text>
        <Text style={styles.footerAuthor}>- Arnavraj Singh</Text>
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
    paddingBottom: 40,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginBottom: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#34495e',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#ffffff',
  },
  developerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  developerRole: {
    fontSize: 16,
    color: '#bdc3c7',
    marginBottom: 20,
  },
  contactButtons: {
    flexDirection: 'row',
  },
  contactButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 25,
    marginHorizontal: 10,
  },
  section: {
    margin: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 15,
    lineHeight: 20,
  },
  bioText: {
    fontSize: 16,
    color: '#2c3e50',
    lineHeight: 24,
    marginBottom: 20,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    width: (width - 45) / 2,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    textAlign: 'center',
  },
  nssCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nssHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  nssInfo: {
    marginLeft: 15,
  },
  nssTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  nssSubtitle: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '600',
  },
  nssDescription: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
    marginBottom: 20,
  },
  nssStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nssStat: {
    alignItems: 'center',
  },
  nssStatValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  nssStatLabel: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  skillContainer: {
    marginBottom: 20,
  },
  skillHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  skillName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  skillPercentage: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7f8c8d',
  },
  skillBarContainer: {
    height: 8,
    backgroundColor: '#ecf0f1',
    borderRadius: 4,
    overflow: 'hidden',
  },
  skillBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  projectCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  projectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  projectTitleContainer: {
    flex: 1,
    marginLeft: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
    marginBottom: 12,
  },
  projectTech: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  techBadge: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  techText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '600',
  },
  projectFooter: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 12,
  },
  usersInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  usersText: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 5,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  achievementIcon: {
    marginRight: 15,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 2,
  },
  achievementOrg: {
    fontSize: 13,
    color: '#3498db',
    marginBottom: 2,
  },
  achievementDate: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  socialGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  socialCard: {
    backgroundColor: '#ffffff',
    width: (width - 45) / 2,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderTopWidth: 3,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  socialPlatform: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 8,
  },
  socialUsername: {
    fontSize: 12,
    color: '#7f8c8d',
    marginTop: 2,
  },
  contactCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  contactDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
    marginBottom: 20,
  },
  contactInfo: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  contactText: {
    fontSize: 14,
    color: '#2c3e50',
    marginLeft: 12,
  },
  footer: {
    backgroundColor: '#2c3e50',
    padding: 30,
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#bdc3c7',
    textAlign: 'center',
    marginBottom: 10,
  },
  footerAuthor: {
    fontSize: 14,
    color: '#ecf0f1',
    fontWeight: 'bold',
  },
});

export default AboutDeveloper;