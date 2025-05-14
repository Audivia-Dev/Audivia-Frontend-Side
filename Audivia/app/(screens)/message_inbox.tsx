import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  SafeAreaView,
  StatusBar,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import styles from "@/styles/message_inbox";
import { Header } from "@/components/message/Header";
import { Search } from "@/components/message/Search";
import { ConversationItem } from "@/components/message/ConversationItem";
import { CreateGroupModal } from "@/components/message/CreateGroupModal";

// Dữ liệu mẫu cho người dùng đang hoạt động
const ACTIVE_USERS = [
  {
    id: "1",
    name: "Hương",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    isOnline: true,
  },
  {
    id: "2",
    name: "Minh",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    isOnline: true,
  },
  {
    id: "4",
    name: "Lan",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    isOnline: false,
  },
  {
    id: "5",
    name: "Tuấn",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    isOnline: true,
  },
  {
    id: "6",
    name: "Hà",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    isOnline: false,
  },
];

// Dữ liệu mẫu cho các cuộc trò chuyện
const CONVERSATIONS = [
  {
    id: "2",
    name: "Nhóm Tour Huế",
    avatar:
      "https://images.unsplash.com/photo-1558321601-6de0f76ff4b8?q=80&w=1000&auto=format&fit=crop",
    lastMessage:
      "Hương: Mọi người đã sẵn sàng cho chuyến đi vào cuối tuần này chưa?",
    time: "09:45",
    unread: 3,
    isGroup: true,
    members: ["Hương", "Minh", "Lan", "Tuấn", "Hà", "Bình"],
  },
  {
    id: "4",
    name: "Lan",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    lastMessage:
      "Cảm ơn bạn đã chia sẻ thông tin về tour Hội An. Tôi rất thích những bức ảnh bạn đã gửi.",
    time: "Hôm qua",
    unread: 0,
    isOnline: false,
    isGroup: false,
  },
];

export default function MessagingInboxScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [groupName, setGroupName] = useState("");
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const filteredConversations = CONVERSATIONS.filter((conversation) =>
    conversation.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const navigateToChat = (conversationId: string) => {
    console.log("Navigating to chat with ID:", conversationId);
    router.push(`/message_detail?id=${conversationId}`);
  };

  const toggleUserSelection = (user: any) => {
    if (selectedUsers.some((selected) => selected.id === user.id)) {
      setSelectedUsers(
        selectedUsers.filter((selected) => selected.id !== user.id)
      );
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const createGroup = () => {
    if (groupName.trim() && selectedUsers.length >= 2) {
      console.log("Tạo nhóm:", {
        name: groupName,
        members: selectedUsers,
      });

      setShowCreateGroup(false);
      setSelectedUsers([]);
      setGroupName("");

      setTimeout(() => {
        alert("Đã tạo nhóm thành công!");
      }, 500);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {!showSearch ? (
        <Header onBack={goBack} onSearch={() => setShowSearch(true)} />
      ) : (
        <Search
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onBack={() => setShowSearch(false)}
        />
      )}

      <FlatList
        data={filteredConversations}
        renderItem={({ item }) => (
          <ConversationItem item={item} onPress={navigateToChat} />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.conversationsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={60}
              color="#ccc"
            />
            <Text style={styles.emptyText}>Không tìm thấy cuộc trò chuyện</Text>
          </View>
        }
      />

      <View style={styles.floatingButtonsContainer}>
        <TouchableOpacity
          style={styles.createGroupButton}
          onPress={() => setShowCreateGroup(true)}
        >
          <Ionicons name="people" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <CreateGroupModal
        visible={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        groupName={groupName}
        onGroupNameChange={setGroupName}
        selectedUsers={selectedUsers}
        onUserSelect={toggleUserSelection}
        onUserRemove={toggleUserSelection}
        activeUsers={ACTIVE_USERS}
        onCreateGroup={createGroup}
      />
    </SafeAreaView>
  );
}
