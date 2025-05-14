import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/styles/message_inbox";

interface SearchProps {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onBack: () => void;
}

export const Search = ({ searchQuery, onSearchChange, onBack }: SearchProps) => {
  return (
    <View style={styles.searchHeader}>
      <TouchableOpacity style={styles.searchBackButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm tin nhắn..."
          value={searchQuery}
          onChangeText={onSearchChange}
          autoFocus
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange("")}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}; 