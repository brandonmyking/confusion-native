import React from 'react';
import { Text, ScrollView} from 'react-native';
import { Card } from 'react-native-elements';

const Contact = () => {
    return(
        <ScrollView>
            <Card title="Contact Information">
                <Text>121, Clear Water Bay Road</Text>
                <Text>Clear Water Bay, Kowloon</Text>
                <Text>HONG KONG</Text>
                <Text>Tel: +852 1234 5678</Text>
                <Text>Fax: +852 8765 4321</Text>
                <Text>Email:confusion@foot.net</Text>
            </Card>
        </ScrollView>
    );
    
};

Contact.navigationOptions ={
    title: 'Contact Us'
};

export default Contact;