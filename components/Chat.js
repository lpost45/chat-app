import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import {
	collection,
	addDoc,
	onSnapshot,
	query,
	orderBy,
} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InputToolbar } from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ db, route, navigation, isConnected, storage }) => {
	const [messages, setMessages] = useState([]);
	const { name, background, userID } = route.params;

	let unsubMessages;
	useEffect(() => {
		navigation.setOptions({ title: name, color: background });
		if (isConnected === true) {
			const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
			unsubMessages = onSnapshot(q, (docs) => {
				let newMessages = [];
				docs.forEach((doc) => {
					newMessages.push({
						id: doc.id,
						...doc.data(),
						createdAt: new Date(doc.data().createdAt.toMillis()),
					});
				});
				cacheMessages(newMessages);
				setMessages(newMessages);
			});
		} else loadCachedeMessages();

		return () => {
			if (unsubMessages) unsubMessages();
		};
	}, [isConnected]);

	const onSend = (newMessages) => {
		addDoc(collection(db, 'messages'), newMessages[0]);
	};

	const cacheMessages = async (messagesToCache) => {
		try {
			await AsyncStorage.setItem('messages', JSON.stringify(messagesToCache));
		} catch (error) {
			console.log(error.message);
		}
	};

	const loadCachedeMessages = async () => {
		try {
			const cachedMessages = await AsyncStorage.getItem('messages');
			if (cachedMessages) {
				setMessages(JSON.parse(cachedMessages));
			}
		} catch (error) {
			console.log(error.message);
		}
	};

	const renderInputToolbar = (props) => {
		if (isConnected) return <InputToolbar {...props} />;
		else return null;
	};

	const renderBubble = (props) => {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: '#000',
					},
					left: {
						backgroundColor: '#FFF',
					},
				}}
			/>
		);
	};

	const renderCustomActions = (props) => {
		return (
			<CustomActions
				wrapperStyle={{}}
				iconTextStyle={{}}
				storage={storage}
				onSend={(message) => console.log('Message sent:', message)}
				userID={userID}
			/>
		);
	};

	const renderCustomView = (props) => {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
					region={{
						latitude: currentMessage.location.latitude,
						longitude: currentMessage.location.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	};

	return (
		<View style={styles.container}>
			<GiftedChat
				messages={messages}
				renderBubble={renderBubble}
				onSend={(messages) => onSend(messages)}
				renderInputToolbar={renderInputToolbar}
				renderActions={renderCustomActions}
				renderCustomView={renderCustomView}
				user={{
					_id: userID,
					name: name,
				}}
			/>
			{Platform.OS === 'android' ? (
				<KeyboardAvoidingView behavior="height" />
			) : null}
			{Platform.OS === 'ios' ? (
				<KeyboardAvoidingView behavior="height" />
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default Chat;
