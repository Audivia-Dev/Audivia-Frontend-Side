import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Link } from "expo-router";
export default function Index() {
    return (
        <View>
            <Text>Home screeen</Text>
            <Link href="/profile">Next profile</Link>
        </View>

    )
}
