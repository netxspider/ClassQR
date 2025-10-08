import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ELibrary = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', icon: 'library' },
    { id: 'manuals', name: 'NSS Manuals', icon: 'book' },
    { id: 'research', name: 'Research Papers', icon: 'document-text' },
    { id: 'guidelines', name: 'Guidelines', icon: 'list' },
    { id: 'case-studies', name: 'Case Studies', icon: 'analytics' },
    { id: 'videos', name: 'Video Resources', icon: 'videocam' }
  ];

  const books = [
    {
      id: 1,
      title: "NSS: A Journey of Social Transformation",
      author: "Dr. Rajesh Kumar",
      category: 'manuals',
      type: 'PDF',
      pages: 245,
      size: '5.2 MB',
      rating: 4.5,
      description: "Comprehensive guide to NSS philosophy and implementation strategies",
      tags: ['NSS', 'Social Service', 'Youth Development']
    },
    {
      id: 2,
      title: "Community Development Through Youth Engagement",
      author: "Prof. Sunita Sharma",
      category: 'research',
      type: 'PDF',
      pages: 156,
      size: '3.1 MB',
      rating: 4.2,
      description: "Research-based insights on effective community development programs",
      tags: ['Community Development', 'Youth', 'Research']
    },
    {
      id: 3,
      title: "NSS Programme Implementation Guidelines 2024",
      author: "Ministry of Youth Affairs",
      category: 'guidelines',
      type: 'PDF',
      pages: 89,
      size: '2.8 MB',
      rating: 4.7,
      description: "Official guidelines for NSS program implementation and monitoring",
      tags: ['Guidelines', 'Implementation', 'Official']
    },
    {
      id: 4,
      title: "Rural Development Projects: Success Stories",
      author: "Dr. Amit Singh",
      category: 'case-studies',
      type: 'PDF',
      pages: 198,
      size: '4.3 MB',
      rating: 4.3,
      description: "Collection of successful rural development initiatives by NSS volunteers",
      tags: ['Rural Development', 'Success Stories', 'Projects']
    },
    {
      id: 5,
      title: "Leadership Training for Youth Workers",
      author: "National Youth Development Council",
      category: 'videos',
      type: 'MP4',
      pages: 0,
      size: '256 MB',
      rating: 4.6,
      description: "Video series on developing leadership skills in youth workers",
      tags: ['Leadership', 'Training', 'Video Series']
    },
    {
      id: 6,
      title: "Environmental Conservation Manual",
      author: "Green Earth Foundation",
      category: 'manuals',
      type: 'PDF',
      pages: 134,
      size: '6.7 MB',
      rating: 4.4,
      description: "Practical guide to environmental conservation activities for volunteers",
      tags: ['Environment', 'Conservation', 'Activities']
    }
  ];

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const BookCard = ({ book }) => (
    <View style={styles.bookCard}>
      <View style={styles.bookHeader}>
        <View style={styles.bookIcon}>
          <Ionicons 
            name={book.type === 'PDF' ? 'document-text' : 'videocam'} 
            size={32} 
            color={book.type === 'PDF' ? '#e74c3c' : '#3498db'} 
          />
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle}>{book.title}</Text>
          <Text style={styles.bookAuthor}>by {book.author}</Text>
          <View style={styles.bookMeta}>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color="#f39c12" />
              <Text style={styles.ratingText}>{book.rating}</Text>
            </View>
            <Text style={styles.bookSize}>{book.size}</Text>
            {book.pages > 0 && <Text style={styles.bookPages}>{book.pages} pages</Text>}
          </View>
        </View>
      </View>
      
      <Text style={styles.bookDescription}>{book.description}</Text>
      
      <View style={styles.tagContainer}>
        {book.tags.map((tag, index) => (
          <View key={index} style={styles.tag}>
            <Text style={styles.tagText}>{tag}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.bookActions}>
        <TouchableOpacity style={styles.readButton}>
          <Ionicons name={book.type === 'PDF' ? 'reader' : 'play'} size={16} color="#ffffff" />
          <Text style={styles.readButtonText}>
            {book.type === 'PDF' ? 'Read Now' : 'Watch Now'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.downloadButton}>
          <Ionicons name="download" size={16} color="#27ae60" />
          <Text style={styles.downloadButtonText}>Download</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="library" size={40} color="#ffffff" />
        <Text style={styles.headerTitle}>E-Library</Text>
        <Text style={styles.headerSubtitle}>NSS Digital Resources</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#7f8c8d" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books, authors, topics..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#7f8c8d" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false} 
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.selectedCategoryChip
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Ionicons 
              name={category.icon} 
              size={16} 
              color={selectedCategory === category.id ? '#ffffff' : '#7f8c8d'} 
            />
            <Text style={[
              styles.categoryText,
              selectedCategory === category.id && styles.selectedCategoryText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Books List */}
      <ScrollView style={styles.booksContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredBooks.length} {filteredBooks.length === 1 ? 'resource' : 'resources'} found
          </Text>
        </View>

        {filteredBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}

        {filteredBooks.length === 0 && (
          <View style={styles.noResults}>
            <Ionicons name="search" size={64} color="#bdc3c7" />
            <Text style={styles.noResultsTitle}>No resources found</Text>
            <Text style={styles.noResultsText}>
              Try adjusting your search terms or browse different categories
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
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
  searchContainer: {
    padding: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategoryChip: {
    backgroundColor: '#e74c3c',
  },
  categoryText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 5,
    fontWeight: '500',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  booksContainer: {
    flex: 1,
    padding: 15,
  },
  resultsHeader: {
    marginBottom: 15,
  },
  resultsCount: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  bookCard: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bookHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  bookIcon: {
    marginRight: 15,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  ratingText: {
    fontSize: 12,
    color: '#f39c12',
    marginLeft: 3,
    fontWeight: 'bold',
  },
  bookSize: {
    fontSize: 12,
    color: '#7f8c8d',
    marginRight: 15,
  },
  bookPages: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  bookDescription: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 20,
    marginBottom: 15,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  tag: {
    backgroundColor: '#ecf0f1',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
  },
  bookActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  readButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
    justifyContent: 'center',
  },
  readButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#27ae60',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    flex: 1,
    justifyContent: 'center',
  },
  downloadButtonText: {
    color: '#27ae60',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 10,
  },
  noResultsText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default ELibrary;