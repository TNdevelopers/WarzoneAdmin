import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, Image, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { createStaackNavigator, ThemeColors } from 'react-navigation';
import Theme from '../assets/theme'
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

export default class App extends React.Component {
    static navigationOptions = {
        headerTitleStyle: { color: Theme.PRIMARY },
        title: "Finished game",
    }

    familyData = [{
        title: 'Hello'
    }, { title: 'oii' }]
    state = {
        isLoadingComplete: false,
        maindata: this.props.navigation.state.params.result,
        killsloader: false,
        youtube: 'NONE',
        total: 0
    }

    finish = (data) => {
        console.log(data)
        fetch('https://fruitionsoft.tech/warzone/matchupdate.php', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: data,
                youtube: this.state.youtube
            })
        })
            .then(response => response.json())
            .then(responseJson => {
                console.log(responseJson)
                global.refresher = 'Yes';
                this.props.navigation.navigate('Home')
            })
            .catch(error => console.log(error))
    }

    calculatefunction = () => {
        var result = this.state.maindata;
        var killamount = this.props.navigation.state.params.killamount;
        var dummynum = this.state.total;
        for (var i = 0; i < result.length; i++) {
            dummynum += parseInt(result[i].kills * killamount);
        }
        console.log(dummynum)
        this.setState({
            total: dummynum
        })
    }


    render() {
        var mainData = this.props.navigation.state.params.result;
        var killamount = this.props.navigation.state.params.killamount;

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.maindata}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={{ flex: 1, marginVertical: 5 }}>
                            <View elevation={3} style={styles.cardContainer}>
                                <View style={[styles.cardContainer, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                                    <View style={styles.amountContainer}>
                                        <Text style={[styles.cardamount]}>{item.name}</Text>
                                    </View>

                                    <TextInput
                                        style={{ width: Dimensions.get('screen').width / 7, height: 35, borderWidth: 0.5, borderRadius: 5, paddingLeft: 5, marginVertical: 5 }}
                                        placeholder="Kills"
                                        onChangeText={data => {
                                            if (data) {
                                                this.setState({ killsloader: true })
                                                var mainData1 = mainData;
                                                for (var i = 0; i < mainData1.length; i++) {
                                                    if (item.id === mainData1[i].id) {
                                                        mainData1[i].kills = data;

                                                        this.setState({
                                                            mainData: mainData1,
                                                            killsloader: false
                                                        })
                                                    }
                                                }
                                                this.setState({
                                                    mainData: mainData
                                                })
                                                console.log(mainData1)
                                            }
                                        }}
                                    />

                                    <TextInput
                                        style={{ width: Dimensions.get('screen').width / 7, height: 35, borderWidth: 0.5, borderRadius: 5, paddingLeft: 5, marginVertical: 5 }}
                                        placeholder="Price"
                                        onChangeText={data => {
                                            if (data) {
                                                this.setState({ killsloader: true })
                                                var mainData1 = mainData;
                                                for (var i = 0; i < mainData1.length; i++) {
                                                    if (item.id === mainData1[i].id) {
                                                        mainData1[i].winamount = data;

                                                        this.setState({
                                                            mainData: mainData1,
                                                            killsloader: false
                                                        })
                                                    }
                                                }
                                                this.setState({
                                                    mainData: mainData
                                                })
                                                console.log(mainData1)
                                            }
                                        }}
                                    />

                                </View>

                            </View>
                        </View>
                    )}
                />

                <TextInput
                    style={{ width: Dimensions.get('screen').width /1.8, height: 35, borderWidth: 0.5, borderRadius: 5, paddingLeft: 5, marginVertical: 5,alignSelf:'center' }}
                    placeholder="Youtube link"
                    onChangeText={data => this.setState({youtube: data})} />

                <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>Total: Rs.{this.state.total}</Text>
                <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={this.calculatefunction} style={styles.bottombuttonadd}>
                        <Icon name="edit" color="#FFFF" size={20} />
                        <Text style={styles.cardtext}>Calculate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        var mainData1 = this.state.maindata;
                        var result = [];
                        result.length = 0;
                        for (var i = 0; i < mainData1.length; i++) {
                            if (mainData1[i].kills > 0) {
                                result.push({ kills: mainData1[i].kills, id: mainData1[i].id, mid: mainData1[i].mid, cid: mainData1[i].cid, amount: parseInt(mainData1[i].kills * killamount) + parseInt(mainData1[i].winamount) })
                            }
                        }
                        this.finish(result);
                    }} style={styles.bottombuttonadd}>
                        <Icon name="edit" color="#FFFF" size={20} />
                        <Text style={styles.cardtext}>Update</Text>
                    </TouchableOpacity>
                </View>
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
        overflow: 'hidden',
        marginBottom: 3
    },
    heading: {
        fontWeight: 'bold',
        padding: 5,
        marginLeft: '5%',
        fontSize: 20
    },
    amountContainer: {
        width: '60%',
    },
    cardheading: {
        fontSize: 14,
        textAlign: 'center',
        padding: 5
    },
    cardamount: {
        fontSize: 16,
        fontWeight: 'bold',
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
        marginHorizontal: 5
    }
})