import React, { useState, useRef, useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Animated,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styles } from "@/styles/chatbox.styles";
import { ChatHeader } from "@/components/message/ChatHeader";
import { MessageBubble } from "@/components/message/MessageBubble";
import { TypingIndicator } from "@/components/message/TypingIndicator";
import { ChatInput } from "@/components/message/ChatInput";
import { getChatRoomById, getMessagesByChatRoom } from "@/services/chat"; // <-- Import API
//import { getChatRoomById } from "@/services/chat"; // <-- Nếu muốn lấy thêm info phòng chat
import { useUser } from "@/hooks/useUser";
import { signalRService } from "@/services/signalR";
import { Message } from "@/models";

export default function MessageDetailScreen() {
  const { id: chatRoomId } = useLocalSearchParams(); // <-- Lấy id từ route
  const router = useRouter();
  const { user } = useUser();
  const currentUserId = user?.id;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const [chatRoom, setChatRoom] = useState<any>(null); // Optional: để lấy tên, avatar

  const flatListRef = useRef<FlatList<any>>(null);
  const typingAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!chatRoomId || typeof chatRoomId !== "string") return;

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const [msgs, room] = await Promise.all([
          getMessagesByChatRoom(chatRoomId),
          getChatRoomById(chatRoomId), // <-- Nếu muốn lấy avatar, tên nhóm
        ]);

        setMessages(msgs);
        setChatRoom(room);
      } catch (error) {
        console.error("Lỗi khi tải tin nhắn:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatRoomId]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    if (!chatRoomId) return;

    // Tham gia vào phòng chat khi component mount
    signalRService.joinRoom(chatRoomId as string);

    const handleReceiveMessage = (message: Message) => {
      // Chỉ xử lý tin nhắn của phòng chat hiện tại
      if (message.chatRoomId === chatRoomId) {
        setMessages(prev => {
          const messageExists = prev.some(msg => msg.id === message.id);
          if (messageExists) return prev;
          return [...prev, message];
        });
      }
    };

    const handleUpdateMessage = (message: Message) => {
      if (message.chatRoomId === chatRoomId) {
        setMessages(prev => prev.map(msg => 
          msg.id === message.id ? message : msg
        ));
      }
    };

    const handleDeleteMessage = (message: Message) => {
      if (message.chatRoomId === chatRoomId) {
        setMessages(prev => prev.filter(msg => msg.id !== message.id));
      }
    };

    // Đăng ký các event handlers
    signalRService.onReceiveMessage(handleReceiveMessage);
    signalRService.onMessageUpdated(handleUpdateMessage);
    signalRService.onMessageDeleted(handleDeleteMessage);

    // Cleanup khi unmount
    return () => {
      signalRService.leaveRoom(chatRoomId as string);
      signalRService.removeMessageCallback(handleReceiveMessage);
      signalRService.removeMessageUpdatedCallback(handleUpdateMessage);
      signalRService.removeMessageDeletedCallback(handleDeleteMessage);
    };
  }, [chatRoomId]);

  const goBack = () => {
    router.back();
  };

  const sendMessage = (newMsg: Message) => {
    if (!chatRoomId) return;
    
    // Thêm tin nhắn vào state ngay lập tức
    setMessages(prev => [...prev, newMsg]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ChatHeader
        type={chatRoom?.type}
        avatar={
          chatRoom?.type === "private"
            ? chatRoom?.members?.find((m: any) => m.userId !== currentUserId)?.user?.avatarUrl
            : undefined
        }
        title={
          chatRoom?.type === "private"
            ? chatRoom?.members?.find((m: any) => m.userId !== currentUserId)?.user?.fullName
            : chatRoom?.name
        }
        isOnline={true}
        onBack={goBack}
        members={chatRoom?.type === "group" ? chatRoom?.members : undefined}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => {
          const isOwnMessage = String(item.senderId) === String(currentUserId);
          const senderMember = chatRoom?.members?.find((m: any) => String(m.userId) === String(item.senderId));
          const avatar = senderMember?.user?.avatarUrl || null;
          const senderName = senderMember?.user?.fullName || item.senderName;
          
          return (
            <MessageBubble
              message={{
                ...item,
                senderName: chatRoom?.type === "group" ? senderName : item.senderName
              }}
              isOwnMessage={isOwnMessage}
              avatar={!isOwnMessage ? avatar : null}
            />
          )
        }}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />

      {isTyping && messages.length > 0 && String(messages[messages.length - 1].senderId) === String(currentUserId) && (
        <TypingIndicator
          avatar={chatRoom?.members?.find((m: any) => m.userId !== currentUserId)?.user?.avatarUrl}
          animation={typingAnimation}
        />
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ChatInput
          onSend={sendMessage}
          onTyping={setIsTyping}
          chatRoomId={chatRoomId as string}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
