import { View, StyleSheet, Dimensions, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

interface UserLocationMapProps {
  height?: number;
  width?: number;
  showMarker?: boolean;
  onLocationChange?: (address: string | null, coordinates?: { latitude: number; longitude: number } | null) => void;
}

export default function UserLocationMap({
  height = 200,
  width = Dimensions.get('window').width,
  showMarker = true,
  onLocationChange
}: UserLocationMapProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        if (onLocationChange) {
          onLocationChange(null, null);
        }
        return
      }

      let fetchedLocation = await Location.getCurrentPositionAsync({}) // current location
      setLocation(fetchedLocation)

      if (onLocationChange) {
        if (fetchedLocation) {
          const coordinates = {
            latitude: fetchedLocation.coords.latitude,
            longitude: fetchedLocation.coords.longitude
          };
          try {
            const reverseGeocode = await Location.reverseGeocodeAsync({
              latitude: fetchedLocation.coords.latitude,
              longitude: fetchedLocation.coords.longitude,
            });
            if (reverseGeocode.length > 0) {
              const { street, city } = reverseGeocode[0];
              const address = [street, city].filter(Boolean).join(', ');
              onLocationChange(address, coordinates);
            } else {
              onLocationChange('Không tìm thấy địa chỉ', coordinates);
            }
          } catch (e) {
            console.error("Reverse geocoding error:", e);
            onLocationChange('Lỗi tìm địa chỉ', coordinates);
          }
        } else {
          onLocationChange(null, null);
        }
      }
    })()
  }, [onLocationChange])

  if (!location) {
    return (
      <View style={[styles.container, { height, width }]}>
        <View style={styles.loadingContainer}>
          <Text>{errorMsg || 'Đang tải bản đồ...'}</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={[styles.container, { height, width }]}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        scrollEnabled={true}
        zoomEnabled={true}
        rotateEnabled={true}
      >
        {showMarker && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="Vị trí của bạn"
          />
        )}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 15,
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
}) 