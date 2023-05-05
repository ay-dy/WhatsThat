import { StyleSheet } from "react-native";
import { TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function ChatSettingsButton() {
    const navigation = useNavigation();

    return (
        <TouchableOpacity style={styles.container} onPress={() => navigation.navigate('ChatSettings')}>
            <Image
                source={require('../assets/images/menu_blue.png')}
                style={styles.image}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginRight: 18,
        alignSelf: 'flex-end',
        justifyContent: 'center'
    },
    image: {
        width: 20,
        height: 20
    }
});