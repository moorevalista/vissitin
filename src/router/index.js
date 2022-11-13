 import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import IconPanah from 'react-native-vector-icons/Ionicons';

import {
  AlertEmail,
  AlertPendaftaran,
  AlertReservasi,
  Beranda,
  Checkin,
  DetailAntrian,
  DetailBatal,
  DetailBooking,
  DetailSelesai,
  EditDataJadwal,
  EditDataLayanan,
  EditDataPribadi,
  EditDataProfesi,
  GantiSandi,
  InformasiRekening,
  InformasiSeminar,
  InformasiLoker,
  DetailLoker,
  Jadwal,
  KonfirmasiVCall,
  Laporan,
  LaporanDetail,
  LaporanInput,
  Login,
  LoginOtp,
  LupaSandi,
  Pendaftaran,
  Pesan,
  PesanAktif,
  Reservasi,
  ResetSandi,
  Setting,
} from '../screens';
import {BottomNavigator} from '../components';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const Icons = ({label, name}) => {
  if (label === 'Panah') {
    return <IconPanah style={styles.IconPanah} name={name} />;
  }
};

const MainApp = (props) => {
  return (
    <Tab.Navigator
      tabBar={props => <BottomNavigator {...props} props={props} />}
      initialRouteName="Beranda">
      <Tab.Screen
        name="Pesan"
        component={Pesan}
        options={HeaderNoNavigation('Pesan')}
      />
      <Tab.Screen
        name="Laporan"
        component={Laporan}
        options={HeaderNoNavigation('Laporan')}
      />

      <Tab.Screen
        name="Beranda"
        component={Beranda}
        options={{headerShown: false}}
      />

      <Tab.Screen
        name="Reservasi"
        component={Reservasi}
        options={HeaderNoNavigation('Reservasi')}
      />
      <Tab.Screen
        name="Jadwal"
        component={Jadwal}
        options={HeaderNoNavigation('Jadwal')}
      />
    </Tab.Navigator>
  );
};

const HeaderNavigation = title => {
  return ({navigation}) => ({
    title: title,
    headerTitleAlign: 'center',
    headerTitleStyle: {fontSize: 14, color: 'rgba(0, 0, 0, 1)'},
    headerStyle: {
      backgroundColor: 'rgba(217,217,217,1)',
    },
    headerTintColor: 'rgba(255, 255, 255, 1)',

    headerLeft: () => (
      <TouchableOpacity
        onPress={() => navigation.navigate('Beranda')}>
        <View style={styles.IconHeader}>
          <Icons label="Panah" name="grid" />
        </View>
      </TouchableOpacity>
    ),
    headerRight: () => (
      <TouchableOpacity
        onPress={() => {
          title === 'Antrian' ? navigation.navigate('MainApp') : navigation.goBack();
        }}>
        <View style={styles.IconHeader}>
          <Icons label="Panah" name="chevron-back-sharp" />
        </View>
      </TouchableOpacity>
    ),
  });
};

const HeaderNoNavigation = title => {
  return ({navigation}) => ({
    title: title,
    headerTitleAlign: 'center',
    headerTitleStyle: {fontSize: 14, color: 'rgba(255, 255, 255, 1)'},
    headerStyle: {
      backgroundColor: 'rgba(54,54,54,1)',
    },
    headerTintColor: 'rgba(255, 255, 255, 1)',

  });
};

const Router = () => {
  return (
    <Stack.Navigator initialRouteName="loginScreen">
      <Stack.Screen
        name="MainApp"
        component={MainApp}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="loginScreen"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="registrasiScreen"
        component={Pendaftaran}
        options={HeaderNoNavigation('Pendaftaran')}
      />
      <Stack.Screen
        name="resetPass"
        component={LupaSandi}
        options={HeaderNoNavigation('Pulihkan Sandi')}
      />
      <Stack.Screen
        name="settingScreen"
        component={Setting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="alertEmail"
        component={AlertEmail}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="setNewPass"
        component={ResetSandi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="profileScreen"
        component={EditDataPribadi}
        options={HeaderNavigation('Data Pribadi')}
      />
      <Stack.Screen
        name="profesiScreen"
        component={EditDataProfesi}
        options={HeaderNavigation('Data Profesi')}
      />
      <Stack.Screen
        name="layananScreen"
        component={EditDataLayanan}
        options={HeaderNavigation('Data Layanan')}
      />
      <Stack.Screen
        name="jadwalScreen"
        component={EditDataJadwal}
        options={HeaderNavigation('Data Jadwal')}
      />
      <Stack.Screen
        name="checkInScreen"
        component={Checkin}
        options={HeaderNoNavigation('Jadwal Aktif')}
      />
      <Stack.Screen
        name="eventPage"
        component={InformasiSeminar}
        options={HeaderNoNavigation('Informasi Seminar & Pelatihan')}
      />
      <Stack.Screen
        name="infoPage"
        component={InformasiLoker}
        options={HeaderNoNavigation('Informasi Lowongan Kerja')}
      />
      <Stack.Screen
        name="infoDetailPage"
        component={DetailLoker}
        options={HeaderNoNavigation('Informasi Lowongan Kerja')}
      />
      <Stack.Screen
        name="bookingTrx"
        component={DetailBooking}
        options={HeaderNavigation('Booking')}
      />
      <Stack.Screen
        name="antrianTrx"
        component={DetailAntrian}
        options={HeaderNavigation('Antrian')}
      />
      <Stack.Screen
        name="selesaiTrx"
        component={DetailSelesai}
        options={HeaderNavigation('Selesai')}
      />
      <Stack.Screen
        name="batalTrx"
        component={DetailBatal}
        options={HeaderNavigation('Batal')}
      />
      <Stack.Screen
        name="laporanTrx"
        component={LaporanDetail}
        options={HeaderNavigation('Laporan')}
      />
      <Stack.Screen
        name="chatPage"
        component={PesanAktif}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="laporanInput"
        component={LaporanInput}
        options={HeaderNavigation('Laporan')}
      />

      <Stack.Screen
        name="AlertReservasi"
        component={AlertReservasi}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AlertPendaftaran"
        component={AlertPendaftaran}
        options={{headerShown: false}}
      />
      
      <Stack.Screen
        name="EditDataProfesi"
        component={EditDataProfesi}
        options={HeaderNavigation('Data Profesi')}
      />
      <Stack.Screen
        name="EditDataLayanan"
        component={EditDataLayanan}
        options={HeaderNavigation('Data Layanan')}
      />
      <Stack.Screen
        name="EditDataJadwal"
        component={EditDataJadwal}
        options={HeaderNavigation('Data Jadwal')}
      />
      <Stack.Screen
        name="GantiSandi"
        component={GantiSandi}
        options={HeaderNavigation('Ganti Sandi')}
      />
      
      <Stack.Screen
        name="InformasiRekening"
        component={InformasiRekening}
        options={HeaderNavigation('Informasi Rekening')}
      />
      
      
      
      <Stack.Screen
        name="KonfirmasiVCall"
        component={KonfirmasiVCall}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="LoginOtp"
        component={LoginOtp}
        options={{headerShown: false}}
      />
      
      
    </Stack.Navigator>
  );
};

export default Router;

const styles = StyleSheet.create({
  IconHeader: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 169, 221, 1)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  IconPanah: {
    backgroundColor: 'transparent',
    color: 'rgba(255, 255, 255, 1)',
    fontSize: 14,
    opacity: 0.8,
  },
});
