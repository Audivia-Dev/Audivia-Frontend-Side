// get tour checkpoints and route from Google Maps API and render on map with marker 

import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, ActivityIndicator, Text, TouchableOpacity, Linking, Platform } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { Checkpoint, Tour } from '@/models';
import * as Location from 'expo-location';
import { COLORS } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface UserLocationMapProps {
    tour: Tour;
    height?: number;
}

interface RouteInfo {
    distance: string;
    duration: string;
}

export const TourMap: React.FC<UserLocationMapProps> = ({ tour, height = 300 }) => {
    const [mapRegion, setMapRegion] = useState<Region | null>(null);
    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [routeCoordinates, setRouteCoordinates] = useState<{ latitude: number, longitude: number }[]>([]);
    const [routeInfo, setRouteInfo] = useState<RouteInfo>({ distance: '', duration: '' });
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Get user location
        const getUserLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Location permission not granted');
                    return;
                }

                const location = await Location.getCurrentPositionAsync({});
                setUserLocation(location);

                // If we have checkpoints, set the map region centered on the first checkpoint
                if (tour?.checkpoints?.length > 0) {
                    const firstCheckpoint = tour.checkpoints[0];
                    setMapRegion({
                        latitude: firstCheckpoint.latitude,
                        longitude: firstCheckpoint.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });

                    // Get route coordinates
                    if (tour.checkpoints.length > 1) {
                        await fetchRoute(tour.checkpoints);
                    }
                } else if (location) {
                    // If no checkpoints, center map on user location
                    setMapRegion({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }

                setLoading(false);
            } catch (error) {
                console.error('Error getting location:', error);
                setLoading(false);
            }
        };

        getUserLocation();
    }, [tour]);

    const fetchRoute = async (checkpoints: Checkpoint[]) => {
        if (checkpoints.length < 2) return;

        try {
            const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_ROUTE_API_KEY;
            // Prepare payload for Routes API
            const payload = {
                origin: {
                    location: {
                        latLng: {
                            latitude: checkpoints[0].latitude,
                            longitude: checkpoints[0].longitude,
                        },
                    },
                },
                destination: {
                    location: {
                        latLng: {
                            latitude: checkpoints[checkpoints.length - 1].latitude,
                            longitude: checkpoints[checkpoints.length - 1].longitude,
                        },
                    },
                },
                intermediates: checkpoints.slice(1, -1).map((cp: Checkpoint) => ({
                    location: {
                        latLng: {
                            latitude: cp.latitude,
                            longitude: cp.longitude,
                        },
                    },
                })),
                travelMode: "WALK", // Walking mode
                routingPreference: "TRAFFIC_AWARE", // Traffic-aware routing
                computeAlternativeRoutes: false, // No alternative routes needed
                units: "METRIC", // Use metric units
                languageCode: "en-US", // Language setting
            };

            const url = `https://routes.googleapis.com/directions/v2:computeRoutes?key=${API_KEY}`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Required header for Routes API
                    "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
                },
                body: JSON.stringify(payload),
            });

            const json = await response.json();

            if (json.routes && json.routes.length > 0) {
                const route = json.routes[0];
                // Decode the polyline
                const points = decodePolyline(route.polyline.encodedPolyline);
                setRouteCoordinates(points);

                // Set distance and duration info
                const totalDistance = route.distanceMeters / 1000; // Convert from meters to km
                const totalDuration = route.duration
                    ? parseInt(route.duration.replace("s", "")) / 60
                    : 0; // Convert from seconds to minutes

                setRouteInfo({
                    distance: totalDistance.toFixed(2),
                    duration: totalDuration.toFixed(0)
                });
            } else {
                throw new Error("Routes API error: " + (json.error?.message || "No routes found"));
            }
        } catch (error) {
            console.error("Error fetching route:", error);
            setRouteCoordinates([]);
            setRouteInfo({ distance: "N/A", duration: "N/A" });
        }
    };

    // Decode Google's encoded polyline
    const decodePolyline = (encoded: string): { latitude: number, longitude: number }[] => {
        const points: { latitude: number, longitude: number }[] = [];
        let index = 0, lat = 0, lng = 0;

        while (index < encoded.length) {
            let b, shift = 0, result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            const dlat = (result & 1) ? ~(result >> 1) : (result >> 1);
            lat += dlat;

            shift = 0;
            result = 0;

            do {
                b = encoded.charCodeAt(index++) - 63;
                result |= (b & 0x1f) << shift;
                shift += 5;
            } while (b >= 0x20);

            const dlng = (result & 1) ? ~(result >> 1) : (result >> 1);
            lng += dlng;

            points.push({
                latitude: lat * 1e-5,
                longitude: lng * 1e-5,
            });
        }

        return points;
    };

    if (loading) {
        return <ActivityIndicator size="large" color={COLORS.primary} style={{ height }} />;
    }

    return (
        <View style={[styles.container, { height }]}>
            {mapRegion && (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={mapRegion}
                    showsUserLocation={true}
                >
                    {/* User Location Marker */}
                    {userLocation && (
                        <Marker
                            coordinate={{
                                latitude: userLocation.coords.latitude,
                                longitude: userLocation.coords.longitude,
                            }}
                            title="Vị trí của bạn"
                        >
                            <View style={styles.userMarker}>
                                <View style={styles.userMarkerDot} />
                            </View>
                        </Marker>
                    )}

                    {/* Checkpoint Markers */}
                    {tour?.checkpoints?.map((checkpoint, index) => {
                        const isStart = index === 0;
                        const isEnd = index === (tour.checkpoints.length - 1);
                        const markerStyle = isStart
                            ? styles.startMarker
                            : isEnd
                                ? styles.endMarker
                                : styles.regularMarker;

                        return (
                            <Marker
                                key={checkpoint.id}
                                coordinate={{
                                    latitude: checkpoint.latitude,
                                    longitude: checkpoint.longitude,
                                }}
                                title={checkpoint.title}
                                description={checkpoint.description}
                            >
                                <View style={[styles.checkpointMarker, markerStyle]}>
                                    {!isStart && !isEnd && (
                                        <Text style={styles.markerText}>{index + 1}</Text>
                                    )}
                                </View>
                            </Marker>
                        );
                    })}

                    {/* Route Polyline */}
                    {routeCoordinates.length > 1 && (
                        <Polyline
                            coordinates={routeCoordinates}
                            strokeWidth={4}
                            strokeColor={COLORS.primary}
                            lineDashPattern={[1]}
                        />
                    )}
                </MapView>
            )}

            {/* Route Info */}
            {routeInfo.distance && routeInfo.duration && (
                <View style={styles.routeInfoContainer}>
                    <View style={styles.routeInfoItem}>
                        <Ionicons name="walk-outline" size={16} color="#FFF" />
                        <Text style={styles.routeInfoText}>
                            {routeInfo.distance !== "N/A" ? `${routeInfo.distance} km` : "N/A"}
                        </Text>
                    </View>
                    <View style={styles.routeInfoItem}>
                        <Ionicons name="time-outline" size={16} color="#FFF" />
                        <Text style={styles.routeInfoText}>
                            {routeInfo.duration !== "N/A" ? `${routeInfo.duration} phút` : "N/A"}
                        </Text>
                    </View>
                </View>
            )}

            {/* Directions Button */}
            {tour?.checkpoints?.length > 0 && userLocation && (
                <TouchableOpacity
                    style={styles.directionsButton}
                    onPress={() => {
                        const startPoint = tour.checkpoints[0];
                        const destination = `${startPoint.latitude},${startPoint.longitude}`;
                        const url = Platform.select({
                            ios: `maps://app?saddr=${userLocation.coords.latitude},${userLocation.coords.longitude}&daddr=${destination}`,
                            android: `google.navigation:q=${destination}&mode=w`
                        });

                        Linking.canOpenURL(url!)
                            .then(supported => {
                                if (supported) {
                                    return Linking.openURL(url!);
                                } else {
                                    const webUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.coords.latitude},${userLocation.coords.longitude}&destination=${destination}&travelmode=walking`;
                                    return Linking.openURL(webUrl);
                                }
                            })
                            .catch(err => console.error('An error occurred', err));
                    }}
                >
                    <Ionicons name="navigate" size={20} color="#FFF" />
                    <Text style={styles.directionsButtonText}>Chỉ đường</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    userMarker: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: 'rgba(0, 122, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    userMarkerDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.primary,
    },
    checkpointMarker: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    regularMarker: {
        backgroundColor: '#000',
    },
    startMarker: {
        backgroundColor: COLORS.primary,
        borderColor: '#FFF',
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 3,
    },
    endMarker: {
        backgroundColor: 'red',
        borderColor: '#FFF',
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 3,
    },
    markerText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 14,
    },
    directionsButton: {
        position: 'absolute',
        bottom: 10,
        right: 10,
        backgroundColor: COLORS.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    directionsButtonText: {
        color: '#FFF',
        fontWeight: 'bold',
        marginLeft: 4,
    },
    routeInfoContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        borderRadius: 12,
        padding: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    routeInfoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 8,
    },
    routeInfoText: {
        color: '#FFF',
        marginLeft: 4,
        fontWeight: '600',
    },
});


