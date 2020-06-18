import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, AsyncStorage, Image, FlatList } from 'react-native';
import { createStaackNavigator, ThemeColors } from 'react-navigation';
import Theme from '../assets/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import getUserFunction from '../functions/user';

export default class App extends React.Component {
    static navigationOptions = {
        headerTitleStyle: { color: Theme.PRIMARY },
        title: "Ongoing game",
    }

    familyData = [{
        title: 'Hello'
    }, { title: 'oii' }]
    state = {
        isLoadingComplete: false,
    }

    finish = (data) => {
        this.setState({ loading: true })
        fetch('http://tndevelopersbackend.000webhostapp.com/warzone/golive.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data,
                status: 'Finished'
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson)
                if (responseJson === 'ok') {
                    alert('Moved to live now')
                    var setdata = (user) => this.setState({ loading: false })
                    var data = setdata.bind(this);
                    tournamentFunction(data)
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
                <FlatList
                    data={global.ongoing}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, marginBottom: 30,marginTop:10 }}>
                            <View elevation={3} style={styles.cardContainer}>
                                <Image resizeMode='contain' source={{ uri: item.image }} style={{ width: '100%', height: 200 }} />
                                <View style={styles.descriptionContainer}>
                                    <Text size={14} style={styles.heading}>{item.title}</Text>
                                </View>

                                <View style={[styles.cardContainer, { flexDirection: 'row' }]}>
                                    <View style={styles.amountContainer}>
                                        <Text style={styles.cardheading}>Entry Fees</Text>
                                        <Text style={[styles.cardamount]}>Rs.{item.fees}</Text>
                                    </View>
                                    <View style={styles.amountContainer}>
                                        <Text style={styles.cardheading}>Per Kill</Text>
                                        <Text style={styles.cardamount}>Rs.{item.per_kill}</Text>
                                    </View>
                                    <View style={styles.amountContainer}>
                                        <Text style={styles.cardheading}>Prize</Text>
                                        <Text style={styles.cardamount}>Rs.{item.price}</Text>
                                    </View>
                                </View>


                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '90%', height: 75, marginBottom: 5 }}>
                                    <View style={styles.amountContainer}>
                                        <Text style={styles.cardheading}>Date</Text>
                                        <Text style={[styles.cardamount]}>{item.date}</Text>
                                    </View>
                                    <View style={styles.amountContainer}>
                                        <Text style={styles.cardheading}>Time</Text>
                                        <Text style={styles.cardamount}>{item.time}</Text>
                                    </View>
                                </View>

                            <TouchableOpacity style={styles.bottombuttonadd}>
                                        <Icon name="edit" color="#FFFF" size={20} />
                                        <Text style={styles.cardtext}> Finish</Text>
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
        flex: 1
    },
    cardContainer: {
        width: '90%',
        backgroundColor: '#FFFF',
        borderRadius: 10,
        alignSelf: 'center',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
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
    }
})