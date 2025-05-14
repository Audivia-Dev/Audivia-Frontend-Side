import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/chatbox.styles";

interface ChatInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export const ChatInput = ({ value, onChangeText, onSend }: ChatInputProps) => {
  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={styles.input}
        placeholder="Nhập tin nhắn..."
        value={value}
        onChangeText={onChangeText}
        multiline
      />
      <TouchableOpacity
        style={[styles.sendButton]}
        onPress={onSend}
        disabled={!value.trim()}
      >
        <Ionicons
          name="send"
          size={24}
          color={value.trim() ? "#007AFF" : "#999"}
        />
      </TouchableOpacity>
    </View>
  );
}; 