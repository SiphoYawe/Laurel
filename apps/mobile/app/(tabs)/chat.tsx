import { Send, Bot, User, Sparkles } from "lucide-react-native";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { SuggestedPrompts } from "../../src/components/chat/SuggestedPrompts";

/**
 * Chat Screen - M2-1, M2-2, M2-3
 * AI coaching chat interface for Laurel
 * Features:
 * - Message bubbles with animations (M2-1)
 * - Keyboard handling (M2-1)
 * - Streaming AI responses with character-by-character display (M2-2)
 * - Thinking indicator with bouncing dots animation (M2-2)
 * - Auto-scroll to bottom as content arrives (M2-2)
 * - Graceful error handling with retry capability (M2-2)
 * - Blinking cursor during streaming (M2-2)
 * - Suggested prompts component (M2-3)
 */

// ChatMessage interface
interface ChatMessage {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
  isStreaming?: boolean;
}

// Streaming state type
type StreamingState = "idle" | "thinking" | "streaming" | "error";

// Mock AI responses for streaming simulation
const mockAIResponses = [
  "That's a great question! Building sustainable habits is all about starting small and being consistent. The key insight from Atomic Habits is that tiny changes compound over time into remarkable results. What specific area would you like to focus on first?",
  "I love your commitment to self-improvement! Here's what I recommend: Start with a habit so small it's almost impossible to fail. Want to exercise? Start with putting on your workout shoes. Want to read more? Start with one page. This builds the identity of someone who shows up. Shall we design a specific tiny habit for your goal?",
  "Great insight! The Two-Minute Rule is powerful because it helps you overcome the initial resistance. Here's how to apply it:\n\n1. Scale your habit down to 2 minutes\n2. Focus on showing up, not performance\n3. Gradually increase duration over time\n\nWhat habit would you like to apply this to?",
  "I understand the frustration of breaking habits. Here's the secret: don't try to be perfect, try to be consistent. Missing once is human, missing twice is the start of a new habit. When you slip, get back on track immediately. What's causing you to break your habits?",
  'Habit stacking is one of my favorite techniques! It works by linking a new habit to an existing one. The formula is:\n\n"After I [CURRENT HABIT], I will [NEW HABIT]."\n\nFor example:\n- After I pour my morning coffee, I will write one sentence in my journal.\n- After I sit down for dinner, I will say one thing I\'m grateful for.\n\nWhat existing habit could you stack a new one onto?',
];

// Laurel brand colors
const colors = {
  forest: "#2D5A3D",
  forestLight: "#3A7350",
  sage: "#7CB07F",
  sageLight: "#A5CDA7",
  sageMuted: "#E8F2E9",
  amber: "#E8A54B",
  amberLight: "#F0C078",
  charcoal: "#1A1A1A",
  white: "#FAFAF8",
  cream: "#F7F5F0",
  warmGray: "#F0EDE8",
  gray100: "#E8E5E0",
  gray200: "#D4D0C8",
  gray400: "#9A958C",
  gray500: "#6B6660",
  gray600: "#4A4640",
};

// Mock data for testing
const mockMessages: ChatMessage[] = [
  {
    id: "1",
    content:
      "Hi! I'm your Laurel Coach. I'm here to help you build lasting habits and achieve your goals. What would you like to work on today?",
    role: "assistant",
    timestamp: new Date(Date.now() - 300000),
  },
  {
    id: "2",
    content: "I want to start exercising regularly but I always give up after a week.",
    role: "user",
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: "3",
    content:
      'That\'s a common challenge! The key is to make the habit so small that it\'s impossible to fail. Instead of "exercise for 30 minutes," try "put on my workout shoes." This is the Two-Minute Rule from Atomic Habits.\n\nOnce you\'ve built the identity of someone who shows up, you can gradually increase intensity. What time of day works best for you?',
    role: "assistant",
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: "4",
    content: "Morning would be ideal, before work starts.",
    role: "user",
    timestamp: new Date(Date.now() - 120000),
  },
  {
    id: "5",
    content:
      "Perfect! Morning exercise has the advantage of fewer scheduling conflicts. Here's your habit stack:\n\n1. After I wake up (existing habit)\n2. I will put on my workout shoes (tiny habit)\n3. Then I'll do 2 minutes of movement\n\nShall I help you set up a reminder and track this habit?",
    role: "assistant",
    timestamp: new Date(Date.now() - 60000),
  },
];

