import { useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";
import Colors from "../constants/colors";

export default function DataField({ label, placeholder, text, secureEntry, inputHandler, isValid }) {
    const [isFocused, setIsFocused] = useState(false);

    function focusHandler() {
        setIsFocused(true);
    }

    function blurHandler() {
        setIsFocused(false)
    }

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TextInput
                style={[styles.text, isValid ? styles.text : styles.textError, isFocused ? styles.textFocus : '']}
                defaultValue={text}
                placeholder={placeholder}
                placeholderTextColor={Colors['steel-light']}
                secureTextEntry={secureEntry}
                onChangeText={e => { inputHandler(e); isValid; }}
                onFocus={focusHandler}
                onBlur={blurHandler}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginTop: 6,
        marginBottom: 12
    },
    label: {
        color: Colors['blue-lightest'],
        paddingVertical: 8,
        fontWeight: '500'
    },
    text: {
        color: Colors['ice'],
        borderWidth: 1,
        borderColor: Colors['steel'],
        borderRadius: 4,
        padding: 12,
        fontSize: 16,
        //outlineColor: Colors['green'],
        outlineStyle: 'none'
    },
    textFocus: {
        borderWidth: 3
    },
    textError: {
        borderColor: Colors['red'],
    },
    textValid: {
        borderColor: Colors['green-light'],
    }
})