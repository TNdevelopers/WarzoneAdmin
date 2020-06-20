import React from 'react';
import { View, AsyncStorage } from 'react-native';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import Home from './screens/home';
import Ongoing from './screens/ongoing';
import Upcoming from './screens/upcoming';
import Finished from './screens/finished';
import Users from './screens/users';
import Newgame from './screens/newgame';
import EditGame from './screens/editgame';
import Updateplayers from './screens/updateplayers';
import Payout from './screens/payoutpending';

const Navigator = createStackNavigator({
  Home: {screen: Home},
  Ongoing: {screen: Ongoing},
  Upcoming: {screen: Upcoming},
  Finished: {screen: Finished},
  Users: {screen: Users},
  Newgame: {screen: Newgame},
  EditGame: {screen: EditGame},
  Updateplayers: {screen: Updateplayers},
  Payoutpage: {screen: Payout}
})

export default createAppContainer(Navigator);
