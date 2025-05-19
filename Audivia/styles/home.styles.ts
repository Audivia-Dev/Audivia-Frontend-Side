import { COLORS } from "@/constants/theme";
import { Dimensions, StyleSheet } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F8F9FA",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 10,
      paddingBottom: 10,
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
    },
    locationContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginHorizontal: 16,
      marginBottom: 10,
      marginTop: 10,
    },
    locationText: {
      fontSize: 16,
      fontWeight: "600",
      marginLeft: 4,
    },
    headerIcons: {
      flexDirection: "row",
      alignItems: "center",
    },
    icon: {
      marginRight: 16,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginHorizontal: 16,
      marginBottom: 16,
    },
    searchInput: {
      flex: 1,
      marginLeft: 8,
      fontSize: 15,
    },
    mainImageContainer: {
      marginHorizontal: 16,
      borderRadius: 12,
      overflow: "hidden",
      height: 180,
    },
    mainImage: {
      width: "100%",
      height: "100%",
    },
    categoriesSection: {
      marginTop: 20,
      paddingHorizontal: 16,
    },
    scrollContent: {
      paddingHorizontal: 16,
      
    },
    categoryItem: {
      alignItems: 'center',
      width: Dimensions.get('window').width / 4 - 20,
      marginRight: 16,
      
    },
    categoryIcon: {
      marginBottom: 4,
      borderWidth: 1,
      borderColor: COLORS.primary,
      borderRadius: 20,
      padding: 20,
    },
    categoryName: {
      fontSize: 12,
      textAlign: 'center',
      color: COLORS.dark,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "700",
    },
    seeAllText: {
      fontSize: 14,
      color: COLORS.primary,
    },
    categoriesContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    categoryText: {
      fontSize: 12,
    },
    mapContainer: {
      marginHorizontal: 16,
      height: 180,
      borderRadius: 12,
      overflow: "hidden",
      marginTop: 20,
      marginBottom: 30,
    },
    mapImage: {
      width: "100%",
      height: "100%",
    },
    toursSection: {
      paddingHorizontal: 16,
      marginBottom: 10,
    },
    tourSubtitle: {
      fontSize: 12,
      color: "#757575",
      marginBottom: 12,
    },
    tourCard: {
      borderRadius: 12,
      backgroundColor: COLORS.light,
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      marginVertical: 4,
    },
    tourImage: {
      width: "100%",
      height: 150,
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
    },
    favoriteButton: {
      position: "absolute",
      top: 10,
      right: 10,
      backgroundColor: "rgba(0,0,0,0.3)",
      borderRadius: 20,
      width: 36,
      height: 36,
      justifyContent: "center",
      alignItems: "center",
    },
    tourDetails: {
      padding: 12,
    },
    tourName: {
      fontSize: 16,
      fontWeight: "700",
    },
    tourLocation: {
      fontSize: 14,
      color: "#757575",
      marginTop: 4,
    },
    tourRating: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    ratingText: {
      fontSize: 14,
      marginLeft: 4,
    },
    tourFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginTop: 12,
    },
    freeTag: {
      backgroundColor: "#E3F2FD",
      color: "#2196F3",
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      fontSize: 12,
    },
    bookButton: {
      backgroundColor: COLORS.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 6,
    },
    bookButtonText: {
      color: COLORS.light,
      fontWeight: "600",
      fontSize: 14,
    },
    priceText: {
      fontSize: 14,
      fontWeight: "700",
    },
    topPlacesSection: {
      paddingHorizontal: 16,
      marginTop: 20,
      marginBottom: 20,
    },
    placeItem: {
      flexDirection: "row",
      marginBottom: 16,
      backgroundColor: COLORS.light,
      borderRadius: 12,
      overflow: "hidden",
      shadowColor: COLORS.dark,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    placeImage: {
      width: 100,
      height: 100,
    },
    placeDetails: {
      flex: 1,
      padding: 12,
      justifyContent: "space-between",
    },
    placeName: {
      fontSize: 16,
      fontWeight: "600",
    },
    placeRating: {
      fontSize: 14,
      color: COLORS.grey,
    },
    placePrice: {
      fontSize: 16,
      fontWeight: "700",
      color: COLORS.primary,
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
    carouselIndicators: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      bottom: 10,
      width: '100%',
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      marginHorizontal: 4,
    },
    activeIndicator: {
      backgroundColor: COLORS.primary,
      width: 12,
      height: 12,
      borderRadius: 6,
    },
    categoryIconContainer: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: 'rgba(0, 122, 255, 0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 8,
    },
  })
  export default styles;