const suggestedPrompts = [
  "How do I build a morning routine?",
  "I keep breaking my habits",
  "What's habit stacking?",
  "Help me stay motivated",
];

// Message bubble component
function MessageBubble({ message, isLast }: { message: ChatMessage; isLast: boolean }) {
  const isUser = message.role === "user";
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(isUser ? 20 : -20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Animated.View
      style={[
        styles.messageRow,
        isUser ? styles.messageRowUser : styles.messageRowAssistant,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
        isLast && styles.lastMessage,
      ]}
    >
      {/* Avatar for assistant */}
      {!isUser && (
        <View style={styles.avatarContainer}>
          <View style={styles.assistantAvatar}>
            <Bot color={colors.white} size={16} strokeWidth={2.5} />
          </View>
        </View>
      )}

      <View style={[styles.messageBubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.messageText, isUser ? styles.userText : styles.assistantText]}>
          {message.content}
        </Text>
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.assistantTimestamp]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>

      {/* Avatar for user */}
      {isUser && (
        <View style={styles.avatarContainer}>
          <View style={styles.userAvatar}>
            <User color={colors.white} size={16} strokeWidth={2.5} />
          </View>
        </View>
      )}
    </Animated.View>
  );
}

// Thinking indicator component - bouncing dots animation
function ThinkingIndicator() {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in the indicator
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    // Bouncing animation for each dot
    const animateDot = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 250,
            useNativeDriver: true,
          }),
        ])
      );
    };

    const animation = Animated.parallel([
      animateDot(dot1, 0),
      animateDot(dot2, 150),
      animateDot(dot3, 300),
    ]);

    animation.start();

    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={[styles.messageRow, styles.messageRowAssistant, { opacity: fadeAnim }]}>
      <View style={styles.avatarContainer}>
        <View style={styles.assistantAvatar}>
          <Bot color={colors.white} size={16} strokeWidth={2.5} />
        </View>
      </View>
      <View style={[styles.messageBubble, styles.assistantBubble, styles.thinkingBubble]}>
        <Text style={styles.thinkingLabel}>Thinking</Text>
        <View style={styles.thinkingDots}>
          {[dot1, dot2, dot3].map((dot, index) => (
            <Animated.View
              key={index}
              style={[
                styles.thinkingDot,
                {
                  opacity: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.4, 1],
                  }),
                  transform: [
                    {
                      translateY: dot.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -6],
                      }),
                    },
                    {
                      scale: dot.interpolate({
                        inputRange: [0, 1],
                        outputRange: [1, 1.15],
                      }),
                    },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </Animated.View>
  );
}

// Streaming message bubble - displays content as it streams
function StreamingMessageBubble({ content, timestamp }: { content: string; timestamp: Date }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-20)).current;
  const cursorOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 100,
        friction: 12,
        useNativeDriver: true,
      }),
    ]).start();

    // Blinking cursor animation
    const cursorAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    cursorAnimation.start();

    return () => cursorAnimation.stop();
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Animated.View
      style={[
        styles.messageRow,
        styles.messageRowAssistant,
        {
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.assistantAvatar}>
          <Bot color={colors.white} size={16} strokeWidth={2.5} />
        </View>
      </View>
      <View style={[styles.messageBubble, styles.assistantBubble]}>
        <View style={styles.streamingTextContainer}>
          <Text style={[styles.messageText, styles.assistantText]}>{content}</Text>
          <Animated.View style={[styles.streamingCursor, { opacity: cursorOpacity }]} />
        </View>
        <Text style={[styles.timestamp, styles.assistantTimestamp]}>{formatTime(timestamp)}</Text>
      </View>
    </Animated.View>
  );
}

