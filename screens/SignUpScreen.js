import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { addUser } from '../utils/api-service';

import validator from 'validator';
import Form from '../components/Form';
import DataField from '../components/DataField';
import Colors from '../constants/colors';
import SpinnerOverlay from '../components/SpinnerOverlay';
import ErrorMessage from '../components/ErrorMessage';

export default function SignUpScreen({ navigation }) {
    const [credentials, setCredentials] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });

    const [credentialsValid, setCredentialsValid] = useState({
        first_name: true,
        last_name: true,
        email: true,
        password: true
    });

    const [isFetching, setIsFetching] = useState(false);
    const [signUpErrorMessage, setSignUpErrorMessage] = useState('');

    function firstNameHandler(firstNameInput) {
        setCredentials({ ...credentials, first_name: firstNameInput });
        setCredentialsValid({ ...credentialsValid, first_name: !validator.isEmpty(firstNameInput) });
    }

    function lastNameHandler(lastNameInput) {
        setCredentials({ ...credentials, last_name: lastNameInput });
        setCredentialsValid({ ...credentialsValid, last_name: !validator.isEmpty(lastNameInput) });
    }

    function emailHandler(emailInput) {
        setCredentials({ ...credentials, email: emailInput });
        setCredentialsValid({ ...credentialsValid, email: !validator.isEmpty(emailInput) && validator.isEmail(emailInput) });
    }

    function passwordHandler(passwordInput) {
        setCredentials({ ...credentials, password: passwordInput });
        setCredentialsValid({ ...credentialsValid, password: !validator.isEmpty(passwordInput) && validator.isStrongPassword(passwordInput) });
    }

    function allValid() {
        let allValid = true;
        Object.values(credentialsValid).every(valid => {
            if (valid == false) {
                allValid = false;
                return false;
            }
        })

        // Do a final isEmpty check to prevent unmodified input fields from sliding through.
        Object.values(credentials).every(item => {
            if (validator.isEmpty(item)) {
                allValid = false;
                return false;
            }
        })
        return allValid;
    }

    async function signUpHandler() {
        if (allValid) {
            setIsFetching(true);
            const addUserResults = await addUser(credentials);

            switch (addUserResults.response.status) {
                case 400:
                    setSignUpErrorMessage("One or more fields doesn't match the criteria.");
                    break;
                case 500:
                    setSignUpErrorMessage('Server error.');
                    break;
                default:
                    navigation.navigate('Login');
            }
            setIsFetching(false);
        } else {
            setSignUpErrorMessage('Server error.');
        }
    }

    if (isFetching) {
        return <SpinnerOverlay isFetching={isFetching} />
    } else {
        return (
            <View style={styles.container}>
                <Form
                    submitValue={'SIGN UP'}
                    submitHandler={signUpHandler}
                    switchValue={'Already on WhatsThat?'}
                    switchHandler={() => navigation.navigate("Login")}

                >
                    {signUpErrorMessage ? <ErrorMessage>{signUpErrorMessage}</ErrorMessage> : null}
                    <DataField
                        label={"What's your name?"}
                        text={credentials.first_name}
                        placeholder={'Enter your first name'}
                        inputHandler={firstNameHandler}
                        isValid={credentialsValid.first_name}
                    />
                    {credentialsValid.first_name ? null : <Text style={styles.errorMessage}>Required</Text>}
                    <DataField
                        label={"What's your last name?"}
                        text={credentials.last_name}
                        placeholder={'Enter your last name'}
                        inputHandler={lastNameHandler}
                        isValid={credentialsValid.last_name}
                    />
                    {credentialsValid.last_name ? null : <Text style={styles.errorMessage}>Required</Text>}
                    <DataField
                        label={"What's your email address?"}
                        text={credentials.email}
                        placeholder={'Enter your email address '}
                        inputHandler={emailHandler}
                        isValid={credentialsValid.email}
                    />
                    {credentialsValid.email ? null : <Text style={styles.errorMessage}>Invalid email address</Text>}
                    <DataField
                        label={'Create a strong password'}
                        text={credentials.password}
                        placeholder={'Create a strong password'}
                        secureEntry={true}
                        inputHandler={passwordHandler}
                        isValid={credentialsValid.password}
                    />
                    {credentialsValid.password ? null : <Text style={styles.errorMessage}>Password must be greater than 8 characters (including: one uppercase, one number and one special)</Text>}
                </Form>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors['blue-darker'],
        alignItems: 'center',
        justifyContent: 'center'
    },
    errorMessage: {
        paddingLeft: 16,
        fontSize: 14,
        color: Colors['red']
    }
});

