import {
	StyleSheet,
	TextInput,
	View,
	Text,
	Alert,
	Button,
	LogBox,
} from 'react-native';
import { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { getStorage } from 'firebase/storage';

const Stack = createNativeStackNavigator();

import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	disableNetwork,
	enableNetwork,
} from 'firebase/firestore';

import { useNetInfo } from '@react-native-community/netinfo';

import Start from './components/Start';
import Chat from './components/Chat';

const App = () => {
	// Your web app's Firebase configuration
	const firebaseConfig = {
		apiKey: 'AIzaSyCFaqz9YbgRD0pEQVQ668c0g4MGXEh7MXM',
		authDomain: 'chatt-app-920b4.firebaseapp.com',
		projectId: 'chatt-app-920b4',
		storageBucket: 'chatt-app-920b4.firebasestorage.app',
		messagingSenderId: '769531865032',
		appId: '1:769531865032:web:8f7de6b311b0814de5c2fd',
	};

	// Initialize Firebase
	const app = initializeApp(firebaseConfig);
	const storage = getStorage(app);

	// Initialize Cloud Firestore and get a reference to the service
	const db = getFirestore(app);

	const connectionStatus = useNetInfo();
	useEffect(() => {
		if (connectionStatus.isConnected === false) {
			Alert.alert('Connection Lost!');
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
				<Stack.Screen name="Chat">
					{(props) => (
						<Chat
							isConnected={connectionStatus.isConnected}
							db={db}
							storage={storage}
							{...props}
						/>
					)}
				</Stack.Screen>
			</Stack.Navigator>
		</NavigationContainer>
	);
};

export default App;
