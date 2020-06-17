import React from 'react';
import { TextInput } from 'react-native';

export default class App extends React.Component {

    render() {
        return (
            <TextInput 
            style={styles.input}
            onChangeText={(data)}
            />
        );
    }
}


const styles = StyleSheet.create({
    
})