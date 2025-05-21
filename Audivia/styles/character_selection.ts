import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '@/constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.9;
const CARD_PADDING = 16;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
  scrollContent: {
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  cardsContainer: {
    gap: 16,
  },
  characterCard: {
    width: CARD_WIDTH,
    alignSelf: 'center',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    padding: CARD_PADDING,
    borderRadius: 16,
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  emoji: {
    fontSize: 28,
  },
  characterInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  characterName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  genderBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  genderText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  voiceDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  previewContainer: {
    marginLeft: 12,
    width: 60,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  disabledButton: {
    backgroundColor: '#E0E0E0',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});