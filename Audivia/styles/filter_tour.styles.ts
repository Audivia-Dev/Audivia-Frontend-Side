import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
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
    backButton: {
      padding: 4,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#000",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    notificationButton: {
      marginRight: 16,
    },
    profileButton: {},
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
      fontSize: 14,
      color: "#666",
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
      backgroundColor: "#f5f5f5",
      borderRadius: 20,
      marginHorizontal: 16,
      marginVertical: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: "#333",
    },
    tourList: {
      padding: 16,
      paddingTop: 8,
    },
    tourCard: {
      backgroundColor: "#fff",
      borderRadius: 12,
      marginBottom: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    tourImage: {
      width: "100%",
      height: 180,
    },
    favoriteButton: {
      position: "absolute",
      top: 10,
      left: 10,
      backgroundColor: "rgba(0,0,0,0.3)",
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1,
    },
    priceTag: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: "#fff",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    priceText: {
      fontWeight: "bold",
      color: "#000",
    },
    tourInfo: {
      padding: 16,
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
      backgroundColor: "#00BCD4",
      paddingVertical: 10,
      borderRadius: 8,
      alignItems: "center",
    },
    bookButtonText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 14,
    },
    mascotContainer: {
      position: "absolute",
      bottom: 70,
      right: 16,
    },
    mascotImage: {
      width: 50,
      height: 50,
    },
  })
  