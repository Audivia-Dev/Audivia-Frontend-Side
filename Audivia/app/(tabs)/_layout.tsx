import React from 'react'
import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons'
import { COLORS } from '@/constants/theme'
import Animated from 'react-native-reanimated'

export default function TabLayout() {
  return (
    
    <Tabs screenOptions={
        {tabBarShowLabel: false,
            tabBarActiveTintColor: COLORS.primary,
            tabBarInactiveTintColor: COLORS.grey,
            tabBarStyle: {
                borderRadius: 20,
                height: 60,
                marginHorizontal: 20,
                marginBottom: 20,
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 10,
                paddingBottom: 10,
                borderWidth: 1,
                opacity: 0.8,

            }
        }
    }>
      {[
        { name: 'index', icon: 'home' },
        { name: 'forum', icon: 'people' },
        { name: 'map', icon: 'map' },
        { name: 'save_tour', icon: 'heart' },
        { name: 'menu', icon: 'menu' },
      ].map(({ name, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => {
              const scale = focused ? 1.5 : 1
              const opacity = focused ? 1 : 0.6
              return (
                <Animated.View style={{ transform: [{ scale }], opacity }}>
                  <Ionicons name={icon} size={size} color={color} />
                </Animated.View>
              )
            },
          }}
        />
      ))}
    </Tabs>
  )
}