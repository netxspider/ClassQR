import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Resources = () => {
  const resourceCategories = [
    {
      title: "NSS Guidelines & Manuals",
      icon: "book",
      color: "#3498db",
      resources: [
        { name: "NSS Programme Guidelines", type: "PDF", size: "2.3 MB" },
        { name: "Volunteer Handbook", type: "PDF", size: "1.8 MB" },
        { name: "Camp Organization Manual", type: "PDF", size: "3.1 MB" },
        { name: "Project Implementation Guide", type: "PDF", size: "2.7 MB" }
      ]
    },
    {
      title: "Forms & Applications",
      icon: "document-text",
      color: "#27ae60",
      resources: [
        { name: "Volunteer Registration Form", type: "PDF", size: "0.5 MB" },
        { name: "Activity Report Template", type: "DOC", size: "0.3 MB" },
        { name: "Leave Application Form", type: "PDF", size: "0.2 MB" },
        { name: "Certificate Request Form", type: "PDF", size: "0.4 MB" }
      ]
    },
    {
      title: "Training Materials",
      icon: "school",
      color: "#e67e22",
      resources: [
        { name: "Leadership Training Module", type: "PPT", size: "5.2 MB" },
        { name: "Community Development Guide", type: "PDF", size: "4.1 MB" },
        { name: "First Aid Training Manual", type: "PDF", size: "3.8 MB" },
        { name: "Communication Skills Workshop", type: "PPT", size: "6.5 MB" }
      ]
    },
    {
      title: "Project Templates",
      icon: "folder",
      color: "#9b59b6",
      resources: [
        { name: "Community Survey Template", type: "XLS", size: "0.8 MB" },
        { name: "Budget Planning Sheet", type: "XLS", size: "0.6 MB" },
        { name: "Event Planning Checklist", type: "PDF", size: "1.2 MB" },
        { name: "Impact Assessment Form", type: "PDF", size: "0.9 MB" }
      ]
    },
    {
      title: "Media & Publicity",
      icon: "camera",
      color: "#e74c3c",
      resources: [
        { name: "NSS Logo Package", type: "ZIP", size: "2.1 MB" },
        { name: "Social Media Guidelines", type: "PDF", size: "1.5 MB" },
        { name: "Photography Guidelines", type: "PDF", size: "2.8 MB" },
        { name: "Press Release Templates", type: "DOC", size: "0.7 MB" }
      ]
    }
  ];

  const quickLinks = [
    { 
      title: "NSS Official Portal", 
      url: "https://nss.gov.in/", 
      icon: "globe", 
      description: "National Service Scheme official website" 
    },
    { 
      title: "VVIT Official Website", 
      url: "https://vvitpurnia.edu.in/", 
      icon: "school", 
      description: "Vishveshwarya Vishwavidyalaya Institute of Technology" 
    },
    { 
      title: "NSS Activity Portal", 
      url: "https://nssportal.nic.in/", 
      icon: "desktop", 
      description: "Online NSS activity management system" 
    },
    { 
      title: "Digital India", 
      url: "https://digitalindia.gov.in/", 
      icon: "phone-portrait", 
      description: "Digital India government initiatives" 
    }
  ];

  const handleResourceDownload = (resourceName) => {
    // In a real app, this would trigger download
    alert(`Downloading: ${resourceName}`);
  };

  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        alert("Unable to open this link");
      }
    } catch (error) {
      console.error('Error opening link:', error);
      alert("Error opening link");
    }
  };

  const ResourceCard = ({ category }) => (
    <View style={styles.resourceCard}>
      <View style={styles.categoryHeader}>
        <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
          <Ionicons name={category.icon} size={24} color={category.color} />
        </View>
        <Text style={styles.categoryTitle}>{category.title}</Text>
      </View>
      
      {category.resources.map((resource, index) => (
        <TouchableOpacity 
          key={index} 
          style={styles.resourceItem}
          onPress={() => handleResourceDownload(resource.name)}
        >
          <View style={styles.resourceInfo}>
            <Text style={styles.resourceName}>{resource.name}</Text>
            <View style={styles.resourceMeta}>
              <Text style={styles.resourceType}>{resource.type}</Text>
              <Text style={styles.resourceSize}>{resource.size}</Text>
            </View>
          </View>
          <Ionicons name="download" size={20} color="#27ae60" />
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="folder-open" size={40} color="#ffffff" />
        <Text style={styles.headerTitle}>Resources</Text>
        <Text style={styles.headerSubtitle}>NSS Documents & Materials</Text>
      </View>

      {/* Quick Links */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Links</Text>
        <View style={styles.quickLinksContainer}>
          {quickLinks.map((link, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.linkCard}
              onPress={() => handleLinkPress(link.url)}
            >
              <View style={styles.linkHeader}>
                <Ionicons name={link.icon} size={24} color="#3498db" />
                <View style={styles.linkInfo}>
                  <Text style={styles.linkTitle}>{link.title}</Text>
                  <Text style={styles.linkDescription}>{link.description}</Text>
                </View>
                <Ionicons name="open" size={16} color="#7f8c8d" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Resource Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Download Resources</Text>
        <Text style={styles.sectionDescription}>
          Access NSS guidelines, forms, training materials, and project templates
        </Text>
        
        {resourceCategories.map((category, index) => (
          <ResourceCard key={index} category={category} />
        ))}
      </View>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <View style={styles.helpHeader}>
          <Ionicons name="help-circle" size={32} color="#e67e22" />
          <Text style={styles.helpTitle}>Need Help?</Text>
        </View>
        <Text style={styles.helpText}>
          Can't find what you're looking for? Contact the NSS Program Office for additional resources and support.
        </Text>
        <TouchableOpacity style={styles.contactButton}>
          <Ionicons name="mail" size={16} color="#ffffff" />
          <Text style={styles.contactButtonText}>Contact NSS Office</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Resources are regularly updated to ensure you have the latest guidelines and materials.
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
  quickLinksContainer: {
    marginBottom: 10,
  },
  linkCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  linkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkInfo: {
    flex: 1,
    marginLeft: 15,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 3,
  },
  linkDescription: {
    fontSize: 13,
    color: '#7f8c8d',
  },
  resourceCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  categoryIcon: {
    padding: 12,
    borderRadius: 10,
    marginRight: 15,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    flex: 1,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  resourceInfo: {
    flex: 1,
  },
  resourceName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 4,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resourceType: {
    fontSize: 12,
    color: '#27ae60',
    backgroundColor: '#27ae6020',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    fontWeight: 'bold',
    marginRight: 10,
  },
  resourceSize: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  helpSection: {
    backgroundColor: '#ffffff',
    margin: 15,
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  helpTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginLeft: 10,
  },
  helpText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e67e22',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
  },
  contactButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  footer: {
    backgroundColor: '#ecf0f1',
    padding: 20,
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default Resources;