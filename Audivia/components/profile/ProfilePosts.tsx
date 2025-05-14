import { View, Text, Image, TouchableOpacity, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import styles from "@/styles/profile.styles"
import { Post, User } from "@/models"
import { useState } from "react"

interface ProfilePostsProps {
  posts: Post[]
  user: User
  defaultAvatar: string
  isOwnProfile: boolean
  onEditPost: (post: Post) => void
  onDeletePost: (postId: string) => void
  onCreatePost: () => void
}

export const ProfilePosts = ({
  posts,
  user,
  defaultAvatar,
  isOwnProfile,
  onEditPost,
  onDeletePost,
  onCreatePost
}: ProfilePostsProps) => {
  const [showPostOptions, setShowPostOptions] = useState<string | null>(null)

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postUser}>
          <Image source={{ uri: user?.avatarUrl || defaultAvatar }} style={styles.postAvatar} />
          <View>
            <Text style={styles.postUserName}>{user?.userName}</Text>
            <Text style={styles.postTime}>{item.location}</Text>
            <Text style={styles.postTime}>{item.time}</Text>
          </View>
        </View>
        <TouchableOpacity onPress={() => setShowPostOptions(showPostOptions === item.id ? null : item.id)}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {showPostOptions === item.id && (
        <View style={styles.postOptions}>
          <TouchableOpacity 
            style={styles.postOption} 
            onPress={() => {
              onEditPost(item)
              setShowPostOptions(null)
            }}
          >
            <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
            <Text style={styles.postOptionText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.postOption} 
            onPress={() => onDeletePost(item.id)}
          >
            <Ionicons name="trash-outline" size={20} color={COLORS.red} />
            <Text style={[styles.postOptionText, { color: COLORS.red }]}>Xóa</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.postContent}>{item.content}</Text>

      {item.images && item.images[0] && (
        <Image source={{ uri: item.images[0] }} style={styles.postImage} />
      )}

      <View style={styles.postStats}>
        <View style={styles.postLikes}>
          <View style={styles.likeIconContainer}>
            <Ionicons name="heart" size={12} color="#fff" />
          </View>
          <Text style={styles.statsText}>{item.likes}</Text>
        </View>
        <Text style={styles.statsText}>{item.comments} bình luận</Text>
      </View>

      <View style={styles.postActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={22} color="#666" />
          <Text style={styles.actionText}>Thích</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={22} color="#666" />
          <Text style={styles.actionText}>Bình luận</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.postsContainer}>
      {isOwnProfile && (
        <View style={styles.createPostCard}>
          <View style={styles.createPostHeader}>
            <Image source={{ uri: user?.avatarUrl || defaultAvatar }} style={styles.createPostAvatar} />
            <TouchableOpacity style={styles.createPostInput} onPress={onCreatePost}>
              <Text style={styles.createPostPlaceholder}>Bạn đang nghĩ gì?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.createPostActions}>
            <TouchableOpacity style={styles.createPostAction} onPress={onCreatePost}>
              <Ionicons name="image-outline" size={20} color={COLORS.green} />
              <Text style={styles.createPostActionText}>Ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.createPostAction} onPress={onCreatePost}>
              <Ionicons name="location-outline" size={20} color={COLORS.blue} />
              <Text style={styles.createPostActionText}>Check in</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </View>
  )
} 