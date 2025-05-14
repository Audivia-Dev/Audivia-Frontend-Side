import React from "react";
import { View, Text, Image, Animated } from "react-native";
import { styles } from "@/styles/chatbox.styles";

interface MessageBubbleProps {
  message: {
    id: string;
    text: string;
    time: string;
    senderId: string;
    senderName: string;
    senderAvatar: any;
    isNew: boolean;
  };
  isCurrentUser: boolean;
  isGroupChat: boolean;
}

export const MessageBubble = ({
  message,
  isCurrentUser,
  isGroupChat,
}: MessageBubbleProps) => {
  return (
    <Animated.View
      style={[
        styles.messageContainer,
        isCurrentUser ? styles.userMessageContainer : styles.friendMessageContainer,
        message.isNew && { opacity: 1, transform: [{ translateY: 0 }] },
      ]}
    >
      {!isCurrentUser && (
        <Image
          source={message.senderAvatar || require("@/assets/images/avatar.jpg")}
          style={styles.friendAvatar}
        />
      )}
      <View
        style={[
          styles.messageBubble,
          isCurrentUser ? styles.userMessageBubble : styles.friendMessageBubble,
        ]}
      >
        {isGroupChat && !isCurrentUser && (
          <Text style={styles.messageSender}>{message.senderName}</Text>
        )}
        <Text style={styles.messageText}>{message.text}</Text>
        <Text style={styles.messageTime}>{message.time}</Text>
      </View>
    </Animated.View>
  );
}; 