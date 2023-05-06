import { useContext } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import OptionsMenu from './components/OptionsMenu';
import SpinnerOverlay from './components/SpinnerOverlay';

import Colors from './constants/colors';

import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ContactsScreen from './screens/ContactsScreen';
import ContactScreen from './screens/ContactScreen';
import AddContactScreen from './screens/AddContactScreen';
import NewChatScreen from './screens/NewChatScreen';
import ChatScreen from './screens/ChatScreen';
import ChatsScreen from './screens/ChatsScreen';
import ChatSettingsScreen from './screens/ChatSettingsScreen';
import AddParticipantsScreen from './screens/AddParticipantsScreen';
import SettingsScreen from './screens/SettingsScreen';
import BlockedContactsScreen from './screens/BlockedContactsScreen';

import AuthContextProvider, { AuthContext } from './store/auth-context';
import SettingsContextProvider from './store/settings-context';
import BlockedContactsContextProvider from './store/blocked-contacts-context';
import ContactsContextProvider from './store/contacts-context';
import ContactContextProvider from './store/contact-context';
import ChatsContextProvider from './store/chats-context';
import ChatsDetailsContextProvider from './store/chats-details-context';
import ChatContextProvider, { ChatContext } from './store/chat-context';
import DraftsContextProvider from './store/drafts-context';

const Stack = createNativeStackNavigator();
const Tab = createMaterialTopTabNavigator();

function UnauthStack() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false
    }}>
      <Stack.Screen name='Login' component={LoginScreen} />
      <Stack.Screen name='Signup' component={SignUpScreen} />
    </Stack.Navigator>
  );
}

function AuthTab() {
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <OptionsMenu />
      <Tab.Navigator screenOptions={{
        tabBarStyle: { backgroundColor: Colors['blue-dark'] },
        tabBarActiveTintColor: Colors['green-light'],
        tabBarInactiveTintColor: Colors['blue-lightest'],
        tabBarLabelStyle: { fontSize: 14 },
        tabBarIndicatorStyle: { borderBottomColor: Colors['green-light'], borderBottomWidth: 4 }
      }}>
        <Tab.Screen name='Contacts' component={ContactsScreen} />
        <Tab.Screen name='Chats' component={ChatsScreen} />
      </Tab.Navigator>
    </View>

  );
}

function AuthStack() {
  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen name='WrappedAuthStack' component={WrappedAuthStack} />
      </Stack.Navigator>
    </View>

  )
}

function WrappedAuthStack() {
  return (
    <ContactContextProvider>
      <Stack.Navigator
        screenOptions={{
          headerTintColor: Colors['blue-lightest'],
          headerStyle: {
            backgroundColor: Colors['blue-dark'],
          }
        }}
      >
        <Stack.Screen name='Tabs' options={{ headerShown: false }} component={AuthTab} />
        <Stack.Screen name='Settings' component={SettingsScreen} />
        <Stack.Screen name='Blocked' component={BlockedContactsScreen} />
        <Stack.Screen name='Contact' component={ContactScreen} />
        <Stack.Screen name='Chat' options={{ headerShown: false }} component={ChatScreen} />
        <Stack.Screen name='Add' options={{ headerShown: false }} component={AddContactScreen} />
        <Stack.Screen name='ChatSettings' options={{ title: 'Chat Settings' }} component={ChatSettingsScreen} />
        <Stack.Screen name='AddParticipants' options={{ headerShown: false }} component={AddParticipantsScreen} />
        <Stack.Screen name='NewConversation' options={{ title: 'New Conversation' }} component={NewChatScreen} />
      </Stack.Navigator>
    </ContactContextProvider>
  )
}

function Nav() {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {authCtx.isFetching ?
        <SpinnerOverlay isFetching={authCtx.isFetching} /> :
        authCtx.isAuthenticated ?
          <AuthStack /> :
          <UnauthStack />
      }
      {/* {!authContext.isAuthenticated && <UnauthStack />}
      {authContext.isAuthenticated && <AuthStack />} */}
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <AuthContextProvider>
      <ContactsContextProvider>
        <DraftsContextProvider>
          <ChatsContextProvider>
            <ChatsDetailsContextProvider>
              <ChatContextProvider>
                <BlockedContactsContextProvider>
                  <SettingsContextProvider>
                    <Nav />
                  </SettingsContextProvider>
                </BlockedContactsContextProvider>
              </ChatContextProvider>
            </ChatsDetailsContextProvider>
          </ChatsContextProvider>
        </DraftsContextProvider>
      </ContactsContextProvider>
    </AuthContextProvider>
  );
}



