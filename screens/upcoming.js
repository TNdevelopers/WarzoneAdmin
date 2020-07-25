import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Image, FlatList, Alert, TextInput } from 'react-native';
import { createStaackNavigator, ThemeColors } from 'react-navigation';
import Theme from '../assets/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import getUserFunction from '../functions/user';
import tournamentFunction from '../functions/tournament';
import moment from 'moment';
import Modal from 'react-native-modal';

export default class App extends React.Component {
    static navigationOptions = {
        headerTitleStyle: { color: Theme.PRIMARY },
        title: "Upcoming game",
    }

    familyData = [{
        title: 'Hello'
    }, { title: 'oii' }]
    state = {
        isLoadingComplete: false,
        loading: false,
        users: global.users,
        players: null,

        securityvisible: false,
        room: null,
        pwd: null,
        id: null,
        playerssms: [],

        liveloader: false,
        removeloader: false,
        roomloader: false
    }


    getPlayers = (data, fees) => {
        fetch("https://fruitionsoft.tech/warzone/players.php", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mid: data,
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                var dummy = [];
                dummy.length = 0;
                for (var i = 0; i < responseJson.length; i++) {
                    var cid = responseJson[i].cid;
                    var result = this.state.users.filter(x => x.id === cid);
                    dummy.push({ id: result[0].id, wallet: parseInt(result[0].wallet) + parseInt(fees) })
                }
                console.log(dummy)
                this.setState({ players: dummy })
                this.startremove(data, fees)
            })
            .catch(err => {
                console.log(err)
            })
    }

    startremove = (id, fees) => {
        Alert.alert('Warzone', 'Are you sure want to remove this match.', [
            { text: 'Yes', onPress: () => this.removeFunction(id, fees) },
            { text: 'Cancel' }
        ])
    }

    removeFunction = (data, fees) => {
        this.setState({ loading: true, removeloader: true })
        fetch('https://fruitionsoft.tech/warzone/admintournamentdelete.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data,
                player: this.state.players
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson === 'ok') {
                    alert('Match removed...')
                    var setdata = (user) => this.setState({ loading: false, removeloader: false })
                    var data = setdata.bind(this);
                    tournamentFunction(data)
                } else {
                    alert('Server error.')
                    var setdata = (user) => this.setState({ loading: false, removeloader: false })
                }
            })
            .catch(error => console.log(error))
    }

    golive = (data) => {
        this.setState({ loading: true, liveloader: true })
        fetch('https://fruitionsoft.tech/warzone/golive.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: data,
                status: 'Ongoing'
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson)
                if (responseJson === 'ok') {
                    alert('Moved to live now')
                    var setdata = (user) => this.setState({ loading: false, liveloader: false })
                    var data = setdata.bind(this);
                    tournamentFunction(data)
                } else {
                    alert('Server error.')
                    var setdata = (user) => this.setState({ loading: false, liveloader: false })
                }
            })
            .catch(error => console.log(error))
    }

    updateroom = () => {
        this.setState({ roomloader: true })
        this.getPlayersforsms()
        fetch("https://fruitionsoft.tech/warzone/addroom.php", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomid: this.state.room,
                id: this.state.id,
                pwd: this.state.pwd
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson === 'success') {
                    alert('Room id added successfully.')
                    this.setState({ securityvisible: false, roomloader: false })
                } else {
                    alert('oops! something went wrong')
                    this.setState({ securityvisible: false, roomloader: false })
                }
            })
            .catch(err => {
                console.log(err)
            })
    }


    getPlayersforsms = () => {
        fetch("https://fruitionsoft.tech/warzone/players.php", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mid: this.state.id,
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                var dummy = [];
                dummy.length = 0;
                for (var i = 0; i < responseJson.length; i++) {
                    var cid = responseJson[i].cid;
                    var result = this.state.users.filter(x => x.id === cid);
                    dummy.push(result[0].mobile)
                }
                this.setState({ playerssms: dummy }, function () {
                    this.sendsms()
                })
            })
            .catch(err => {
                console.log(err)
            })
    }

    sendsms = () => {
        fetch("https://fruitionsoft.tech/warzone/sendsms.php", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                datas: this.state.playerssms,
                id: this.state.room,
                pwd: this.state.pwd
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson)
            })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        if (this.state.loading === true) {
            return (
                <View style={{ flex: 1, justifyContent: 'center' }}>
                    <ActivityIndicator color='black' size='large' />
                </View>
            )
        }
        var mainData = global.upcoming.filter(x => x.date > moment().format('YYYY-MM-DD') || x.date === moment().format('YYYY-MM-DD'))
        return (
            <View style={styles.container}>
                <FlatList
                    data={global.upcoming}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, marginBottom: 30, marginTop: 10 }}>
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
                                <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    {this.state.removeloader === true ? (
                                        <TouchableOpacity style={styles.bottombuttonadd}>
                                            <ActivityIndicator size="small" color="#FFFF" />
                                        </TouchableOpacity>
                                    ) : (
                                            <TouchableOpacity onPress={this.getPlayers.bind(this, item.id, item.fees)} style={styles.bottombuttonadd}>
                                                <Icon name="edit" color="#FFFF" size={20} />
                                                <Text style={styles.cardtext}> Remove</Text>
                                            </TouchableOpacity>
                                        )}
                                    {this.state.liveloader === true ? (
                                        <TouchableOpacity style={styles.bottombuttonadd}>
                                            <ActivityIndicator size="small" color="#FFFF" />
                                        </TouchableOpacity>
                                    ) : (
                                            <TouchableOpacity onPress={this.golive.bind(this, item.id)} style={styles.bottombuttonadd}>
                                                <Icon name="building" color="#FFFF" size={20} />
                                                <Text style={styles.cardtext}> Go live</Text>
                                            </TouchableOpacity>
                                        )}
                                </View>
                                <TouchableOpacity onPress={() => this.setState({ securityvisible: true, id: item.id })} style={{ backgroundColor: 'red', padding: 5, position: 'absolute', top: 10, right: 10 }}>
                                    <Icon name="edit" color="yellow" size={20} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />
                <Modal
                    isVisible={this.state.securityvisible}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ width: '90%', padding: 5, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFF' }}>
                            <Text style={styles.heading}>Enter Room id</Text>
                            <TextInput
                                placeholder="Room id here"
                                style={{ width: '90%', borderRadius: 5, margin: 5, paddingLeft: 8, textAlign: 'center', borderBottomWidth: 1, marginVertical: 20 }}
                                onChangeText={data => this.setState({ room: data })} />
                            <Text style={styles.heading}>Enter Password</Text>
                            <TextInput
                                placeholder="Password here"
                                style={{ width: '90%', borderRadius: 5, margin: 5, paddingLeft: 8, textAlign: 'center', borderBottomWidth: 1, marginVertical: 20 }}
                                onChangeText={data => this.setState({ pwd: data })} />

                            {this.state.roomloader === true ? (
                                <TouchableOpacity style={styles.bottombuttonadd}>
                                    <ActivityIndicator size="small" color="#FFFF" />
                                </TouchableOpacity>
                            ) : (
                                    <TouchableOpacity onPress={this.updateroom} style={styles.bottombuttonfinish}>
                                        <Icon name="plus" color="#FFFF" size={20} />
                                        <Text style={styles.cardtext}>Submit</Text>
                                    </TouchableOpacity>
                                )}
                            <TouchableOpacity onPress={() => this.setState({ securityvisible: false })} style={styles.bottombuttonfinish}>
                                <Icon name="plus" color="#FFFF" size={20} />
                                <Text style={styles.cardtext}>Cancel</Text>
                            </TouchableOpacity>
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
        width: '45%',
        height: 40,
        backgroundColor: Theme.PRIMARY,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        alignSelf: 'center',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        marginHorizontal: 3
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
})