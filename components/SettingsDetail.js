import { View, Image, Text, StyleSheet, TextInput } from 'react-native'
import Colors from "../constants/colors";

export default function SettingsDetail({ iconFileName, label, text, onChangeText }) {
    return (
        <View style={styles.detailContainer}>
            <Image
                style={styles.detailImage}
                source={require('../assets/images/' + iconFileName)}
            />
            <View style={styles.detailWrapper}>
                <Text style={styles.detailLabel}>{label}</Text>
                <TextInput
                    style={styles.detailText}
                    defaultValue={text}
                    onChangeText={onChangeText}
                    secureTextEntry={label === 'Password'}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    detailContainer: {
        width: '100%',
        minHeight: 64,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingHorizontal: 24,
    },
    detailImage: {
        width: 24,
        height: 24,
        marginRight: 24
    },
    detailWrapper: {
        width: '85%',
        flexDirection: 'column'
    },
    detailLabel: {
        color: Colors['blue-lightest'],
        fontSize: 14
    },
    detailText: {
        color: Colors['ice'],
        fontSize: 18,
        outlineStyle: 'none'
    }
});