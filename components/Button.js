import { View, Pressable, Text, StyleSheet } from "react-native"
import Colors from "../constants/colors"

export default function Button({ styleOverride, value, onSubmit }) {
    return (
        <View style={styles.buttonOuterContainer}>
            <Pressable
                style={[styles.buttonInnerContainer, styleOverride]}
                onPress={onSubmit}
            >
                <Text style={styles.buttonText}>{value}</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    buttonOuterContainer: {
        width: '100%',
        borderRadius: 24,
        marginVertical: 16,
        overflow: "hidden"
    },
    buttonInnerContainer: {
        backgroundColor: Colors["green"],
        paddingVertical: 12
    },
    buttonText: {
        color: Colors['ice'],
        textAlign: "center",
        fontSize: 16,
        fontWeight: '500'
    }
})