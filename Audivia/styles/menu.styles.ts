import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native"
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8F9FA",
    },
    header: {
      backgroundColor: COLORS.light,
      paddingHorizontal: 16,
      paddingVertical: 12,
      marginBottom: 8,
    },
    headerContent: {
      flexDirection: "row",
      alignItems: "center",
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 30,
      marginRight: 12,
    },
    headerTextContainer: {
      flex: 1,
    },
    userName: {
      fontSize: 22,
      fontWeight: "bold",
    },
    viewProfile: {
      fontSize: 14,
      color: "#65676B",
      marginTop: 2,
    },
    statsContainer: {
      flexDirection: "row",
      backgroundColor: "#fff",
      paddingVertical: 12,
      marginBottom: 8,
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
      flex: 1,
    },
    statNumber: {
      fontSize: 20,
      fontWeight: "bold",
      color: COLORS.primary,
    },
    statLabel: {
      fontSize: 12,
      color: "#65676B",
      marginTop: 4,
    },
    statDivider: {
      width: 1,
      backgroundColor: "#E4E6EB",
      height: "80%",
      alignSelf: "center",
    },
    section: {
      marginBottom: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      paddingHorizontal: 16,
      paddingVertical: 8,
      color: COLORS.grey,
    },
    menuGroup: {
      backgroundColor: COLORS.light,
      borderRadius: 8,
      marginHorizontal: 8,
      overflow: "hidden",
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#E4E6EB",
    },
    menuIconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: COLORS.blueLight,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    menuText: {
      fontSize: 16,
      flex: 1,
    },
    arrowIcon: {
      marginLeft: 8,
    },
    signOutButton: {
      backgroundColor: COLORS.primary,
      marginHorizontal: 16,
      marginVertical: 16,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: "center",
    },
    signOutText: {
      color: COLORS.light,
      fontSize: 16,
      fontWeight: "bold",
    },
    footer: {
      alignItems: "center",
      marginBottom: 20,
      paddingVertical: 16,
    },
    footerText: {
      fontSize: 12,
      color: COLORS.grey,
      marginVertical: 2,
    },
  })
export default styles;