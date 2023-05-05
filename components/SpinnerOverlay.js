import { View, StyleSheet } from "react-native"

import Colors from "../constants/colors";
import Spinner from 'react-native-loading-spinner-overlay';

export default function SpinnerOverlay({ isFetching }) {
    return (
        <View style={styles.spinnerContainer}>
            <Spinner
                visible={isFetching}
                textStyle={styles.spinnerTextContent}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    spinnerContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors['blue-dark']
    },
    spinnerTextContent: {
        marginTop: 144,
        color: Colors['ice']
    }
})