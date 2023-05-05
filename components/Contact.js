import { View, Text, StyleSheet, Image, Pressable } from "react-native"
import Colors from "../constants/colors"

export default function Contact({ profilePhoto, firstName, onPress }) {
    return (
        <View>
            <Pressable
                style={styles.container}
                onPress={onPress}
            >
                <Image
                    style={styles.contactPhoto}
                    source={{ uri: profilePhoto }}
                />
                <Text style={styles.contactName}>{firstName}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    contactPhoto: {
        width: 48,
        height: 48,
        margin: 16,
        borderRadius: '50%'
    },
    contactName: {
        fontSize: 18,
        color: Colors['ice']
    }
})