import { useState } from "react";
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
  const [selectedUsers, setSelectedUsers] = useState([]);
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

  const renderConversation = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() => navigateToChat(item.id)}
    >
      <View style={styles.conversationAvatarContainer}>
        {item.isGroup ? (
          <View style={styles.groupAvatarContainer}>
            <Image
              source={{ uri: item.avatar }}
              style={styles.conversationAvatar}
            />
            <View style={styles.groupIconBadge}>
              <Ionicons name="people" size={12} color="#fff" />
            </View>
          </View>
        ) : (
          <>
            <Image
              source={{ uri: item.avatar }}
              style={styles.conversationAvatar}
            />
            {item.isOnline && (
              <View style={styles.conversationOnlineIndicator} />
            )}
          </>
        )}
      </View>

      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text
            style={[
              styles.conversationName,
              item.unread > 0 && styles.unreadName,
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <Text
            style={[
              styles.conversationTime,
              item.unread > 0 && styles.unreadTime,
            ]}
          >
            {item.time}
          </Text>
        </View>

        <View style={styles.conversationFooter}>
          <Text
            style={[
              styles.conversationLastMessage,
              item.unread > 0 && styles.unreadMessage,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{item.unread}</Text>
            </View>
          )}
        </View>

        {item.isGroup && (
          <View style={styles.groupMembersContainer}>
            {item.members.slice(0, 3).map((member: any, index: number) => (
              <View
                key={index}
                style={[styles.groupMemberBadge, { marginLeft: index * -8 }]}
              >
                <Text style={styles.groupMemberText}>{member.charAt(0)}</Text>
              </View>
            ))}
            {item.members.length > 3 && (
              <Text style={styles.groupMembersMore}>
                +{item.members.length - 3}
              </Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderUserSelectionItem = ({ item }: { item: any }) => {
    const isSelected = selectedUsers.some((user) => user.id === item.id);

    return (
      <TouchableOpacity
        style={[
          styles.userSelectionItem,
          isSelected && styles.userSelectionItemSelected,
        ]}
        onPress={() => toggleUserSelection(item)}
      >
        <Image
          source={{ uri: item.avatar }}
          style={styles.userSelectionAvatar}
        />
        <Text style={styles.userSelectionName}>{item.name}</Text>
        <View
          style={[
            styles.checkboxContainer,
            isSelected && styles.checkboxSelected,
          ]}
        >
          {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      {!showSearch ? (
        <View style={styles.header}>
          <View style={styles.headerInfo}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Tin nhắn</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => setShowSearch(true)}
            >
              <Ionicons name="search" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.searchHeader}>
          <TouchableOpacity
            style={styles.searchBackButton}
            onPress={() => setShowSearch(false)}
          >
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm tin nhắn..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {/* Conversations */}
      <FlatList
        data={filteredConversations}
        renderItem={renderConversation}
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

      {/*Create Group Buttons */}
      <View style={styles.floatingButtonsContainer}>
        <TouchableOpacity
          style={styles.createGroupButton}
          onPress={() => setShowCreateGroup(true)}
        >
          <Ionicons name="people" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Create Group Modal */}
      <Modal
        visible={showCreateGroup}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreateGroup(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Tạo nhóm chat mới</Text>
              <TouchableOpacity onPress={() => setShowCreateGroup(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.groupNameContainer}>
              <Text style={styles.groupNameLabel}>Tên nhóm</Text>
              <TextInput
                style={styles.groupNameInput}
                placeholder="Nhập tên nhóm..."
                value={groupName}
                onChangeText={setGroupName}
              />
            </View>

            <View style={styles.selectedUsersContainer}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {selectedUsers.map((user) => (
                  <View key={user.id} style={styles.selectedUserItem}>
                    <Image
                      source={{ uri: user.avatar }}
                      style={styles.selectedUserAvatar}
                    />
                    <Text style={styles.selectedUserName} numberOfLines={1}>
                      {user.name}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeUserButton}
                      onPress={() => toggleUserSelection(user)}
                    >
                      <Ionicons name="close-circle" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </View>

            <Text style={styles.selectMembersTitle}>
              Chọn thành viên ({selectedUsers.length})
            </Text>

            <FlatList
              data={ACTIVE_USERS}
              renderItem={renderUserSelectionItem}
              keyExtractor={(item) => item.id}
              style={styles.userSelectionList}
            />

            <TouchableOpacity
              style={[
                styles.createGroupConfirmButton,
                (!groupName.trim() || selectedUsers.length < 2) &&
                  styles.createGroupButtonDisabled,
              ]}
              onPress={createGroup}
              disabled={!groupName.trim() || selectedUsers.length < 2}
            >
              <Text style={styles.createGroupButtonText}>Tạo nhóm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
