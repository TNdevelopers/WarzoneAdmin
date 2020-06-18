import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, AsyncStorage, StatusBar, ActivityIndicator } from 'react-native';
import { createStaackNavigator, ThemeColors } from 'react-navigation';
import Theme from '../assets/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import getUserFunction from '../functions/user';
import tournamentFunction from '../functions/tournament';

export default class App extends React.Component {
    static navigationOptions = {
        headerTitleStyle: { color: Theme.PRIMARY, flex: 1, textAlign: 'center' },
        title: "Warzone Admin",
    }
    state = {
        isLoadingComplete: false,
        users: null,
        loading: true
    }

    componentDidMount() {
        this.getter()
    }

    getter = () => {
        var setdata = (user) => this.setState({ users: user })
        var data = setdata.bind(this);
        getUserFunction(data)
        var dummy = data => console.log('Dummy')
        tournamentFunction(dummy)
        this.loadingChecker()
        this.refresher()
    }

    refresher = () => {
        setInterval(() => {
            if (global.refresher === 'Yes') {
                global.refresher = 'No';
                this.getter();
            }
        }, 3000)
    }

    loadingChecker = () => {
        var data = global.users;
        setTimeout(() => {
            if (data) {
                this.setState({ loading: false })
            } else {
                this.loadingChecker()
            }
        }, 1000)
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
            <View style={styles.container}>
                <StatusBar backgroundColor={"#FFFF"} barStyle="dark-content" />
                <Text style={styles.heading}>Admin Dashboard</Text>
                <View elevation={3} style={styles.cardContainer}>
                    <View style={styles.amountContainer}>
                        <Text style={styles.cardheading}>Total Income</Text>
                        <Text style={[styles.cardamount, { color: Theme.PRIMARY }]}>Rs.25000</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={styles.cardheading}>Total Expense</Text>
                        <Text style={styles.cardamount}>Rs.10000</Text>
                    </View>
                    <View style={styles.amountContainer}>
                        <Text style={styles.cardheading}>Total Balance</Text>
                        <Text style={styles.cardamount}>Rs.15000</Text>
                    </View>
                </View>
                <View style={{ width: '95%', alignSelf:'center', flexDirection: 'row', justifyContent: 'space-between',alignItems:'center',marginRight:'5%', marginTop:8 }}>
                    <Text style={styles.heading}>More options</Text>
                    <TouchableOpacity onPress={this.getter}>
                    <Text style={{color:'lightgray',fontSize:10}}>Refresh now</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomcard}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Ongoing')} elevation={3} style={styles.bottombutton}>
                        <Icon name="dashboard" color="#ee5253" size={35} />
                        <Text style={styles.cardtext}>Ongoing</Text>
                        <Text style={styles.cardnumber}>{global.ongoing.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Upcoming')} elevation={3} style={styles.bottombutton}>
                        <Icon name="bullseye" color="#5f27cd" size={35} />
                        <Text style={styles.cardtext}>Upcoming</Text>
                        <Text style={styles.cardnumber}>{global.upcoming.length}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomcard}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Finished')} elevation={3} style={styles.bottombutton}>
                        <Icon name="random" color="#01a3a4" size={35} />
                        <Text style={styles.cardtext}>Finished</Text>
                        <Text style={styles.cardnumber}>{global.finished.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Users')} elevation={3} style={styles.bottombutton}>
                        <Icon name="users" color="#ff9f43" size={35} />
                        <Text style={styles.cardtext}>Users</Text>
                        {this.state.users ? (
                            <Text style={styles.cardnumber}>{this.state.users.length}</Text>
                        ) : (
                                <Text style={styles.cardnumber}>0</Text>
                            )}
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => this.props.navigation.navigate('Newgame')} style={styles.bottombuttonadd}>
                    <Icon name="plus" color="#FFFF" size={20} />
                    <Text style={styles.cardtext}> New Match</Text>
                </TouchableOpacity>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
        paddingBottom: 5
    },
    cardContainer: {
        width: '90%',
        backgroundColor: Theme.BLACK,
        borderRadius: 10,
        alignSelf: 'center',
        padding: 5,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
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
        color: '#FFFF',
        fontSize: 14,
        textAlign: 'center',
        padding: 5
    },
    cardamount: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#FFFF',
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
        position: 'absolute',
        bottom: 0
    }
})