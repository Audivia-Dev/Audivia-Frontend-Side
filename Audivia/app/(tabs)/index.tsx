import { Image, Text, TouchableOpacity, View, ScrollView, TextInput, StyleSheet } from "react-native"
import { Ionicons, MaterialIcons, FontAwesome, FontAwesome5 } from "@expo/vector-icons"
import styles from "@/styles/home.styles"
import { COLORS } from "@/constants/theme"

export default function Index() {
  return (
    <View style={styles.container}>
      {/* Header */}
    <View style={styles.header}>
    <Text style={styles.title}>Trang chủ</Text>
        <View style={styles.headerIcons}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.dark} style={styles.icon} />
            <Ionicons name="person-circle-outline" size={22} color={COLORS.primary} />
        </View>
    </View>

    <View style={styles.locationContainer}>
        <Ionicons name="location-outline" size={18} color="#000" />
        <Text style={styles.locationText}>Thu Duc, HCM</Text>
    </View>


      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={COLORS.grey} />
        <TextInput style={styles.searchInput} placeholder="Tìm kiếm địa điểm" placeholderTextColor={COLORS.grey} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image */}
        <View style={styles.mainImageContainer}>
          <Image
            source={require('../../assets/images/benthanh.png')}
            style={styles.mainImage}
            resizeMode="cover"
          />
        </View>

        {/* Categories */}
        <View style={styles.categoriesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Danh mục</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.categoriesContainer}>
            <View style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: COLORS.blueLight }]}>
                <FontAwesome5 name="landmark" size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.categoryText}>Di tích lịch sử</Text>
            </View>

            <View style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: COLORS.greenLight }]}>
                <MaterialIcons name="nature" size={20} color={COLORS.green} />
              </View>
              <Text style={styles.categoryText}>Tự nhiên</Text>
            </View>

            <View style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: COLORS.purpleLight }]}>
                <MaterialIcons name="palette" size={20} color={COLORS.purple} />
              </View>
              <Text style={styles.categoryText}>Mỹ thuật</Text>
            </View>

            <View style={styles.categoryItem}>
              <View style={[styles.categoryIcon, { backgroundColor: COLORS.orangeLight }]}>
                <MaterialIcons name="restaurant" size={20} color={COLORS.orange} />
              </View>
              <Text style={styles.categoryText}>Ẩm thực</Text>
            </View>
          </View>
        </View>

        {/* Map Section */}
        <View style={styles.mapContainer}>
          <Image
            source={require('../../assets/images/map-current.png')}
            style={styles.mapImage}
            resizeMode="cover"
          />
        </View>

        {/* Suggested Tours */}
        <View style={styles.toursSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Các địa điểm được đề xuất</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.tourSubtitle}>Dựa trên sở thích và vị trí của bạn</Text>

          <View style={styles.tourCard}>
            <Image
              source={require('../../assets/images/nvh1.jpg')}
              style={styles.tourImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={20} color={COLORS.light} />
            </TouchableOpacity>

            <View style={styles.tourDetails}>
              <Text style={styles.tourName}>NHÀ VĂN HÓA SINH VIÊN</Text>
              <Text style={styles.tourLocation}>HCM, Vietnam</Text>

              <View style={styles.tourRating}>
                <FontAwesome name="star" size={14} color={COLORS.orange} />
                <Text style={styles.ratingText}>4.6 • 2 giờ</Text>
              </View>

              <View style={styles.tourFooter}>
                <Text style={styles.freeTag}>Miễn phí</Text>
                <TouchableOpacity style={styles.bookButton}>
                  <Text style={styles.bookButtonText}>Đặt ngay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Top Places */}
        <View style={styles.topPlacesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Các địa điểm nổi bật</Text>
          </View>

          <View style={styles.placeItem}>
            <Image
              source={require('../../assets/images/cung-dinh-hue.jpg')}
              style={styles.placeImage}
              resizeMode="cover"
            />
            <View style={styles.placeDetails}>
              <Text style={styles.placeName}>Cung đình Huế</Text>
              <Text style={styles.placeRating}>★★★★☆ 4.2 • 2 giờ</Text>
              <Text style={styles.placePrice}>140.000đ</Text>
            </View>
          </View>

          <View style={styles.placeItem}>
            <Image
              source={require('../../assets/images/ben-nha-rong.jpg')}
              style={styles.placeImage}
              resizeMode="cover"
            />
            <View style={styles.placeDetails}>
              <Text style={styles.placeName}>Bến Nhà Rồng</Text>
              <Text style={styles.placeRating}>★★★★★ 4.8 • 1 giờ</Text>
              <Text style={styles.placePrice}>350.000đ</Text>
            </View>
          </View>

          <View style={styles.placeItem}>
            <Image
              source={require('../../assets/images/lang-khai-dinh.jpg')}
              style={styles.placeImage}
              resizeMode="cover"
            />
            <View style={styles.placeDetails}>
              <Text style={styles.placeName}>Lăng Khải Định</Text>
              <Text style={styles.placeRating}>★★★★☆ 4.3 • 2 giờ</Text>
              <Text style={styles.placePrice}>180.000đ</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

