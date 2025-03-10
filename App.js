import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Start from './components/Start';
import Chat from './components/Chat';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { initializeApp } from 'firebase/app';
import { disableNetwork, enableNetwork, getFirestore } from 'firebase/firestore';

import { useNetInfo } from '@react-native-community/netinfo';
import { useEffect } from 'react';
import { LogBox, Alert } from 'react-native';

import { getStorage } from 'firebase/storage';

LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);

const Stack = createNativeStackNavigator();

const App = () => {
	const firebaseConfig = {
		apiKey: "AIzaSyCFaqz9YbgRD0pEQVQ668c0g4MGXEh7MXM",
		authDomain: "chatt-app-920b4.firebaseapp.com",
		projectId: "chatt-app-920b4",
		storageBucket: "chatt-app-920b4.firebasestorage.app",
		messagingSenderId: "769531865032",
		appId: "1:769531865032:web:8f7de6b311b0814de5c2fd"
	  };

	const app = initializeApp(firebaseConfig);

	const db = getFirestore(app);
	const storage = getStorage(app);

	const connectionStatus = useNetInfo();

	useEffect(() => {
		if (connectionStatus.isConnected === false) {
			Alert.alert("Connection Lost!");
			disableNetwork(db);
		} else if (connectionStatus.isConnected === true) {
			enableNetwork(db);
		}
	}, [connectionStatus.isConnected]);

	return (
		<NavigationContainer>
			<Stack.Navigator initialRouteName="Start">
				<Stack.Screen
					name="Start"
					component={Start}
				/>
				<Stack.Screen
					name="Chat"
				>
					{props => <Chat isConnected={connectionStatus.isConnected} db={db} storage={storage} {...props} />}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});

export default App;
