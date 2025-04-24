import { COLORS } from "@/constants/theme"
import { StyleSheet } from "react-native"

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    mapContainer: {
      height: 200,
      position: "relative",
    },
    mapImage: {
      width: "100%",
      height: "100%",
    },
    headerOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 16,
    },
    backButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#000",
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    favoriteButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(0, 0, 0, 0.3)",
      justifyContent: "center",
      alignItems: "center",
    },
    tabsContainer: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
    },
    activeTab: {
      borderBottomWidth: 2,
      borderBottomColor: "#00BCD4",
    },
    tabText: {
      fontSize: 14,
      color: "#666",
    },
    activeTabText: {
      color: "#00BCD4",
      fontWeight: "600",
    },
    tourTitleContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    tourName: {
      fontSize: 22,
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
      color: "#00BCD4",
      marginLeft: 4,
    },
    ratingContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    starsContainer: {
      flexDirection: "row",
      marginRight: 8,
    },
    starIcon: {
      marginRight: 2,
    },
    ratingText: {
      fontSize: 14,
      color: "#666",
    },
    priceText: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#00BCD4",
    },
    overviewContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    sectionTitle: {
      fontSize: 22,
      fontWeight: "bold",
      color: "#000",
      marginBottom: 16,
    },
    overviewGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    overviewItem: {
      flexDirection: "row",
      alignItems: "center",
      width: "48%",
      marginBottom: 16,
    },
    overviewItemTextContainer: {
      marginLeft: 8,
    },
    overviewItemLabel: {
      fontSize: 12,
      color: "#666",
    },
    overviewItemValue: {
      fontSize: 14,
      fontWeight: "500",
      color: "#000",
    },
    descriptionContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#f0f0f0",
    },
    descriptionText: {
      fontSize: 14,
      lineHeight: 22,
      color: "#333",
      marginBottom: 8,
    },
    seeMoreText: {
      fontSize: 14,
      color: "#00BCD4",
      fontWeight: "500",
    },
    destinationsContainer: {
      padding: 16,
    },
    destinationsScrollContent: {
      paddingRight: 16,
    },
    destinationItem: {
      width: 150,
      marginRight: 12,
      position: "relative",
    },
    destinationImage: {
      width: "100%",
      height: 100,
      borderRadius: 8,
    },
    destinationName: {
      fontSize: 14,
      fontWeight: "500",
      marginTop: 8,
    },
    destinationBadge: {
      position: "absolute",
      top: 8,
      right: 8,
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: "#00BCD4",
      justifyContent: "center",
      alignItems: "center",
    },
    destinationBadgeText: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#fff",
    },
    mascotContainer: {
      position: "absolute",
      bottom: 80,
      right: 16,
    },
    mascotImage: {
      width: 60,
      height: 60,
    },
    startButtonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 16,
      backgroundColor: "#fff",
      borderTopWidth: 1,
      borderTopColor: "#f0f0f0",
    },
    startButton: {
      backgroundColor: "#00BCD4",
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: "center",
    },
    startButtonText: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#fff",
    },
    // Styles for "Before" tab
  beforeContainer: {
    padding: 16,
  },
  startLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  startLocationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  startLocationTitle: {
    fontSize: 14,
    color: "#666",
  },
  startLocationText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
  },
 
  routeItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  routeNumberContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  routeNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  routeContent: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 16,
  },
  routeName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  routeDescription: {
    fontSize: 14,
    color: "#666",
  },
  viewMapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  viewMapText: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.primary,
    marginLeft: 8,
  },

  // Styles for "Reviews" tab
  reviewsContainer: {
    padding: 16,
  },
  ratingOverview: {
    alignItems: "center",
    marginBottom: 16,
  },
  ratingBig: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#000",
  },
  ratingStarsContainer: {
    flexDirection: "row",
    marginVertical: 8,
  },
  ratingCount: {
    fontSize: 14,
    color: "#666",
  },
  ratingBars: {
    marginBottom: 24,
  },
  ratingBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingBarLabel: {
    width: 20,
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginRight: 8,
  },
  ratingBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  ratingBarFill: {
    height: "100%",
    backgroundColor: "#FFD700",
    borderRadius: 4,
  },
  reviewsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  filterButton: {
    padding: 4,
  },
  reviewItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    marginBottom: 12,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: "row",
  },
  reviewStarIcon: {
    marginRight: 2,
  },
  reviewTime: {
    fontSize: 12,
    color: "#999",
  },
  reviewComment: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333",
    marginBottom: 12,
  },
  reviewActions: {
    flexDirection: "row",
  },
  reviewAction: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  reviewActionText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  })
  