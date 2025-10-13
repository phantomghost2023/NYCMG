import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { API_BASE_URL } from 'nycmg-shared';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AIErrorHandler = () => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedError, setSelectedError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    loadErrors();
  }, []);

  const loadErrors = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/ai-error-handling/recent?limit=20`, {
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setErrors(data.errors || []);
      }
    } catch (error) {
      console.error('Failed to load errors:', error);
      Alert.alert('Error', 'Failed to load error data');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadErrors();
    setRefreshing(false);
  };

  const getToken = async () => {
    // Implementation to get stored token
    return 'your-token-here';
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return '#f44336';
      case 'HIGH': return '#ff9800';
      case 'MEDIUM': return '#2196f3';
      case 'LOW': return '#4caf50';
      default: return '#757575';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'error';
      case 'HIGH': return 'warning';
      case 'MEDIUM': return 'info';
      case 'LOW': return 'check-circle';
      default: return 'info';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const handleErrorPress = (error) => {
    setSelectedError(error);
    setModalVisible(true);
  };

  const sendChatMessage = async () => {
    if (!chatMessage.trim() || chatLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: chatMessage,
      timestamp: new Date().toISOString()
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setChatLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai-error-handling/chat`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: chatMessage,
          context: {
            component: 'mobile',
            userAgent: 'React Native',
            timestamp: new Date().toISOString()
          },
          errorId: selectedError?.id
        })
      });

      if (response.ok) {
        const data = await response.json();
        
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          message: data.response,
          timestamp: data.timestamp
        };

        setChatHistory(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setChatLoading(false);
    }
  };

  const renderErrorItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.errorItem, { borderLeftColor: getSeverityColor(item.severity) }]}
      onPress={() => handleErrorPress(item)}
    >
      <View style={styles.errorHeader}>
        <View style={styles.errorTitle}>
          <Icon
            name={getSeverityIcon(item.severity)}
            size={20}
            color={getSeverityColor(item.severity)}
          />
          <Text style={[styles.severityText, { color: getSeverityColor(item.severity) }]}>
            {item.severity}
          </Text>
        </View>
        <Text style={styles.timestampText}>
          {formatTimestamp(item.timestamp)}
        </Text>
      </View>
      
      <Text style={styles.errorMessage} numberOfLines={2}>
        {item.message}
      </Text>
      
      <View style={styles.errorFooter}>
        <Text style={styles.componentText}>
          {item.context?.component || 'Unknown'}
        </Text>
        <Text style={styles.statusText}>
          {item.status || 'pending'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderChatMessage = ({ item }) => (
    <View style={[
      styles.chatMessage,
      item.type === 'user' ? styles.userMessage : styles.aiMessage
    ]}>
      <Text style={styles.chatMessageText}>
        {item.message}
      </Text>
      <Text style={styles.chatTimestamp}>
        {formatTimestamp(item.timestamp)}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text style={styles.loadingText}>Loading errors...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Error Handler</Text>
        <TouchableOpacity onPress={loadErrors} style={styles.refreshButton}>
          <Icon name="refresh" size={24} color="#2196f3" />
        </TouchableOpacity>
      </View>

      {/* Error List */}
      <FlatList
        data={errors}
        renderItem={renderErrorItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
      />

      {/* Error Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Error Details</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
            >
              <Icon name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedError && (
            <ScrollView style={styles.modalContent}>
              {/* Error Info */}
              <View style={styles.errorInfo}>
                <View style={styles.errorInfoRow}>
                  <Text style={styles.errorInfoLabel}>Severity:</Text>
                  <Text style={[styles.errorInfoValue, { color: getSeverityColor(selectedError.severity) }]}>
                    {selectedError.severity}
                  </Text>
                </View>
                <View style={styles.errorInfoRow}>
                  <Text style={styles.errorInfoLabel}>Message:</Text>
                  <Text style={styles.errorInfoValue}>{selectedError.message}</Text>
                </View>
                <View style={styles.errorInfoRow}>
                  <Text style={styles.errorInfoLabel}>Component:</Text>
                  <Text style={styles.errorInfoValue}>
                    {selectedError.context?.component || 'Unknown'}
                  </Text>
                </View>
                <View style={styles.errorInfoRow}>
                  <Text style={styles.errorInfoLabel}>Timestamp:</Text>
                  <Text style={styles.errorInfoValue}>
                    {formatTimestamp(selectedError.timestamp)}
                  </Text>
                </View>
              </View>

              {/* AI Chat */}
              <View style={styles.chatSection}>
                <Text style={styles.chatSectionTitle}>AI Assistant</Text>
                
                <FlatList
                  data={chatHistory}
                  renderItem={renderChatMessage}
                  keyExtractor={(item) => item.id.toString()}
                  style={styles.chatHistory}
                />

                <View style={styles.chatInput}>
                  <TextInput
                    style={styles.chatInputField}
                    placeholder="Ask AI about this error..."
                    value={chatMessage}
                    onChangeText={setChatMessage}
                    multiline
                  />
                  <TouchableOpacity
                    style={[styles.sendButton, chatLoading && styles.sendButtonDisabled]}
                    onPress={sendChatMessage}
                    disabled={chatLoading}
                  >
                    {chatLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Icon name="send" size={20} color="#fff" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  refreshButton: {
    padding: 8,
  },
  listContainer: {
    padding: 16,
  },
  errorItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  errorTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: 'bold',
  },
  timestampText: {
    fontSize: 12,
    color: '#666',
  },
  errorMessage: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  errorFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  componentText: {
    fontSize: 12,
    color: '#666',
  },
  statusText: {
    fontSize: 12,
    color: '#2196f3',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  errorInfo: {
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  errorInfoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    width: 80,
  },
  errorInfoValue: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  chatSection: {
    flex: 1,
  },
  chatSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  chatHistory: {
    maxHeight: 200,
    marginBottom: 16,
  },
  chatMessage: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    maxWidth: '80%',
  },
  userMessage: {
    backgroundColor: '#2196f3',
    alignSelf: 'flex-end',
  },
  aiMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
  },
  chatMessageText: {
    fontSize: 14,
    color: '#333',
  },
  chatTimestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chatInput: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  chatInputField: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginRight: 8,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#2196f3',
    borderRadius: 8,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

export default AIErrorHandler;
