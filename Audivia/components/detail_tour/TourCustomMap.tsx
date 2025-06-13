import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Tour } from '@/models';
import * as Location from 'expo-location';
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface TourCustomMapProps {
    tour: Tour;
    height?: number;
}

export const TourCustomMap: React.FC<TourCustomMapProps> = ({ tour, height = 300 }) => {
    const [mapRegion, setMapRegion] = useState<Region | null>(null);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [loadingUserLocation, setLoadingUserLocation] = useState<boolean>(true);
    const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number, longitude: number }[]>([]);

    useEffect(() => {
        let locationSubscription: Location.LocationSubscription | null = null;

        const watchUserLocation = async () => {
            setLoadingUserLocation(true);
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Location permission not granted');
                    setLoadingUserLocation(false);
                    return;
                }

                locationSubscription = await Location.watchPositionAsync(
                    {
                        accuracy: Location.Accuracy.BestForNavigation,
                        timeInterval: 1000,
                        distanceInterval: 5,
                    },
                    (location) => {
                        setUserLocation(location);
                        setLoadingUserLocation(false);
                    }
                );
            } catch (error) {
                console.error('Error watching user location:', error);
                setLoadingUserLocation(false);
            }
        };

        watchUserLocation();

        return () => {
            locationSubscription?.remove();
        };
    }, []);

    useEffect(() => {
        if (!tour) return;

        if (tour.startLatitude && tour.startLongitude) {
            setMapRegion({
                latitude: tour.startLatitude,
                longitude: tour.startLongitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            });

            // Draw route from user to start location if user location is available
            if (userLocation) {
                setRouteCoordinates([
                    { latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude },
                    { latitude: tour.startLatitude, longitude: tour.startLongitude }
                ]);
            }
        }
    }, [tour, userLocation]);

    const handleOpenDirections = () => {
        if (tour.startLatitude && tour.startLongitude && userLocation) {
            const webUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.coords.latitude},${userLocation.coords.longitude}&destination=${tour.startLatitude},${tour.startLongitude}&travelmode=walking`;
            Linking.canOpenURL(webUrl)
                .then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + webUrl);
                    } else {
                        return Linking.openURL(webUrl);
                    }
                })
                .catch(err => console.error('An error occurred', err));
        }
    };

    const handleViewCustomMap = () => {
        router.push({
            pathname: "/tour_custom_map",
            params: { tourId: tour.id }
        });
    };

    if (loadingUserLocation) {
        return <ActivityIndicator size="large" color={COLORS.primary} style={{ height }} />;
    }

    return (
        <View style={[styles.container, { height }]}>
            {mapRegion && (
                <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={mapRegion} showsUserLocation={false}>
                    {userLocation && (
                        <Marker coordinate={{ latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude }} title="Vị trí của bạn">
                            <View style={styles.userMarker}><View style={styles.userMarkerDot} /></View>
                        </Marker>
                    )}
                    {tour.startLatitude && tour.startLongitude && (
                        <Marker coordinate={{ latitude: tour.startLatitude, longitude: tour.startLongitude }} title="Điểm bắt đầu tour">
                            <View style={[styles.checkpointMarker, styles.startMarker]} />
                        </Marker>
                    )}
                    {routeCoordinates.length > 1 && (
                        <Polyline coordinates={routeCoordinates} strokeWidth={4} strokeColor={COLORS.primary} lineDashPattern={[1]} />
                    )}
                </MapView>
            )}
            {userLocation && (
                <TouchableOpacity
                    style={styles.directionsButton}
                    onPress={handleOpenDirections}>
                    <Ionicons name="navigate" size={20} color="#FFF" />
                    <Text style={styles.directionsButtonText}>Chỉ đường</Text>
                </TouchableOpacity>
            )}
            {tour.customMapImages && tour.customMapImages.length > 0 && (
                <TouchableOpacity
                    style={styles.customMapButton}
                    onPress={handleViewCustomMap}>
                    <Text style={styles.customMapButtonText}>Chi tiết sơ đồ tham quan</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { width: '100%', borderRadius: 12, overflow: 'hidden' },
    map: { ...StyleSheet.absoluteFillObject },
    userMarker: { width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0, 122, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
    userMarkerDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
    checkpointMarker: { alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: '#FFF' },
    startMarker: { backgroundColor: COLORS.primary, borderColor: '#FFF', width: 34, height: 34, borderRadius: 17, borderWidth: 3 },
    directionsButton: { position: 'absolute', bottom: 60, right: 10, backgroundColor: COLORS.primary, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 },
    directionsButtonText: { color: '#FFF', fontWeight: 'bold', marginLeft: 4 },
    customMapButton: {
        position: 'absolute',
        bottom: 10,
        left: 16,
        right: 16,
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    customMapButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
}); 