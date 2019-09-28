import React from 'react';
import { Alert } from 'react-native';

const showAlert = () => {
    Alert.alert(
        'Alert Box Title',
        'Alert Message',
        [
            {
                text: 'Remind Me Later', 
                onPress: () => console.log('Remind Me')
            },
            {
                text: 'Ok',
                onPress: () => console.log('Message Received')
            },
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel')
            }
        ]
    )
}

export default showAlert;