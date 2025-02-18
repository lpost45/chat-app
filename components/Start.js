import React, { useState } from 'react';
import {
	StyleSheet,
	View,
	Text,
	TextInput,
	ImageBackground,
	TouchableOpacity,
	Alert,
} from 'react-native';
import { getAuth, signInAnonymously } from 'firebase/auth';

const Start = ({ navigation }) => {
	const [name, setName] = useState('');
	const [backgroundColor, setBackgroundColor] = useState('#090C08');

	const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE'];

	const auth = getAuth
	const signInUser = () => {
		signInAnonymously(auth)
			.then(result => {
				navigation.navigate("Chat", {userID: result.user.uid, name: name, backgroundColor: backgroundColor });
				Alert.alert("Signed in Successfully!");
			})
			.catch((error) => {
				Alert.alert("Unable to sign in, try again later.")
			})
	}

	return (
		<View style={styles.container}>
			<ImageBackground
				source={require('../assets/BackgroundImage.png')}
				style={styles.background}
			>
				<Text style={styles.title}>Let's Chat!</Text>
				<View style={styles.contentContainer}>
					<TextInput
						style={styles.textInput}
						value={name}
						onChangeText={setName}
						placeholder="Type your username here"
					/>
					<Text style={styles.chooseColor}>Choose Background Color:</Text>
					<View style={styles.colorContainer}>
						{colors.map((color) => {
							return (
								<TouchableOpacity
									key={color}
									style={[
										styles.bgColorOptions,
										{ backgroundColor: color },
										backgroundColor === color && styles.selectedColor,
									]}
									onPress={() => setBackgroundColor(color)}
								/>
							);
						})}
					</View>
					<TouchableOpacity
						style={styles.chatButton}
						onPress={signInUser}
					>
						<Text style={styles.chatButtonText}>Start Chatting!</Text>
					</TouchableOpacity>
				</View>
			</ImageBackground>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	textInput: {
		width: '88%',
		padding: 15,
		borderWidth: 1,
		marginTop: 15,
		marginBottom: 15,
		fontSize: 16,
		fontWeight: '300',
		opacity: 50,
	},
	background: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		height: '100%',
		width: '100%',
	},
	contentContainer: {
		backgroundColor: '#f2f2f2',
		width: '88%',
		height: '50%',
		alignItems: 'center',
		justifyContent: 'space-around',
	},
	title: {
		fontSize: 45,
		fontWeight: '600',
		color: '#FFFFFF',
		margin: 25,
	},
	chooseColor: {
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		opacity: 100,
	},
	colorContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '80%',
		marginBottom: 20,
	},
	bgColorOptions: {
		width: 50,
		height: 50,
		borderRadius: 25,
		margin: 5,
	},
	selectedColor: {
		borderColor: '#c0c0c0',
		borderWidth: 1,
	},
	chatButton: {
		alignItems: 'center',
		backgroundColor: '#757083',
		borderRadius: 4,
		height: '20%',
		justifyContent: 'center',
		padding: 10,
		width: '88%',
	},
	chatButtonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#FFFFFF',
	},
});

export default Start;
