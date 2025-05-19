import { COLORS } from "@/constants/theme";
import { StyleSheet
    
 } from "react-native";
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    header: {
      padding: 20,
      alignItems: 'center',
      backgroundColor: COLORS.purpleLight,
      borderBottomLeftRadius: 20,
      borderBottomRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: '#666',
    },
    scrollContent: {
      padding: 20,
    },
    avatarsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    avatarWrapper: {
      width: '30%',
      alignItems: 'center',
      marginBottom: 20,
      position: 'relative',
    },
    selectedAvatarWrapper: {
      transform: [{ scale: 1.05 }],
    },
    avatarCircle: {
      width: 90,
      height: 90,
      borderRadius: 45,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      borderWidth: 3,
      borderColor: 'transparent',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    emoji: {
      fontSize: 40,
    },
    characterName: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
      marginBottom: 5,
      textAlign: 'center',
    },
    genderBadge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 12,
    },
    genderText: {
      color: 'white',
      fontSize: 12,
      fontWeight: 'bold',
    },
    selectedCharacterInfo: {
      marginTop: 10,
      marginBottom: 20,
    },
    infoCard: {
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    infoHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    miniAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    miniEmoji: {
      fontSize: 24,
    },
    infoText: {
      flex: 1,
    },
    infoName: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#333',
    },
    infoGender: {
      fontSize: 14,
      fontWeight: '500',
    },
    voiceDescription: {
      fontSize: 15,
      color: '#555',
      marginBottom: 16,
      lineHeight: 22,
    },
    previewButton: {
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
    },
    previewButtonText: {
      color: 'white',
      fontWeight: 'bold',
      fontSize: 14,
    },
    footer: {
      padding: 20,
      backgroundColor: 'white',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 3,
    },
    confirmButton: {
      borderRadius: 16,
      padding: 16,
      alignItems: 'center',
    },
    disabledButton: {
      backgroundColor: '#DDDDDD',
    },
    confirmButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });
  export default styles