import { StyleSheet, View, Image, Text } from "react-native"
import Colors from "../constants/colors"

export default function ErrorMessage({ children }) {
    return (
        <View style={styles.errorContainer}>
            <View style={styles.messageContainer}>
                <Image
                    style={styles.messageIcon}
                    source={require('../assets/images/error_red.png')}
                />
                <Text style={styles.messageText}>{children}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    errorContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#013b86',
        borderRadius: 4,
        overflow: 'hidden'
    },
    messageContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    messageIcon: {
        width: 18,
        height: 18
    },
    messageText: {
        fontSize: 16,
        marginLeft: 12,
        color: Colors['blue-lightest']
    }
})