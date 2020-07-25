import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { createStaackNavigator, ThemeColors } from 'react-navigation';
import Theme from '../assets/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import getUserFunction from '../functions/user';
import tournamentFunction from '../functions/tournament';
import transactions from '../functions/transactions';
import payout from '../functions/payout';

export default class App extends React.Component {

    state = {
        isLoadingComplete: false,
        users: null,
        loading: false,
        pendingData: this.props.navigation.state.params.data
    }

    // approvefunction = (amount, transid, reqid, pid, cid, balance) => {
    //     fetch('https://test.instamojo.com/api/1.1/refunds/', {
    //         method: 'POST',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //             'X-Api-Key': 'test_4d575c4539f824d0fed4c5b987b',
    //             'X-Auth-Token': 'test_d898835352cfaf0acaf9450ef43',
    //         },
    //         body: JSON.stringify({
    //             transaction_id: transid,
    //             payment_id: reqid,
    //             type: 'QFL',
    //             body: "Warzone payout",
    //             refund_amount: amount
    //         }),
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log(data.success);
    //             if(data.success === false) {
    //                 this.updatepaymentfunction(pid, cid, balance)
    //             }
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    // }

    updatepaymentfunction = (pid, cid, balance) => {
        this.setState({loading:true})
        fetch('https://fruitionsoft.tech/warzone/payoutupdate.php',{
        method:'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: pid,
            cid: cid,
            balance: balance
        }),
    })
    .then(response => response.json())
    .then(responseJson => {
        alert('Payment updated.')
        this.setState({loading:false})
       this.props.navigation.goBack(null)
    })
    .catch(error => console.log(error))
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
 
                <View>
                    <Text style={styles.heading}>New Payout Request</Text>
                    {this.state.pendingData.map((item, key) =>
                        <View>
                            <View style={styles.GridViewBlockStyle}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'left', padding: 10 }}>{item.date}</Text>
                                <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'left', paddingLeft: 10 }}>{item.name}</Text>
                                    <Text style={{ fontWeight: 'bold', textAlign: 'left', padding: 10, color: 'gray' }}>{item.mobile}</Text>
                                </View>
                                <Text style={{ fontWeight: '100', textAlign: 'left', paddingLeft: 10 }}>Request amount: Rs.{item.amount}</Text>
                                <Text style={{ fontWeight: '100', textAlign: 'left', paddingLeft: 10 }}>Payment Type: {item.type}</Text>
                                <Text style={{ fontWeight: '100', textAlign: 'left', paddingLeft: 10 }}>Wallet Id: {item.payid}</Text>

                                <TouchableOpacity onPress={this.updatepaymentfunction.bind(this, item.pid, item.cid, item.balance)} style={styles.bottombuttonadd}>
                                    <Icon name="thumbs-up" color="#FFFF" size={20} />
                                    <Text style={styles.cardtext}>COMPLETE</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </View>

            </ScrollView>
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
        marginTop: 10
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