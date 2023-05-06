import { View, Image, StyleSheet } from "react-native";

import Colors from "../constants/colors";
import Button from "./Button";

export default function Form({ children, submitValue, submitHandler, switchValue, switchHandler }) {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.card}>
                <Image
                    style={styles.logo}
                    source={require('../assets/images/whatsthat_logo.png')}
                />
                <View style={styles.dataFieldContainer}>{children}</View>
                <Button
                    value={submitValue}
                    onSubmit={submitHandler}
                />
                <Button
                    styleOverride={{ backgroundColor: Colors['blue-dark'], paddingVertical: 0 }}
                    value={switchValue}
                    onSubmit={switchHandler}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        width: '100%',
        padding: 16
    },
    card: {
        padding: 16,
        borderRadius: 16,
        alignItems: 'center',
        backgroundColor: Colors["blue-dark"]
    },
    logo: {
        width: 64,
        height: 64,
        marginVertical: 16
    },
    dataFieldContainer: {
        width: '100%',
        paddingVertical: 16
    }
})