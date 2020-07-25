import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { createStaackNavigator, ThemeColors } from 'react-navigation';
import Theme from '../assets/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import getUserFunction from '../functions/user';
import tournamentFunction from '../functions/tournament';
import transactions from '../functions/transactions';
import payout from '../functions/payout';
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-gesture-handler';

export default class App extends React.Component {
    state = {
        isLoadingComplete: false,
        users: null,
        loading: true,
        smsbalance: 0,
        securityvisible: false,
        passcode: null,
        finishpwd: null,
        logincode: null,
        loginVisible: true,
        loginpwd: null
    }

    static navigationOptions = {
        headerTitleStyle: { color: Theme.PRIMARY, flex: 1, textAlign: 'center' },
        title: "Warzone Admin",
        headerRight: (<Text>{global.smsbalance}</Text>)
    }


    componentDidMount() {
        this.getter();
    }

    getter = () => {
        var dummy = data => console.log('Dummy')
        tournamentFunction(dummy)
        transactions()
        payout();
        var setdata = (user) => this.setState({ users: user })
        var data = setdata.bind(this);
        getUserFunction(data)
        this.loadingChecker()
        this.refresher();
        this.getsmsFunction();
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
                    var balance = responseJson[0].sms
                    global.smsbalance = responseJson[0].sms
                    this.setState({
                        smsbalance: parseInt(balance),
                        finishpwd: responseJson[0].finish,
                        loginpwd: responseJson[0].password
                    })
                }
            })
            .catch(error => {
                console.log(error)
            })
    }

    refresher = () => {
        setInterval(() => {
            if (global.refresher === 'Yes') {
                global.refresher = 'No';
                this.getter();
            }
        }, 5000)
    }


    loadingChecker = () => {
        var data = global.users;
        setTimeout(() => {
            if (data) {
                console.log('runnig')
                this.setState({ loading: false })
                return 0;
            } else {
                this.loadingChecker()
            }
        }, 1000)
    }

    verifyFinish = () => {
        if (this.state.passcode === this.state.finishpwd) {
            this.setState({ securityvisible: false })
            this.props.navigation.navigate('Finished')
        } else {
            alert('Invalid password');
            this.setState({ securityvisible: false })
        }
    }

    loginFunction = () => {
        if (this.state.logincode === this.state.loginpwd) {
            this.setState({ loginVisible: false })
        } else {
            alert('Invalid password');
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
            <View style={styles.container}>
                <StatusBar backgroundColor={"#FFFF"} barStyle="dark-content" />

                <View style={{ width: '95%', alignSelf: 'center', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginRight: '5%', marginTop: 8 }}>
                    <Text style={styles.heading}>SMS Balance: {this.state.smsbalance}</Text>
                    <TouchableOpacity onPress={this.getter}>
                        <Icon name='refresh' size={15} style={{ marginHorizontal: 10 }} />
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
                    {/* this.props.navigation.navigate('Finished') */}
                    <TouchableOpacity onPress={() => this.setState({ securityvisible: true })} elevation={3} style={styles.bottombutton}>
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

                <Modal
                    isVisible={this.state.securityvisible}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: '90%', padding: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFF' }}>
                            <Text style={styles.heading}>Enter Security Code</Text>
                            <TextInput
                                placeholder="Password"
                                securityvisible={true}
                                keyboardType="number-pad"
                                style={{ width: '90%', borderRadius: 5, margin: 5, paddingLeft: 8, textAlign: 'center', borderBottomWidth: 1, marginVertical: 20 }}
                                onChangeText={data => this.setState({ passcode: data })} />
                            <TouchableOpacity onPress={this.verifyFinish} style={styles.bottombuttonfinish}>
                                <Icon name="plus" color="#FFFF" size={20} />
                                <Text style={styles.cardtext}>Verify</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => this.setState({ securityvisible: false })} style={styles.bottombuttonfinish}>
                                <Icon name="plus" color="#FFFF" size={20} />
                                <Text style={styles.cardtext}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    isVisible={this.state.loginVisible}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: '90%', padding: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFF' }}>
                            <Text style={styles.heading}>Enter Security Code</Text>
                            <TextInput
                                placeholder="Security Code"
                                securityvisible={true}
                                keyboardType="number-pad"
                                style={{ width: '90%', borderRadius: 5, margin: 5, paddingLeft: 8, textAlign: 'center', borderBottomWidth: 1, marginVertical: 20 }}
                                onChangeText={data => this.setState({ logincode: data })} />
                            {this.state.logincode != null ? (
                                <TouchableOpacity onPress={this.loginFunction} style={styles.bottombuttonfinish}>
                                    <Icon name="plus" color="#FFFF" size={20} />
                                    <Text style={styles.cardtext}>SUBMIT</Text>
                                </TouchableOpacity>
                            ) : null}
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15,
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
    },
    bottombuttonfinish: {
        width: '50%',
        height: 40,
        backgroundColor: Theme.PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        borderRadius: 20,
        margin: 5
    },
    GridViewBlockStyle: {
        width: '90%',
        margin: 5,
        backgroundColor: '#ffffff',
        elevation: 5,
        paddingBottom: 10,
        borderRadius: 10,
        alignSelf: 'center'
    },
})