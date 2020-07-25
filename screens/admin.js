import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, AsyncStorage, ScrollView, TextInput } from 'react-native';
import { createStaackNavigator, ThemeColors } from 'react-navigation';
import Theme from '../assets/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import getUserFunction from '../functions/user';
import DatePicker from 'react-native-datepicker';

export default class App extends React.Component {
    static navigationOptions = {
        headerTitleStyle: { color: Theme.PRIMARY },
        title: "New game",
    }

    constructor(props) {
        super(props);
        this.state = {
            loading: true,

            pwd: null,
            serverpwd: null
        }
    }

    getsmsFunction = () => {
        fetch('https://fruitionsoft.tech/warzone/smscontrol.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson == 'error') {
                    console.log('error')
                } else {
                    var balance = responseJson[0].password
                    this.setState({
                        serverpwd: balance,
                        loading: false
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    validator = () => {
        if(this.state.pwd === null) {
            alert('Enter password');
        }else if(this.state.password === this.state.serverpwd) {
                this.props.navigation.navigate('Home');
        }else {
            alert('Wrong Password');
        }
    }

 
    render() {
        if (this.state.loading === true) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator color='black' size='large' />
                </View>
            )
        }
        return (
            <ScrollView style={styles.container}>
                <TextInput style={styles.input}
                    placeholder="Password"
                    onChangeText={data => this.setState({ pwd: data })} />
              
                <TouchableOpacity onPress={this.validator} style={styles.bottombuttonadd}>
                    <Text style={styles.cardtext}>Submit</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15
    },
    cardContainer: {
        width: '90%',
        backgroundColor: '#FFFF',
        borderRadius: 10,
        alignSelf: 'center',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 5,
        overflow: 'hidden'
    },
    heading: {
        fontWeight: 'bold',
        padding: 5,
        marginLeft: '5%',
        fontSize: 20
    },
    amountContainer: {
        width: '33%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '30%'
    },
    cardheading: {
        fontSize: 14,
        textAlign: 'center',
        padding: 5
    },
    cardamount: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    bottomcard: {
        width: '90%',
        height: '25%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginVertical: 5,
        alignSelf: 'center'
    },
    bottombutton: {
        width: '45%',
        height: '95%',
        elevation: 3,
        backgroundColor: '#FFFF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
    },
    cardtext: {
        fontSize: 15,
        padding: 5
    },
    cardnumber: {
        fontSize: 15,
        padding: 5,
        color: '#576574'
    },
    bottombuttonadd: {
        width: '50%',
        height: 40,
        backgroundColor: Theme.PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        borderRadius: 20,
        marginVertical: 10
    },
    input: {
        width: '90%',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingLeft: 8,
        height: 40,
        alignSelf: 'center',
        marginVertical: 5
    }
})