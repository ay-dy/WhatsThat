import { useContext, useState } from "react"
import { Image, View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native"
import { updateUserInfo, uploadUserProfilePhoto } from "../utils/api-service";
import { SettingsContext } from "../store/settings-context";
import { AuthContext } from "../store/auth-context";
import { Menu, MenuItem } from "react-native-material-menu";
import { useNavigation } from "@react-navigation/native";

import SpinnerOverlay from "../components/SpinnerOverlay";
import Colors from "../constants/colors";
import SettingsDetail from "../components/SettingsDetail";
import validator from "validator";
import * as ImagePicker from 'expo-image-picker';
import ErrorMessage from "../components/ErrorMessage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
    const userCtx = useContext(SettingsContext);
    const authCtx = useContext(AuthContext);

    const navigation = useNavigation();

    const [isMenuvisible, setIsMenuvisible] = useState(false);
    const [isSaveButtonVisible, setIsSaveButtonVisible] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(userCtx.profile_photo);
    const [uploadedPhotoSize, setUploadedPhotoSize] = useState();
    const [userInfo, setUserInfo] = useState(userCtx.info);
    const [isFetching, setIsFetching] = useState(false);

    function inputValidator(input, previousValue) {
        if (!validator.isEmpty(input) && previousValue != input) {
            setIsSaveButtonVisible(true);
        } else {
            setIsSaveButtonVisible(false);
        }
    }

    async function saveHandler() {
        setIsSaveButtonVisible(false);
        setIsFetching(true);

        const updateUserInfoResults = await updateUserInfo(authCtx.id, authCtx.token, userInfo);

        if (updateUserInfoResults.response.ok) {
            const uploadUserProfilePhotoResults = await uploadUserProfilePhoto(authCtx.id, authCtx.token, profilePhoto);

            if (uploadUserProfilePhotoResults.response.ok) {
                await AsyncStorage.setItem('password', userInfo.password);
                userCtx.set(profilePhoto, userInfo);
            } else {
                console.log(uploadUserProfilePhotoResults.responseData);
            }
        } else {
            console.log(updateUserInfoResults.responseData);
        }
        setIsFetching(false);
    }

    const showImagePicker = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync();

        if (!result.canceled) {
            let uri = result.assets[0].uri;

            let res = await fetch(uri);
            let photoBlob = await res.blob();
            let sizeInKb = Math.floor(photoBlob.size / 1000);
            setUploadedPhotoSize(sizeInKb);

            if (sizeInKb <= 250) {
                setProfilePhoto(uri);
                setIsSaveButtonVisible(true);
            }
        }
    }

    const openCamera = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (!permissionResult.granted) {
            return;
        }

        const result = await ImagePicker.launchCameraAsync();

        if (!result.canceled) {
            let uri = result.assets[0].uri;

            let res = await fetch(uri);
            let photoBlob = await res.blob();
            let sizeInKb = Math.floor(photoBlob.size / 1000);
            setUploadedPhotoSize(sizeInKb);

            if (sizeInKb <= 250) {
                setProfilePhoto(uri);
                setIsSaveButtonVisible(true);
            }
        }
    }

    function showMenu() {
        setIsMenuvisible(true);
    }

    function hideMenu() {
        setIsMenuvisible(false);
    }

    if (isFetching) {
        return <SpinnerOverlay isFetching={isFetching} />
    } else {
        return (
            <View style={styles.settingsContainer}>
                <View style={styles.profilePhotoWrapper}>
                    <View style={styles.profilePhotoContainer}>
                        <Image
                            style={styles.profilePhoto}
                            source={{ uri: profilePhoto }}
                        />
                    </View>
                    <View style={styles.iconContainer}>
                        <Menu
                            visible={isMenuvisible}
                            anchor={
                                <TouchableOpacity onPress={showMenu}>
                                    <Image
                                        style={styles.icon}
                                        source={require('../assets/images/image_select_icon.png')}
                                    />
                                </TouchableOpacity>
                            }
                            onRequestClose={hideMenu}
                            style={styles.menuContainer}
                        >
                            <MenuItem
                                onPress={() => {
                                    hideMenu();
                                    openCamera();
                                }}
                                style={styles.menuItemContainer}
                                textStyle={styles.menuItemText}
                            >
                                Camera
                            </MenuItem>
                            <MenuItem
                                onPress={() => {
                                    hideMenu();
                                    showImagePicker();
                                }}
                                style={styles.menuItemContainer}
                                textStyle={styles.menuItemText}
                            >
                                Gallery
                            </MenuItem>
                        </Menu>
                    </View>
                </View>
                {uploadedPhotoSize > 250 ?
                    <View style={styles.errorMessageContainer}>
                        <ErrorMessage>
                            File size is too large. The maximum size allowed is 250KB.
                        </ErrorMessage>
                    </View>
                    : null
                }

                <SettingsDetail
                    iconFileName={'user_grey.png'}
                    label={'First Name'}
                    text={userInfo.first_name}
                    onChangeText={(input) => {
                        inputValidator(input, userCtx.info.first_name);
                        setUserInfo({ ...userInfo, first_name: input })
                    }}
                />
                <SettingsDetail
                    iconFileName={'user_grey.png'}
                    label={'Last Name'}
                    text={userInfo.last_name}
                    onChangeText={(input) => {
                        inputValidator(input, userCtx.info.last_name);
                        setUserInfo({ ...userInfo, last_name: input })
                    }}
                />
                <SettingsDetail
                    iconFileName={'at_grey.png'}
                    label={'Email'}
                    text={userInfo.email}
                    onChangeText={(input) => {
                        inputValidator(input, userCtx.info.email);
                        setUserInfo({ ...userInfo, email: input })
                    }}
                />
                <SettingsDetail
                    iconFileName={'key_grey.png'}
                    label={'Password'}
                    text={userInfo.password}
                    onChangeText={(input) => {
                        inputValidator(input, userCtx.info.password);
                        setUserInfo({ ...userInfo, password: input })
                    }}
                />
                <TouchableOpacity
                    style={{ height: 64, flexDirection: 'row', alignItems: 'center' }}
                    onPress={() => navigation.navigate('Blocked')}
                >
                    <Image
                        style={{ width: 24, height: 24, marginHorizontal: 24 }}
                        source={require('../assets/images/x_mark_grey.png')}
                    />
                    <Text style={{ fontSize: 18, color: Colors['ice'] }}>Blocked Contacts</Text>
                </TouchableOpacity>
                {isSaveButtonVisible &&
                    <View style={styles.buttonWrapper}>
                        <View style={styles.buttonOuterContainer}>
                            <Pressable
                                style={styles.buttonInnerContainer}
                                onPress={saveHandler}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </Pressable>
                        </View>
                    </View>
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    settingsContainer: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        backgroundColor: Colors['blue-darker']
    },
    profilePhotoWrapper: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 48
    },
    profilePhotoContainer: {
        width: 150,
        height: 150,
        alignItems: 'center',
        justifyContent: 'center'
    },
    profilePhoto: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
    },
    iconContainer: {
        width: 150,
        height: 150,
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        position: 'absolute'
    },
    icon: {
        width: 48,
        height: 48
    },
    menuContainer: {
        borderRadius: 16,
        backgroundColor: Colors['blue'],
        overflow: 'hidden'
    },
    buttonWrapper: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 24
    },
    buttonOuterContainer: {
        borderRadius: 24,
        marginVertical: 16,
        overflow: 'hidden'
    },
    buttonInnerContainer: {
        backgroundColor: Colors['green'],
        paddingVertical: 12,
        paddingHorizontal: 24
    },
    buttonText: {
        color: Colors['ice'],
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500'
    },
    menuContainer: {
        width: '30%',
        marginTop: 48,
        marginLeft: 8,
        borderRadius: 16,
        backgroundColor: Colors['blue'],
        overflow: 'hidden'
    },
    menuItemContainer: {
        backgroundColor: Colors['blue']
    },
    menuItemText: {
        fontSize: 16,
        color: Colors['ice']
    },
    errorMessageContainer: {
        width: '100%',
        height: 64,
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingHorizontal: 24,
        marginBottom: 16
    },
})