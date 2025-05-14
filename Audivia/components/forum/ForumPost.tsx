import { Image, Text, TouchableOpacity, View, TextInput } from "react-native";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/forum.styles";
import { useUser } from "@/hooks/useUser";
import { router } from "expo-router";

interface ForumPostProps {
  item: {
    id: string;
    user: {
      id: string;
      userName: string;
      avatarUrl?: string;
    };
    location: string;
    images: string[];
    likes: number;
    content: string;
    comments: number;
    time: string;
  };
}

export const ForumPost = ({ item }: ForumPostProps) => {
  const { user } = useUser();

  const navigateToProfile = (userId: string) => {
    router.push({
      pathname: "/profile",
      params: { userId },
    });
  };

  return (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => navigateToProfile(item.user.id)}
        >
          {item.user.avatarUrl ? (
            <Image
              source={{ uri: item.user.avatarUrl }}
              style={styles.avatar}
            />
          ) : (
            <Ionicons
              name="person-circle-outline"
              style={styles.avatar}
              size={44}
              color={COLORS.primary}
            />
          )}
          <View>
            <Text style={styles.userName}>{item.user.userName}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <View style={styles.postImageContainer}>
        <Image
          source={{ uri: item.images[0] }}
          style={styles.postImage}
          resizeMode="cover"
        />
      </View>

      {/* Post Actions */}
      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity style={styles.actionButton}>
            <AntDesign name="heart" size={24} color={COLORS.red} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={22} color={COLORS.dark} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Stats */}
      <View style={styles.postStats}>
        <Text style={styles.likes}>{item.likes} lượt thích</Text>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        <Text style={styles.postText}>{item.content}</Text>
      </View>

      {/* Comments */}
      <TouchableOpacity style={styles.commentsLink}>
        <Text style={styles.commentsText}>
          Xem tất cả {item.comments} bình luận
        </Text>
      </TouchableOpacity>

      {/* Time */}
      <Text style={styles.timeText}>{item.time}</Text>

      {/* Comment Input */}
      <View style={styles.commentInputContainer}>
        <Image source={{ uri: user?.avatarUrl }} style={styles.commentAvatar} />
        <TextInput
          style={styles.commentInput}
          placeholder="Thêm bình luận..."
          placeholderTextColor={COLORS.grey}
        />
        <TouchableOpacity>
          <Text style={styles.postButton}>Đăng</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}; 