import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styles from "@/styles/message_inbox";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface CreateGroupModalProps {
  visible: boolean;
  onClose: () => void;
  groupName: string;
  onGroupNameChange: (text: string) => void;
  selectedUsers: User[];
  onUserSelect: (user: User) => void;
  onUserRemove: (user: User) => void;
  activeUsers: User[];
  onCreateGroup: () => void;
}

export const CreateGroupModal = ({
  visible,
  onClose,
  groupName,
  onGroupNameChange,
  selectedUsers,
  onUserSelect,
  onUserRemove,
  activeUsers,
  onCreateGroup,
}: CreateGroupModalProps) => {
  const renderUserSelectionItem = ({ item }: { item: User }) => {
    const isSelected = selectedUsers.some((user) => user.id === item.id);

    return (
      <TouchableOpacity
        style={[
          styles.userSelectionItem,
          isSelected && styles.userSelectionItemSelected,
        ]}
        onPress={() => onUserSelect(item)}
      >
        <Image source={{ uri: item.avatar }} style={styles.userSelectionAvatar} />
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
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Tạo nhóm chat mới</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <View style={styles.groupNameContainer}>
            <Text style={styles.groupNameLabel}>Tên nhóm</Text>
            <TextInput
              style={styles.groupNameInput}
              placeholder="Nhập tên nhóm..."
              value={groupName}
              onChangeText={onGroupNameChange}
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
                    onPress={() => onUserRemove(user)}
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
            data={activeUsers}
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
            onPress={onCreateGroup}
            disabled={!groupName.trim() || selectedUsers.length < 2}
          >
            <Text style={styles.createGroupButtonText}>Tạo nhóm</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}; 