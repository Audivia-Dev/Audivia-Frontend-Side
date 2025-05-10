import { useEffect, useState } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Modal,
  Alert,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/theme"
import { useRouter, useLocalSearchParams } from "expo-router"
import styles from "@/styles/profile.styles"
import { useUser } from "@/hooks/useUser"
import * as ImagePicker from 'expo-image-picker'
import { updateUserInfo } from "@/services/user"
import { createPost, getPostByUserId, updatePost, deletePost } from "@/services/post"
import { Post } from "@/models"
import { PostModal } from "@/components/PostModal"

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("posts")
  const [showAvatarModal, setShowAvatarModal] = useState(false)
  const [showPostModal, setShowPostModal] = useState(false)
  const [showPostOptions, setShowPostOptions] = useState<string | null>(null)
  const [postContent, setPostContent] = useState("")
  const [postLocation, setPostLocation] = useState("")
  const [postImages, setPostImages] = useState<string[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const DEFAULT_AVATAR = "https://res.cloudinary.com/dgzn2ix8w/image/upload/v1745396073/Audivia/ddizjlgkux0eoifrsoco.avif"
  const { user } = useUser()
  const router = useRouter()
  const params = useLocalSearchParams()
  const [profileUser, setProfileUser] = useState(user)
  const [posts, setPosts] = useState<Post[]>([])
  const isOwnProfile = !params.userId || params.userId === user?.id

  useEffect(() => {
    if (params.userId) {
      // TODO: Fetch other user's profile data
      // For now, we'll just use the current user's data
      setProfileUser(user)
    } else {
      setProfileUser(user)
    }
  }, [params.userId, user])

  useEffect(() => {
    if (profileUser?.id) {
      getPostByUserId(profileUser.id).then((res) => {
        setPosts(res.response)
      })
    }
  }, [profileUser?.id])

  const handleCreatePost = () => {
    setEditingPost(null)
    setPostContent("")
    setPostLocation("")
    setPostImages([])
    setShowPostModal(true)
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setPostContent(post.content)
    setPostLocation(post.location)
    setPostImages(post.images || [])
    setShowPostModal(true)
  }

  const handleDeletePost = async (postId: string) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa bài viết này?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePost(postId)
              setPosts(posts.filter((post: Post) => post.id !== postId))
              setShowPostOptions(null)
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa bài viết. Vui lòng thử lại.')
            }
          }
        }
      ]
    )
  }

  const handleSavePost = async (postData: { content: string; location: string; images: string[] }) => {
    if (!profileUser?.id) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng');
      return;
    }

    try {
      if (editingPost) {
        await updatePost(editingPost.id, postData);
        setPosts(posts.map((post) => 
          post.id === editingPost.id 
            ? { ...post, ...postData }
            : post
        ));
        setShowPostModal(false);
      } else {
        const response = await createPost(
          postData.images,
          postData.location,
          postData.content,
          profileUser.id
        );
        if (response.success) {
          setPosts([response.response, ...posts]);
          setShowPostModal(false);
        } else {
          throw new Error(response.message || 'Không thể tạo bài viết');
        }
      }
    } catch (error: any) {
      Alert.alert(
        'Lỗi', 
        error.response?.data?.message || error.message || 'Không thể lưu bài viết. Vui lòng thử lại.'
      );
    }
  };

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      })

      if (!result.canceled) {
        setPostImages([...postImages, result.assets[0].uri])
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.')
    }
  }

  const handleAvatarPress = () => {
    if (isOwnProfile) {
      setShowAvatarModal(true)
    }
  }

  const handleCameraAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
      if (!permissionResult.granted) {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cho phép ứng dụng truy cập camera')
        return
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })
      if (!result.canceled) {
        console.log('Camera image:', result.assets[0].uri)
        await updateUserInfo(profileUser?.id as string, {avatarUrl: result.assets[0].uri})
        setShowAvatarModal(false)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Lỗi', 'Không thể chụp ảnh. Vui lòng thử lại.')
    }
  }
  const handleChangeAvatar = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
      
      if (!permissionResult.granted) {
        Alert.alert('Cần quyền truy cập', 'Vui lòng cho phép ứng dụng truy cập thư viện ảnh')
        return
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled) {
        await updateUserInfo(profileUser?.id as string, {avatarUrl: result.assets[0].uri})
        console.log('Selected image:', result.assets[0].uri)
      }
    } catch (error) {
      console.error('Error picking image:', error)
      Alert.alert('Lỗi', 'Không thể chọn ảnh. Vui lòng thử lại.')
    }
  }


  const handleDeleteAvatar = async () => {
    Alert.alert(
      'Xác nhận',
      'Bạn có chắc chắn muốn xóa ảnh đại diện?',
      [
        {
          text: 'Hủy',
          style: 'cancel'
        },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            await updateUserInfo(profileUser?.id as string, {avatarUrl: DEFAULT_AVATAR})
            setShowAvatarModal(false)
            console.log('Delete avatar')
          }
        }
      ]
    )
  }

  const goBack = () => {
    router.back()
  }

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postCard}>
      <View style={styles.postHeader}>
        <View style={styles.postUser}>
          <Image source={{ uri: profileUser?.avatarUrl || DEFAULT_AVATAR }} style={styles.postAvatar} />
          <View>
            <Text style={styles.postUserName}>{profileUser?.userName}</Text>
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
              handleEditPost(item)
              setShowPostOptions(null)
            }}
          >
            <Ionicons name="pencil-outline" size={20} color={COLORS.primary} />
            <Text style={styles.postOptionText}>Chỉnh sửa</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.postOption} 
            onPress={() => handleDeletePost(item.id)}
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
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trang cá nhân</Text>
       
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cover Photo */}
        <View style={styles.coverPhotoContainer}>
            <Image source={{ uri: user?.coverPhoto }} style={styles.coverPhoto} />
          <TouchableOpacity 
            style={styles.profileAvatarContainer} 
            onPress={handleAvatarPress}
            disabled={!isOwnProfile}
          >
            <Image source={{ uri: profileUser?.avatarUrl || DEFAULT_AVATAR }} style={styles.profileAvatar} />
          </TouchableOpacity>
        </View>

        {/* Avatar Modal */}
        <Modal
          visible={showAvatarModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAvatarModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setShowAvatarModal(false)}>
                  <Ionicons name="close" size={24} color={COLORS.dark} />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleDeleteAvatar}>
                  <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.dark} />
                </TouchableOpacity>
              </View>
              
              <Image source={{ uri: profileUser?.avatarUrl || DEFAULT_AVATAR }} style={styles.modalAvatar} />
              
              <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalAction} onPress={handleCameraAvatar}>
                  <Ionicons name="camera-outline" size={24} color={COLORS.dark} />
                  <Text style={styles.modalActionText}>Chụp ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.modalAction} onPress={handleChangeAvatar}>
                  <Ionicons name="image-outline" size={24} color={COLORS.dark} />
                  <Text style={styles.modalActionText}>Chọn ảnh</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{profileUser?.userName}</Text>
          <Text style={styles.profileBio}>{profileUser?.bio}</Text>

          {isOwnProfile ? (
            <View style={styles.socialStats}>
              <View style={styles.socialStat}>
                <Text style={styles.socialStatNumber}>{profileUser?.followers}</Text>
                <Text style={styles.socialStatLabel}>Bạn bè</Text>
              </View>
              <View style={styles.socialStatDivider} />
              <View style={styles.socialStat}>
                <Text style={styles.socialStatNumber}>{profileUser?.following}</Text>
                <Text style={styles.socialStatLabel}>Người theo dõi</Text>
              </View>
            </View>
          ) : (
            <View style={styles.profileActions}>
              <TouchableOpacity style={[styles.profileActionButton, styles.primaryActionButton]}>
                <Ionicons name="person-add-outline" size={20} color="#fff" />
                <Text style={styles.primaryActionText}>Theo dõi</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.profileActionButton, styles.secondaryActionButton]}>
                <Ionicons name="chatbubble-outline" size={20} color={COLORS.primary} />
                <Text style={[styles.secondaryActionText, { color: COLORS.primary }]}>Nhắn tin</Text>
              </TouchableOpacity>
            </View>
          )}
         
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "posts" && styles.activeTab]}
            onPress={() => setActiveTab("posts")}
          >
            <Text style={[styles.tabText, activeTab === "posts" && styles.activeTabText]}>Bài viết</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "about" && styles.activeTab]}
            onPress={() => setActiveTab("about")}
          >
            <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>Giới thiệu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "friends" && styles.activeTab]}
            onPress={() => setActiveTab("friends")}
          >
            <Text style={[styles.tabText, activeTab === "friends" && styles.activeTabText]}>Bạn bè</Text>
          </TouchableOpacity>
        </View>

        {/* Content based on active tab */}
        {activeTab === "posts" && (
          <View style={styles.postsContainer}>
            {/* Create Post */}
            <View style={styles.createPostCard}>
              <View style={styles.createPostHeader}>
                <Image source={{ uri: profileUser?.avatarUrl || DEFAULT_AVATAR }} style={styles.createPostAvatar} />
                <TouchableOpacity style={styles.createPostInput} onPress={handleCreatePost}>
                  <Text style={styles.createPostPlaceholder}>Bạn đang nghĩ gì?</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.createPostActions}>
                <TouchableOpacity style={styles.createPostAction} onPress={handleCreatePost}>
                  <Ionicons name="image-outline" size={20} color={COLORS.green} />
                  <Text style={styles.createPostActionText}>Ảnh</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.createPostAction} onPress={handleCreatePost}>
                  <Ionicons name="location-outline" size={20} color={COLORS.blue} />
                  <Text style={styles.createPostActionText}>Check in</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Posts */}
            <FlatList
              data={posts}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </View>
        )}

        {activeTab === "about" && (
          <View style={styles.aboutContainer}>
            <View style={styles.aboutCard}>
              <Text style={styles.aboutTitle}>Thông tin cá nhân</Text>

              <View style={styles.aboutItem}>
                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
                <View>
                  <Text style={styles.aboutLabel}>Username</Text>
                  <Text style={styles.aboutText}>{profileUser?.userName}</Text>
                </View>
              </View>
              <View style={styles.aboutItem}>
                <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
                <View>
                  <Text style={styles.aboutLabel}>Email</Text>
                  <Text style={styles.aboutText}>{profileUser?.email}</Text>
                </View>
              </View>
              <View style={styles.aboutItem}>
                <Ionicons name="person-circle-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
                <View>
                  <Text style={styles.aboutLabel}>Full Name</Text>
                  <Text style={styles.aboutText}>{profileUser?.fullName}</Text>
                </View>
                <TouchableOpacity style={styles.aboutEditButton}>
                  <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.aboutItem}>
                <Ionicons name="call-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
                <View>
                  <Text style={styles.aboutLabel}>Số điện thoại</Text>
                  <Text style={styles.aboutText}>{profileUser?.phone}</Text>
                </View>
                <TouchableOpacity style={styles.aboutEditButton}>
                  <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

              <View style={styles.aboutItem}>
                <Ionicons name="bonfire-outline" size={20} color={COLORS.primary} style={styles.aboutIcon} />
                <View>
                  <Text style={styles.aboutLabel}>Bio</Text>
                  <Text style={styles.aboutText}>{profileUser?.bio}</Text>
                </View>
                <TouchableOpacity style={styles.aboutEditButton}>
                  <Ionicons name="pencil-outline" size={18} color={COLORS.primary} />
                </TouchableOpacity>
              </View>

            </View>

          </View>
        )}
      </ScrollView>

      <PostModal
        visible={showPostModal}
        onClose={() => setShowPostModal(false)}
        onSave={handleSavePost}
        editingPost={editingPost}
      />
    </SafeAreaView>
  )
}

