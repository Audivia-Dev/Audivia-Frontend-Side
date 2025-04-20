import { COLORS } from "@/constants/theme"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 20,
  },
  
  tabsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  tab: {
    paddingVertical: 12,
    marginRight: 24,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#000",
  },
  tabText: {
    fontSize: 16,
    color: "#999",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "600",
  },
  whatsOnYourMindContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  whatsOnYourMindContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  whatsOnYourMindAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  whatsOnYourMindInput: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  whatsOnYourMindText: {
    color: "#666",
  },
  postContainer: {
    marginTop: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 16,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontWeight: "600",
    fontSize: 14,
  },
  location: {
    fontSize: 12,
    color: "#666",
  },
  postImageContainer: {
    width: "100%",
    height: 400,
  },
  postImage: {
    width: "100%",
    height: "100%",
  },
  postActions: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: "row",
  },
  actionButton: {
    marginRight: 16,
  },
  postStats: {
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  likes: {
    fontWeight: "600",
    fontSize: 14,
  },
  postContent: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  postText: {
    fontSize: 14,
    lineHeight: 20,
  },
  commentsLink: {
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  commentsText: {
    color: "#999",
    fontSize: 14,
  },
  timeText: {
    paddingHorizontal: 16,
    color: "#999",
    fontSize: 12,
    marginBottom: 8,
  },
  commentInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  commentAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentInput: {
    flex: 1,
    fontSize: 14,
  },
  postButton: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  icon: {
    marginRight: 16,
  },
  avatarWrapper: {
    width: 32,
    height: 32,
    borderRadius: 21,
    overflow: "hidden",
    backgroundColor: COLORS.grey,
    alignItems: "center",
    justifyContent: "center",
  },
  
  avatarImage: {
    width: "100%",
    height: "100%",
  },
})
