import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Colors from "../constants/colors";

export default function MessageEditPreview({ message, closeHandler }) {
    return (
        <View style={styles.mainOuterContainer}>
            <View style={styles.mainInnerContainer}>
                <View style={styles.labelContainer}>
                    <Text style={styles.label}>Edit Message</Text>
                    <TouchableOpacity style={styles.button} onPress={closeHandler}>
                        <Image
                            style={styles.image}
                            source={require('../assets/images/close_grey.png')}
                        />
                    </TouchableOpacity>
                </View>
                <Text numberOfLines={3} style={styles.text}>{message}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    mainOuterContainer: {
        width: '100%',
        borderRadius: 16,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        backgroundColor: Colors['blue']
    },
    mainInnerContainer: {
        maxWidth: '100%',
        justifyContent: 'space-between',
        margin: 8,
        marginBottom: 0,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        backgroundColor: Colors['blue-dark']
    },
    labelContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    label: {
        fontSize: 14,
        color: Colors['green-light'],
        marginBottom: 2
    },
    button: {
        width: 28,
        height: 28,
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    image: {
        width: 14,
        height: 14
    },
    text: {
        fontSize: 12,
        color: Colors['grey'],
    },
});