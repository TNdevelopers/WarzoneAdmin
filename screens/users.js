import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, AsyncStorage, TextInput, FlatList } from 'react-native';
import { createStaackNavigator, ThemeColors } from 'react-navigation';
import Theme from '../assets/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import getUserFunction from '../functions/user';

export default class App extends React.Component {
    static navigationOptions = {
        headerTitleStyle: { color: Theme.PRIMARY },
        title: "Registered users",
        headerTitleAlign: 'center'
    }

    familyData = [{
        title: 'Hello'
    }, { title: 'oii' }]

    constructor(props) {
        super(props);
        this.state = {
            search: null,
            loading: false
        }
    }

    removeFunction = (data) => {
        this.setState({ loading: true })
        fetch('https://fruitionsoft.tech/warzone/adminuserdelete.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson)
                if (responseJson === 'ok') {
                    alert('User removed...')
                    var setdata = (user) => this.setState({ loading: false })
                    var data = setdata.bind(this);
                    getUserFunction(data)
                } else {
                    alert('Server error.')
                    var setdata = (user) => this.setState({ loading: false })
                }
            })
            .catch(error => console.log(error))
    }

    render() {
        return (
            <View style={styles.container}>
                {/* <TextInput style={styles.input}
                    placeholder="Search by name"
                    onChangeText={data => this.setState({ search: data })} /> */}
                <FlatList
                    data={global.users}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, marginBottom: 10 }}>
                            <View elevation={3} style={styles.cardContainer}>
                                <View style={styles.descriptionContainer}>
                                    <Text size={14} style={styles.heading}>{item.name}</Text>
                                </View>

                                <View style={[styles.cardContainer, { flexDirection: 'row' }]}>
                                    <View style={styles.amountContainer}>
                                        <Text style={styles.cardheading}>Mobile</Text>
                                        <Text style={[styles.cardheading]}>{item.mobile}</Text>
                                    </View>
                                    <View style={styles.amountContainer}>
                                        <Text style={styles.cardheading}>Email</Text>
                                        <Text style={styles.cardheading}>{item.mail}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity onPress={this.removeFunction.bind(this, item.id)} style={styles.bottombuttonadd}>
                                    <Icon name="edit" color="#FFFF" size={20} />
                                    <Text style={styles.cardtext}> Remove</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
            </View>
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
        justifyContent: 'space-between',
        marginVertical: 5,
        overflow: 'hidden',
        marginBottom: 10
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
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    input: {
        width: '90%',
        borderWidth: 1,
        borderColor: 'lightgray',
        borderRadius: 5,
        paddingLeft: 8,
        height: 40,
        alignSelf: 'center'
    }
})