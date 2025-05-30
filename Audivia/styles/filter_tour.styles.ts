import { COLORS } from "@/constants/theme"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    margin: 10
  },
  notification: {
    marginRight: 10,
    borderRadius: 20,
    backgroundColor: COLORS.blueLight,
    borderColor: COLORS.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 5,
    padding: 5,
    opacity: 0.9
  },
  chat: {
    borderRadius: 20,
    backgroundColor: COLORS.blueLight,
    borderColor: COLORS.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 2,
    elevation: 5,
    padding: 5,
    opacity: 0.9
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.grey,
    marginTop: 4,
  },
  viewModeContainer: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 4,
  },
  viewModeButton: {
    padding: 8,
    borderRadius: 4,
  },
  activeViewMode: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: COLORS.purpleGradient,
    borderWidth: 0.5,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.grey,
  },
  tourList: {
    padding: 16,
    paddingTop: 8,
  },
  tourCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginTop: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'row',
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  tourImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginRight: 10,
    resizeMode: 'cover'
  },
  backIcon:{
    borderRadius: 20,
    padding: 8,
    backgroundColor: "rgba(131, 81, 138, 0.1)",
  },
  favoriteButton: {
    position: "absolute",
    top: 0,
    left: 190,
    backgroundColor: "rgba(131, 81, 138, 0.2)",
    borderRadius: 20,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  priceTag: {
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: 'transparent',
  },
  priceText: {
    fontWeight: "bold",
    color: COLORS.dark,
    fontSize: 18
  },
  tourInfo: {
    flex: 1,
    padding: 5,
  },
  tourName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  tourMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  durationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  durationText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  bookButton: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: "center",
    width: 100,
    marginLeft: 10,
  },
  bookButtonText: {
    color: COLORS.light,
    fontWeight: "bold",
    fontSize: 14,
  },
})