// Error message component for stream errors
function StreamErrorMessage({ onRetry }: { onRetry: () => void }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.messageRow, styles.messageRowAssistant, { opacity: fadeAnim }]}>
      <View style={styles.avatarContainer}>
        <View style={[styles.assistantAvatar, styles.errorAvatar]}>
          <Bot color={colors.white} size={16} strokeWidth={2.5} />
        </View>
      </View>
      <View style={[styles.messageBubble, styles.assistantBubble, styles.errorBubble]}>
        <Text style={styles.errorText}>Something went wrong. Please try again.</Text>
        <TouchableOpacity activeOpacity={0.7} style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

export default function ChatScreen() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [streamingState, setStreamingState] = useState<StreamingState>("idle");
  const [streamingContent, setStreamingContent] = useState("");
  const [streamingTimestamp, setStreamingTimestamp] = useState<Date | null>(null);
  // Track if user has sent a message to hide suggested prompts (M2-3)
  const [hasUserSentMessage, setHasUserSentMessage] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const streamAbortRef = useRef<boolean>(false);
  const lastUserMessageRef = useRef<string>("");

  // Auto-scroll to bottom when content changes
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  }, []);

  // Simulate streaming response chunk by chunk
  const simulateStreamingResponse = useCallback(
    async (userInput: string) => {
      streamAbortRef.current = false;
      setStreamingState("thinking");
      setStreamingContent("");
      setStreamingTimestamp(new Date());
      scrollToBottom();

      // Simulate thinking delay (1-2 seconds)
      const thinkingDelay = 1000 + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, thinkingDelay));

      if (streamAbortRef.current) return;

      // Select a random response
      const responseIndex = Math.floor(Math.random() * mockAIResponses.length);
      const fullResponse = mockAIResponses[responseIndex];

      // Start streaming
      setStreamingState("streaming");
      scrollToBottom();

      // Stream character by character with variable speed
      let currentContent = "";
      const chars = fullResponse.split("");

      for (let i = 0; i < chars.length; i++) {
        if (streamAbortRef.current) return;

        currentContent += chars[i];
        setStreamingContent(currentContent);

        // Variable typing speed: faster for regular chars, slower for punctuation
        const char = chars[i];
        let delay = 15 + Math.random() * 25; // Base typing speed

        if ([".", "!", "?"].includes(char)) {
          delay = 150 + Math.random() * 100; // Pause at sentence ends
        } else if ([",", ":", ";"].includes(char)) {
          delay = 80 + Math.random() * 40; // Shorter pause at commas
        } else if (char === "\n") {
          delay = 100 + Math.random() * 50; // Pause at newlines
        }

        await new Promise((resolve) => setTimeout(resolve, delay));

        // Scroll periodically during streaming (every ~50 characters)
        if (i % 50 === 0) {
          scrollToBottom();
        }
      }

      if (streamAbortRef.current) return;

      // Finalize the message
      const finalMessage: ChatMessage = {
        id: Date.now().toString(),
        content: fullResponse,
        role: "assistant",
        timestamp: new Date(),
        isStreaming: false,
      };

      setMessages((prev) => [...prev, finalMessage]);
      setStreamingState("idle");
      setStreamingContent("");
      setStreamingTimestamp(null);
      scrollToBottom();
    },
    [scrollToBottom]
  );

  // Handle stream error with retry
  const handleStreamError = useCallback(() => {
    setStreamingState("error");
    setStreamingContent("");
    scrollToBottom();
  }, [scrollToBottom]);

  // Retry last failed message
  const handleRetry = useCallback(() => {
    if (lastUserMessageRef.current) {
      simulateStreamingResponse(lastUserMessageRef.current);
    }
  }, [simulateStreamingResponse]);

  const handleSend = useCallback(() => {
    if (!message.trim() || streamingState !== "idle") return;

    const userInput = message.trim();
    lastUserMessageRef.current = userInput;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: userInput,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    // Hide suggested prompts after first user message (M2-3)
    setHasUserSentMessage(true);
    scrollToBottom();

    // Simulate occasional errors (10% chance) for demo purposes
    const shouldError = Math.random() < 0.1;

    if (shouldError) {
      setTimeout(() => {
        setStreamingState("thinking");
        scrollToBottom();
        setTimeout(() => handleStreamError(), 1500);
      }, 100);
    } else {
      // Start streaming response
      setTimeout(() => {
        simulateStreamingResponse(userInput);
      }, 100);
    }
  }, [message, streamingState, scrollToBottom, simulateStreamingResponse, handleStreamError]);

  // Handle selecting a suggested prompt - sends it directly as a message (M2-3)
  const handlePromptSelect = useCallback(
    (prompt: string) => {
      if (streamingState !== "idle") return;

      lastUserMessageRef.current = prompt;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        content: prompt,
        role: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setHasUserSentMessage(true);
      scrollToBottom();

      // Start streaming response
      setTimeout(() => {
        simulateStreamingResponse(prompt);
      }, 100);
    },
    [streamingState, scrollToBottom, simulateStreamingResponse]
  );

  const renderMessage = ({ item, index }: { item: ChatMessage; index: number }) => (
    <MessageBubble isLast={index === messages.length - 1} message={item} />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={styles.emptyIconContainer}>
        <View style={styles.emptyIconOuter}>
          <View style={styles.emptyIconInner}>
            <Sparkles color={colors.forest} size={28} strokeWidth={2} />
          </View>
        </View>
      </View>

      <Text style={styles.emptyTitle}>Welcome to Laurel</Text>
      <Text style={styles.emptySubtitle}>Your AI Habit Coach</Text>
      <Text style={styles.emptyDescription}>
        I&apos;m here to help you build lasting habits using the proven principles from Atomic
        Habits. Ask me anything about habit formation, motivation, or personal growth.
      </Text>

      <View style={styles.promptsContainer}>
        <Text style={styles.promptsLabel}>Try asking about:</Text>
        <View style={styles.promptsGrid}>
          {suggestedPrompts.map((prompt, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              style={styles.promptButton}
              onPress={() => handlePromptSelect(prompt)}
            >
              <Text style={styles.promptText}>{prompt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  const renderHeader = () => (
    <View style={styles.listHeader}>
      {messages.length > 0 && (
        <View style={styles.sessionInfo}>
          <View style={styles.sessionDot} />
          <Text style={styles.sessionText}>Coaching Session Active</Text>
        </View>
      )}
    </View>
  );

  const renderFooter = () => (
    <View style={styles.listFooter}>
      {streamingState === "thinking" && <ThinkingIndicator />}
      {streamingState === "streaming" && streamingTimestamp && (
        <StreamingMessageBubble content={streamingContent} timestamp={streamingTimestamp} />
      )}
      {streamingState === "error" && <StreamErrorMessage onRetry={handleRetry} />}
    </View>
  );

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      {/* Decorative background gradient */}
      <View style={styles.backgroundGradient} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
        style={styles.flex}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.headerAvatar}>
              <Bot color={colors.white} size={22} strokeWidth={2} />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Laurel Coach</Text>
              <View style={styles.headerStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.headerSubtitle}>Online</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          ListEmptyComponent={renderEmptyState}
          ListFooterComponent={renderFooter}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={[
            styles.listContent,
            messages.length === 0 && styles.listContentEmpty,
          ]}
          data={messages}
          keyExtractor={(item) => item.id}
          keyboardShouldPersistTaps="handled"
          renderItem={renderMessage}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Suggested Prompts - M2-3 */}
        <SuggestedPrompts
          visible={!hasUserSentMessage && messages.length === 0}
          onPromptSelect={handlePromptSelect}
        />

        {/* Input Area */}
        <View style={styles.inputArea}>
          <View style={styles.inputWrapper}>
            <View style={styles.inputContainer}>
              <TextInput
                multiline
                maxLength={1000}
                placeholder="Message your coach..."
                placeholderTextColor={colors.gray400}
                returnKeyType="default"
                style={styles.input}
                value={message}
                onChangeText={setMessage}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={!message.trim() || streamingState !== "idle"}
              style={[
                styles.sendButton,
                message.trim() && streamingState === "idle"
                  ? styles.sendButtonActive
                  : styles.sendButtonInactive,
              ]}
              onPress={handleSend}
            >
              <Send
                color={message.trim() && streamingState === "idle" ? colors.white : colors.gray400}
                size={20}
                strokeWidth={2.5}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.inputHint}>Powered by Atomic Habits methodology</Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const { width: screenWidth } = Dimensions.get("window");
const maxBubbleWidth = screenWidth * 0.75;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  backgroundGradient: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 200,
    backgroundColor: colors.sageMuted,
    opacity: 0.5,
  },
  flex: {
    flex: 1,
  },

  // Header styles
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
    paddingHorizontal: 20,
    paddingVertical: 16,
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  headerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.charcoal,
    letterSpacing: -0.3,
  },
  headerStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.sage,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.gray500,
    fontWeight: "500",
  },

  // List styles
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  listHeader: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  listFooter: {
    paddingVertical: 8,
  },
  sessionInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  sessionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.sage,
  },
  sessionText: {
    fontSize: 12,
    color: colors.gray500,
    fontWeight: "500",
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },

  // Message styles
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
    gap: 10,
  },
  messageRowUser: {
    justifyContent: "flex-end",
  },
  messageRowAssistant: {
    justifyContent: "flex-start",
  },
  lastMessage: {
    marginBottom: 0,
  },
  avatarContainer: {
    width: 32,
    height: 32,
  },
  assistantAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 12,
    backgroundColor: colors.amber,
    alignItems: "center",
    justifyContent: "center",
  },
  messageBubble: {
    maxWidth: maxBubbleWidth,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: colors.forest,
    borderBottomRightRadius: 6,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  assistantBubble: {
    backgroundColor: colors.white,
    borderBottomLeftRadius: 6,
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors.gray100,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.1,
  },
  userText: {
    color: colors.white,
  },
  assistantText: {
    color: colors.charcoal,
  },
  timestamp: {
    fontSize: 11,
    marginTop: 6,
    fontWeight: "500",
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "right",
  },
  assistantTimestamp: {
    color: colors.gray400,
  },

  // Thinking indicator
  thinkingBubble: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  thinkingLabel: {
    fontSize: 14,
    color: colors.gray500,
    fontWeight: "500",
    fontStyle: "italic",
  },
  thinkingDots: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
    height: 20,
  },
  thinkingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.sage,
  },

  // Streaming text
  streamingTextContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-end",
  },
  streamingCursor: {
    width: 2,
    height: 18,
    backgroundColor: colors.forest,
    marginLeft: 2,
    borderRadius: 1,
  },

  // Error state
  errorAvatar: {
    backgroundColor: colors.amber,
  },
  errorBubble: {
    borderColor: colors.amberLight,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 14,
    color: colors.gray600,
    lineHeight: 20,
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: colors.forest,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  // Empty state styles
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconOuter: {
    width: 88,
    height: 88,
    borderRadius: 28,
    backgroundColor: colors.sageMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyIconInner: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.charcoal,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.forest,
    marginBottom: 16,
  },
  emptyDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.gray500,
    textAlign: "center",
    marginBottom: 32,
  },
  promptsContainer: {
    width: "100%",
  },
  promptsLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.gray400,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 12,
    textAlign: "center",
  },
  promptsGrid: {
    gap: 10,
  },
  promptButton: {
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: colors.gray100,
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  promptText: {
    fontSize: 14,
    color: colors.gray600,
    fontWeight: "500",
    textAlign: "center",
  },

  // Input area styles
  inputArea: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    shadowColor: colors.charcoal,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    backgroundColor: colors.warmGray,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 12,
    minHeight: 48,
    maxHeight: 120,
  },
  input: {
    fontSize: 16,
    color: colors.charcoal,
    lineHeight: 22,
    paddingVertical: 0,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonActive: {
    backgroundColor: colors.forest,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  sendButtonInactive: {
    backgroundColor: colors.gray100,
  },
  inputHint: {
    fontSize: 11,
    color: colors.gray400,
    textAlign: "center",
    marginTop: 8,
    fontWeight: "500",
    letterSpacing: 0.3,
  },
});
