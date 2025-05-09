import { useEffect, useState } from "react"
import { Image, Text, TouchableOpacity, View, FlatList, TextInput } from "react-native"
import { Ionicons, AntDesign } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { styles } from "@/styles/forum.styles"
import { useUser } from "@/hooks/useUser"
import { getAllPosts } from "@/services/post"

export default function ForumScreen() {
  const [activeTab, setActiveTab] = useState("Popular")
  const [posts, setPosts] = useState([])
  const {user} = useUser()

  useEffect(() => {
    getAllPosts().then((res) => {
      setPosts(res.response)
    })
  },[])

  const renderPost = ({ item }: { item: any }) => (
    <View style={styles.postContainer}>
      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
        {item.user.avatarUrl ? (
      <Image source={{uri: item.user.avatarUrl}} style={styles.avatar}  />
    ) : (
      <Ionicons name="person-circle-outline" style={styles.avatar} size={44}  color={COLORS.primary} />
    )}
          <View>
            <Text style={styles.userName}>{item.user.userName}</Text>
            <Text style={styles.location}>{item.location}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      {/* Post Image */}
      <View style={styles.postImageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.postImage} resizeMode="cover" />
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
        <Text style={styles.postText}>
          {item.content}
        </Text>
      </View>

      {/* Comments */}
      <TouchableOpacity style={styles.commentsLink}>
        <Text style={styles.commentsText}>Xem tất cả {item.comments} bình luận</Text>
      </TouchableOpacity>

      {/* Time */}
      <Text style={styles.timeText}>{item.time}</Text>

      {/* Comment Input */}
      <View style={styles.commentInputContainer}>
        <Image
          source={{uri: user?.avatarUrl}}
          style={styles.commentAvatar}
        />
        <TextInput style={styles.commentInput} placeholder="Thêm bình luận..." placeholderTextColor={COLORS.grey} />
        <TouchableOpacity>
          <Text style={styles.postButton}>Đăng</Text>
        </TouchableOpacity>
      </View>
    </View>
  )

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Diễn đàn</Text>
        <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.dark} style={styles.icon} />
            <View style={styles.avatarWrapper}>
  {user?.avatarUrl ? (
    <Image
      source={{ uri: user.avatarUrl }}
      style={styles.avatarImage}
      resizeMode="cover"
    />
  ) : (
    <Ionicons name="person-circle-outline" size={22} color={COLORS.primary} />
  )}
            </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Following" && styles.activeTab]}
          onPress={() => setActiveTab("Following")}
        >
          <Text style={[styles.tabText, activeTab === "Following" && styles.activeTabText]}>Theo dõi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "Popular" && styles.activeTab]}
          onPress={() => setActiveTab("Popular")}
        >
          <Text style={[styles.tabText, activeTab === "Popular" && styles.activeTabText]}>Đề xuất</Text>
        </TouchableOpacity>
      </View>

      {/* Posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </View>
  )
}
