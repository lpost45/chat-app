import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, GiftedChat } from 'react-native-gifted-chat';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InputToolbar } from 'react-native-gifted-chat';

const Chat = ({ db, route, navigation, isConnected }) => {
	const [messages, setMessages] = useState([]);
	const { name, background, userID } = route.params;

	let unsubMessages;
	useEffect(() => {
		navigation.setOptions({ title: name, color: background });
		if (isConnected === true) {
			const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
			unsubMessages = onSnapshot(q, (docs) => {
				let newMessages = [];
				docs.forEach(doc => {
					newMessages.push({
					id: doc.id,
					...doc.data(),
					createdAt: new Date(doc.data().createdAt.toMillis())
					})
				})
				cacheMessages(newMessages);
				setMessages(newMessages);
			})
		} else loadCachedeMessages();

		return () => {
			if (unsubMessages) unsubMessages();
		}
	}, [isConnected]);

	const onSend = (newMessages) => {
		addDoc(collection(db, "messages"), newMessages[0])
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

	return (
		<View style={styles.container}>
			<GiftedChat
				messages={messages}
				renderBubble={renderBubble}
				onSend={(messages) => onSend(messages)}
				renderInputToolbar={renderInputToolbar}
				user={{
					_id: userID,
					name: name
				}}
			/>
			{Platform.OS === 'android' ? (
				<KeyboardAvoidingView behavior="height" />
			) : null}
			{Platform.OS === "ios" ? <KeyboardAvoidingView behavior="padding" /> : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
});

export default Chat;
