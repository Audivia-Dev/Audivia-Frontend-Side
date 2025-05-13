import { View, StyleSheet, Dimensions, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import MapView, { Marker } from 'react-native-maps'
import * as Location from 'expo-location'

interface UserLocationMapProps {
  height?: number;
  width?: number;
  showMarker?: boolean;
}

export default function UserLocationMap({ 
  height = 200, 
  width = Dimensions.get('window').width,
  showMarker = true 
}: UserLocationMapProps) {
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied')
        return
      }

      let location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    })()
  }, [])

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