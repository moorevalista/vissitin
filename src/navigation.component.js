import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
//import Loader from './screens/Loader';
import Mainmenu from './screens/Mainmenu';
import Settingpage from './screens/Settingpage';
import Registrasi from './screens/Registrasi';
import Updatedatapribadi from './screens/Updatedatapribadi';
import Dataprofesi from './screens/Dataprofesi';
import Aturlayanan from './screens/Aturlayanan';
import Aturjadwalresv from './screens/Aturjadwalresv';
import Jadwal from './screens/Jadwal';
import Transaksipage from './screens/Transaksipage';
import Trxbooking from './screens/Trxbooking';
import Trxmenunggu from './screens/Trxmenunggu';
import Trxselesai from './screens/Trxselesai';
import Trxbatal from './screens/Trxbatal';
import Laporanpage from './screens/Laporanpage';
import Laporanview from './screens/Laporanview';
import Laporaninput from './screens/Laporaninput';
import Listchat from './screens/Listchat';
import Chatpage from './screens/Chatpage';
import Checkin from './screens/Checkin';
import ResetPass from './screens/ResetPass';
import ResetPass1 from './screens/ResetPass1';
import EventPage from './screens/EventPage';
import InfoPage from './screens/InfoPage';
import InfoDetailPage from './screens/InfoDetailPage';

const { Navigator, Screen } = createNativeStackNavigator();

const linking = {
  prefixes: [
    'nakes.vissit.in://'
  ],
  config: {
    screens: {
      loginScreen: {
        path: 'login',
      },
      resetPass: {
        path: 'resetPass',
      },
      setNewPass: {
        path: 'resetPassword/:id/:token',
        parse: {
          id: (id) => `${id}`,
          token: (token) => `${token}`,
        },
      },
    },
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1
  }
});

const config = {
  animation: 'spring',
  config: {
    stiffness: 1000,
    damping: 500,
    mass: 3,
    overshootClamping: true,
    restDisplacementThreshold: 0.01,
    restSpeedThreshold: 0.01,
  },
};

const HomeNavigator = (props) => (
  <Navigator
    screenOptions={{
      headerShown: false
    }}>
    <Screen name='loginScreen' component={Login} />
    <Screen name='registrasiScreen' component={Registrasi} />
    <Screen name='mainMenuScreen' component={Mainmenu} />
    <Screen name='settingScreen' component={Settingpage} />
    <Screen name='profileScreen' component={Updatedatapribadi} />
    <Screen name='profesiScreen' component={Dataprofesi} />
    <Screen name='layananScreen' component={Aturlayanan} />
    <Screen name='jadwalScreen' component={Aturjadwalresv} />
    <Screen name='allJadwalScreen' component={Jadwal} />
    <Screen name='transaksiScreen' component={Transaksipage} />
    <Screen name='bookingTrx' component={Trxbooking} />
    <Screen name='antrianTrx' component={Trxmenunggu} />
    <Screen name='selesaiTrx' component={Trxselesai} />
    <Screen name='batalTrx' component={Trxbatal} />
    <Screen name='laporanScreen' component={Laporanpage} />
    <Screen name='laporanTrx' component={Laporanview} />
    <Screen name='laporanInput' component={Laporaninput} />
    <Screen name='listChat' component={Listchat} />
    <Screen name='chatPage' component={Chatpage}
      options={{
        transitionSpec: {
          open: config,
          close: config,
        },
      }}
    />
    <Screen name='checkInScreen' component={Checkin} />
    <Screen name='resetPass' component={ResetPass} />
    <Screen name='setNewPass' component={ResetPass1} />
    <Screen name='eventPage' component={EventPage} />
    <Screen name='infoPage' component={InfoPage} />
    <Screen name='infoDetailPage' component={InfoDetailPage} />
  </Navigator>
);

export const AppNavigator = (props) => (
  <NavigationContainer style={styles.container} linking={linking} fallback={<></>}>
    <HomeNavigator />
  </NavigationContainer>
);