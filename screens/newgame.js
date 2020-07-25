import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Switch, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { createStaackNavigator, ThemeColors } from 'react-navigation';
import Theme from '../assets/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import getUserFunction from '../functions/user';
import DatePicker from 'react-native-datepicker';
import TimePicker from 'react-native-simple-time-picker';

export default class App extends React.Component {
    static navigationOptions = {
        headerTitleStyle: { color: Theme.PRIMARY },
        title: "New game",
    }

    constructor(props) {
        super(props);
        this.state = {
            search: null,
            loading: false,
            buttonloader: false,

            title: null,
            description: null,
            date: null,
            time: null,
            map: null,
            prize: null,
            fees: null,
            players: null,
            image: null,
            perkill: null,
            type: null,
            am: 'am',
            amvalue: false
        }
    }

    submitFunction = () => {
        if (this.state.title === null) {
            alert('Please enter title')
        }
        else if (this.state.description === null) {
            alert('Please enter description')
        } else if (this.state.date === null) {
            alert('Please enter date')
        } else if (this.state.time === null) {
            alert('Please enter time')
        } else if (this.state.map === null) {
            alert('Please enter map')
        } else if (this.state.type === null) {
            alert('Please enter match type')
        } else if (this.state.prize === null) {
            alert('Please enter prize')
        } else if (this.state.fees === null) {
            alert('Please enter entry fees')
        } else if (this.state.players === null) {
            alert('Please enter no. of players')
        } else if (this.state.image === null) {
            alert('Please enter image link')
        } else if (this.state.per_kill === null) {
            alert('Please enter kill')
        }
        else {
            this.setState({buttonloader:true})
            fetch('https://fruitionsoft.tech/warzone/admintournamentadd.php', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: this.state.title,
                    description: this.state.description,
                    date: this.state.date,
                    time: this.state.time,
                    image: this.state.image,
                    type: 'FreeFire',//.....
                    map: this.state.map,
                    match_type: this.state.type,//.....
                    fees: this.state.fees,
                    price: this.state.prize,
                    per_kill: this.state.perkill,
                    total_join_limit: this.state.players,
                })
            })
                .then(response => response.json())
                .then(responseJson => {
                    console.log(responseJson)
                    if (responseJson === 'ok') {
                        this.setState({buttonloader:false})
                        alert('Match created successfully.');
                        global.refresher = 'Yes';
                        this.props.navigation.goBack(null);
                    } else {
                        this.setState({buttonloader:false})
                        alert('oops! something went wrong')
                    }
                })
                .catch(error => console.log(error))
        }
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <TextInput style={styles.input}
                    placeholder="Title"
                    onChangeText={data => this.setState({ title: data })} />
                <TextInput style={[styles.input, { height: 75 }]}
                    multiline={true}
                    placeholder="Description"
                    onChangeText={data => this.setState({ description: data })} />
                <DatePicker
                    style={styles.input}
                    date={this.state.date}
                    mode="date"
                    placeholder="Tournament date"
                    format="YYYY-MM-DD"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                        // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => { this.setState({ date: date }) }}
                />
                <View style={{ paddingVertical: 5, width: '90%', alignSelf: 'center' }}>
                    <Text>Select {this.state.am}</Text>
                    <Switch
                        onValueChange={() => {
                            if (this.state.am === 'am') {
                                this.setState({
                                    am: 'pm',
                                    amvalue: !this.state.amvalue
                                })
                            } else {
                                this.setState({
                                    am: 'am',
                                    amvalue: !this.state.amvalue
                                })
                            }
                        }}
                        value={this.state.amvalue} />
                    <TimePicker
                        selectedHours="00"
                        //initial Hourse value
                        selectedMinutes="00"
                        //initial Minutes value
                        onChange={(hours, minutes) => this.setState({
                            time: hours + ':' + minutes + ' ' + this.state.am
                        })}
                    />
                </View>

                <TextInput style={styles.input}
                    placeholder="Map"
                    onChangeText={data => this.setState({ map: data })} />
                <TextInput style={styles.input}
                    placeholder="Match Type"
                    onChangeText={data => this.setState({ type: data })} />
                <TextInput style={styles.input}
                    placeholder="Win Prize"
                    keyboardType='decimal-pad'
                    onChangeText={data => this.setState({ prize: data })} />
                <TextInput style={styles.input}
                    placeholder="Entry Fees"
                    keyboardType='decimal-pad'
                    onChangeText={data => this.setState({ fees: data })} />
                <TextInput style={styles.input}
                    placeholder="No. of players"
                    keyboardType='decimal-pad'
                    onChangeText={data => this.setState({ players: data })} />
                <TextInput style={styles.input}
                    placeholder="Image link"
                    onChangeText={data => this.setState({ image: data })} />
                <TextInput style={styles.input}
                    placeholder="Amount per kill"
                    keyboardType='decimal-pad'
                    onChangeText={data => this.setState({ perkill: data })} />
                {this.state.buttonloader === true ? (
                    <TouchableOpacity style={styles.bottombuttonadd}>
                        <ActivityIndicator color="#FFFF" size="small" />
                    </TouchableOpacity>
                ) : (
                        <TouchableOpacity onPress={this.submitFunction} style={styles.bottombuttonadd}>
                            <Text style={styles.cardtext}>Submit</Text>
                        </TouchableOpacity>
                    )}
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