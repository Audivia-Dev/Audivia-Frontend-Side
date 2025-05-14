import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/chatbox.styles";

interface ChatHeaderProps {
  avatar: any;
  name: string;
  isOnline?: boolean;
  lastSeen?: string;
  onBack: () => void;
}

export const ChatHeader = ({
  avatar,
  name,
  isOnline,
  lastSeen,
  onBack,
}: ChatHeaderProps) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.headerInfo}>
        <Image source={avatar} style={styles.headerAvatar} />
        <View>
          <Text style={styles.headerName}>{name}</Text>
          {lastSeen && <Text style={styles.headerStatus}>{lastSeen}</Text>}
        </View>
      </View>
    </View>
  );
}; 