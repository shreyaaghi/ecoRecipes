import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput,KeyboardAvoidingView, Platform, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const { width, height } = Dimensions.get('window');

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const starterPrompts = [
  {
    id: '1',
    text: "How do I start growing herbs at home?",
    icon: "eco",
    category: "Growing"
  },
  {
    id: '2', 
    text: "What vegetables can I grow in small spaces?",
    icon: "home",
    category: "Growing"
  },
  {
    id: '3',
    text: "How do I find local farmers markets?",
    icon: "location-on",
    category: "Local Sourcing"
  },
  {
    id: '4',
    text: "What foods are in season right now?",
    icon: "schedule",
    category: "Seasonal"
  },
  {
    id: '5',
    text: "How to preserve herbs and vegetables?",
    icon: "kitchen",
    category: "Preservation"
  },
  {
    id: '6',
    text: "Tips for composting food scraps",
    icon: "recycling",
    category: "Sustainability"
  }
];

const PromptCard = ({ prompt, onPress }: { prompt: typeof starterPrompts[0], onPress: () => void }) => (
  <TouchableOpacity style={styles.promptCard} onPress={onPress}>
    <View style={styles.promptHeader}>
      <MaterialIcons name={prompt.icon as any} size={24} color="#41BD4B" />
      <Text style={styles.promptCategory}>{prompt.category}</Text>
    </View>
    <Text style={styles.promptText}>{prompt.text}</Text>
  </TouchableOpacity>
);

const MessageBubble = ({ message }: { message: Message }) => (
  <View style={[
    styles.messageBubble,
    message.isUser ? styles.userMessage : styles.botMessage
  ]}>
    {!message.isUser && (
      <View style={styles.botIcon}>
        <MaterialIcons name="eco" size={16} color="white" />
      </View>
    )}
    <Text style={[
      styles.messageText,
      message.isUser ? styles.userMessageText : styles.botMessageText
    ]}>
      {message.text}
    </Text>
  </View>
);

const TipsAndTricksScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    // Add welcome message
    addBotMessage("🌱 Hi there! I'm your sustainable food assistant. I can help you with growing your own food, finding local ingredients, seasonal eating, and more eco-friendly food choices. Choose a prompt below or ask me anything!");
  }, []);

  const addBotMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: false,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const addUserMessage = (text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const callClaudeAPI = async (userMessage: string) => {
    setIsTyping(true);
    
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        addBotMessage("Sorry, you need to be logged in to chat with me. Please log in and try again!");
        setIsTyping(false);
        return;
      }

      const response = await axios.post(`${process.env.EXPO_PUBLIC_API_URL}/ai/sustainable-assistant`, {
        message: userMessage
      }, {
        headers: { "x-access-token": token },
        timeout: 15000
      });

      if (response.data && response.data.data && response.data.data.content) {
        const aiResponse = response.data.data.content[0].text;
        addBotMessage(aiResponse);
      } else {
        addBotMessage("Sorry, I'm having trouble processing your request right now. Please try again!");
      }
    } catch (error) {
      console.error('Error calling Claude API:', error);
      addBotMessage("Sorry, I'm experiencing some technical difficulties. Please try again in a moment!");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    
    addUserMessage(inputText);
    callClaudeAPI(inputText);
    setInputText('');
    
    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePromptPress = (prompt: string) => {
    addUserMessage(prompt);
    callClaudeAPI(prompt);
    
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <AntDesign name="left" size={20} color="#4BA9FF" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <View style={styles.chatHeader}>
            <MaterialIcons name="eco" size={28} color="white" />
            <View style={styles.headerText}>
              <Text style={styles.title}>EcoFood Assistant</Text>
              <Text style={styles.subtitle}>Your sustainable food guide</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Chat Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.chatContainer}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 ? (
          <View style={styles.welcomeContainer}>
            <MaterialIcons name="eco" size={60} color="#41BD4B" />
            <Text style={styles.welcomeTitle}>Welcome to EcoFood Assistant! 🌱</Text>
            <Text style={styles.welcomeText}>
              I'm here to help you make sustainable food choices. Choose a starter prompt below or ask me anything!
            </Text>
          </View>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
        
        {isTyping && (
          <View style={styles.typingIndicator}>
            <View style={styles.botIcon}>
              <MaterialIcons name="eco" size={16} color="white" />
            </View>
            <View style={styles.typingBubble}>
              <Text style={styles.typingText}>EcoFood Assistant is typing...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Starter Prompts - Show only when no messages */}
      {messages.length <= 1 && (
        <View style={styles.promptsContainer}>
          <Text style={styles.promptsTitle}>Try asking about:</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.promptsScroll}
          >
            {starterPrompts.map((prompt) => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onPress={() => handlePromptPress(prompt.text)}
              />
            ))}
          </ScrollView>
        </View>
      )}

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask about sustainable food practices..."
          placeholderTextColor="#999"
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!inputText.trim()}
        >
          <MaterialIcons 
            name="send" 
            size={24} 
            color={!inputText.trim() ? "#ccc" : "white"} 
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4BA9FF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 15,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  backButtonText: {
    color: '#4BA9FF',
    fontWeight: 'bold',
    fontSize: 14,
    marginLeft: 5,
  },
  headerInfo: {
    alignItems: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 20,
    width: '100%',
  },
  headerText: {
    marginLeft: 15,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  chatContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  welcomeContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  messageBubble: {
    flexDirection: 'row',
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
  },
  botMessage: {
    alignSelf: 'flex-start',
  },
  botIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#41BD4B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    marginTop: 5,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userMessageText: {
    color: 'white',
    backgroundColor: '#4BA9FF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomRightRadius: 5,
  },
  botMessageText: {
    color: '#2c3e50',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
    flex: 1,
  },
  typingIndicator: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  typingBubble: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 18,
    borderBottomLeftRadius: 5,
  },
  typingText: {
    color: '#999',
    fontStyle: 'italic',
  },
  promptsContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingLeft: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  promptsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  promptsScroll: {
    paddingRight: 15,
  },
  promptCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    width: 200,
    borderLeftWidth: 4,
    borderLeftColor: '#41BD4B',
  },
  promptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  promptCategory: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#41BD4B',
    marginLeft: 8,
    textTransform: 'uppercase',
  },
  promptText: {
    fontSize: 14,
    color: '#2c3e50',
    lineHeight: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: '#2c3e50',
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#41BD4B',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
});

export default TipsAndTricksScreen;