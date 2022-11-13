import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  BackHandler,
  TouchableWithoutFeedback, RefreshControl, KeyboardAvoidingView
} from 'react-native';

import {Header} from '../../components';

import IconPanah from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';

import Btncheckin from "../../components/Btncheckin";
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../../components/Loader';
import moment from 'moment/min/moment-with-locales';
// import 'moment/locale/id';
import { CommonActions } from '@react-navigation/native';
import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
import FooterListener from '../../FooterListener';

export default function Beranda(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(true);

  const [dataJadwal, setDataJadwal] = useState([]);
  const [dataJadwalAll, setDataJadwalAll] = useState([]);
  const [dataJadwalSelesai, setDataJadwalSelesai] = useState([]);
  const [cancelTrx, setCancelTrx] = useState([]);
  const [id_jadwal_detail, setId_jadwal_detail] = useState('');

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const exist = await checkFcmToken();
    if(exist) {
      setRefreshing(false);
    }else {
      const success = await getRefresh();
      //alert(success);
      if(success) {
        setRefreshing(false)
        setLoadingFetch(false);
      }else {
        setRefreshing(true);
        setLoadingFetch(true);
      }
    }
    
    //wait(2000).then(() => setRefreshing(false));
  });

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    //alert(JSON.stringify(success));
    //console.log(success);
    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {
        //await alert(dataLogin);
        //await setLoading(false);
      }
    }
  }

  const getLocalData = async () => {
    success = await formValidation.getLocalData();

    //alert(JSON.stringify(success));
    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {
        //await alert(dataLogin);
        //await setLoading(false);
      }
    }
  }

  useEffect(() => {
    //setLoading(true);
    getLocalData();
    //onRefresh();

    return () => {
      setDataJadwal([]);
      setDataJadwalAll([]);
      setDataJadwalSelesai([]);
      setCancelTrx([]);
      setLoading(false);
      setLoadingFetch(false);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      setCurrentDataNakes();
    }

    return () => {
      setLoading(false);
      setLoadingFetch(false);
    }
  },[dataLogin]);

  /*useEffect(() => {
    if(dataJadwal !== undefined && dataJadwal.length > 0) {
      setReminders();
    }
  },[dataJadwal]);*/

  useEffect(() => {
    if(dataLogin) {
      if(refreshing) {
        setCurrentDataNakes();
      }
    }
  }, [refreshing]);

  function handleBackButtonClick() {
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    
    const unsubscribe = props.navigation.addListener('transitionEnd', (e) => {
      if(props.route.params.onRefresh !== undefined) {
        props.route.params.onRefresh();
      }
    });

    return () => {
      unsubscribe;
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }
  }, [props.navigation]);

  const checkFcmToken = async () => {
    const token = await AsyncStorage.getItem('token');
        if(token !== null) {
          let params = [];
          params.push({
            base_url: formValidation.base_url,
            token: token
          });

          success = await formValidation.checkToken(params);
          //console.log(success);

          if(success.status === true) {
            if(success.res.responseCode !== '000') {
              await AsyncStorage.clear();
              try {
                const value = await AsyncStorage.getItem('loginStatePasien')
                if(!value) {
                  props.navigation.dispatch(
                    CommonActions.reset({
                      index: 1,
                      routes: [
                        {
                          name: 'loginScreen',
                          params: { base_url: formValidation.base_url },
                        }
                      ],
                    })
                  )
                  return true;
                }else {
                  return false;
                }
              } catch(e) {
                alert(e);
              }
            }else {
              return true;
            }
          }else {
            return false;
          }
        }
  }

  const getRefresh = async () => {
    formValidation.getMsg = true;
    await getLoginData();
    /*success = await getJadwal();
    success = await getJadwalAll();
    success = await getJadwalSelesai();
    success = await getCancelTrx();*/
    const jadwal = getJadwal();
    const jadwalAll = getJadwalAll();
    const jadwalSelesai = getJadwalSelesai();
    const cancelTrx = getCancelTrx();

    const success = await Promise.all([jadwal, jadwalAll, jadwalSelesai, cancelTrx]);

    //nanti tambahin untuk getUser untuk mengecek status terbaru

    if(success) {
      await setLoading(false);
      await setLoadingFetch(false);
      return(true);
    }
    formValidation.getMsg = false;
  }

  const setCurrentDataNakes = async () => {
    //await getJadwal();
    //await getJadwalAll();
    //await getJadwalSelesai();
    //await getCancelTrx();
    //nanti tambahin untuk getUser untuk mengecek status terbaru

    const jadwal = getJadwal();
    const jadwalAll = getJadwalAll();
    const jadwalSelesai = getJadwalSelesai();
    const cancelTrx = getCancelTrx();

    const success = await Promise.all([jadwal, jadwalAll, jadwalSelesai, cancelTrx]);

    if(success) {
      await setLoading(false);
      await setLoadingFetch(false);
    }

    //getRefresh();
    setLoading(false);
    setLoadingFetch(false);
  }

  async function getJadwal() {
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getJadwal(params);
    
    if(success.status === true) {
      await setDataJadwal(success.res);
      return true;
    }
  }

  async function getJadwalAll() {
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      selectDate: '',
      token: dataLogin.token
    });

    success = await formValidation.getPendingTrx(params);

    if(success.status === true) {
      await setDataJadwalAll(success.res);
      return true;
    }
  }

  async function getJadwalSelesai() {
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getJadwalSelesai(params);
    
    if(success.status === true) {
      await setDataJadwalSelesai(success.res);
      return true;
    }
  }

  async function getCancelTrx() {
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getCancelTrxAll(params);

    if(success.status === true) {
      await setCancelTrx(success.res);
      return true;
    }
  }

  function checkOnSite() {
    const newItems = dataJadwal.filter(
      item => item.order_state === 'ONSITE'
    );
    return newItems.length;
  }

  async function handleCheckIn(e) {
    //console.log(e);
    let today = new Date();
    const data = await e.split('|');
    const id_jadwal = await data[0];
    const id_detail = await data[1];

    let resJadwal = '';
    if(id_detail !== null && id_detail !== 'null' && id_detail !== '') {
      await setId_jadwal_detail(id_detail);
      resJadwal = dataJadwal.filter(
        item => item.id_detail === id_detail
      );
    }else if(id_detail === null || id_detail === 'null' || id_detail === '') {
      await setId_jadwal_detail(id_jadwal);
      resJadwal = dataJadwal.filter(
        item => item.id_jadwal === id_jadwal
      );
    }

    if(resJadwal[0].payment_type === 'Online' && resJadwal[0].payment_state === 'OPEN') {
      formValidation.showError('Klien belum melakukan pembayaran !!!');
      return;
    }

    let sched = resJadwal[0].order_date + ' ' + resJadwal[0].order_start_time;
    let schedTime = new Date(sched);
    let diff = (Math.floor(((today-schedTime))/(1000*60)));

    let onsite = checkOnSite();
    if(onsite > 0) {
      formValidation.showError('Anda masih memiliki kunjungan yang belum diselesaikan (ONSITE).' + "\n" + 'Silahkan selesaikan kunjungan (Check-Out) sebelum melanjutkan ke jadwal kunjungan berikutnya.');
    }else {
      /*props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'mainMenuScreen',
              params: { base_url: props.route.params.base_url },
            },
            {
              name: 'checkInScreen',
              params: { base_url: props.route.params.base_url, dataJadwal: resJadwal, onRefresh: onRefresh },
            }
          ],
        })
      )*/
      props.navigation.navigate('checkInScreen', { base_url: formValidation.base_url, dataJadwal: resJadwal, onRefresh: onRefresh, dataLogin: dataLogin });
    }
  }

  async function handleOnsite(e) {
    //alert(e); return;
    const data = await e.split('|');
    const id_jadwal = await data[0];
    const id_detail = await data[1];

    await setId_jadwal_detail(id_jadwal);
    
    let resJadwal = '';
    if(id_detail !== null && id_detail !== 'null' && id_detail !== '') {
      await setId_jadwal_detail(id_detail);
      resJadwal = dataJadwal.filter(
        item => item.id_detail === id_detail
      );
    }else if(id_detail === null || id_detail === 'null' || id_detail === '') {
      await setId_jadwal_detail(id_jadwal);
      resJadwal = dataJadwal.filter(
        item => item.id_jadwal === id_jadwal
      );
    }
    
    //await AsyncStorage.setItem('jadwalAktif', JSON.stringify(resJadwal));
    props.navigation.navigate('checkInScreen', { base_url: formValidation.base_url, dataJadwal: resJadwal, onRefresh: onRefresh, dataLogin: dataLogin });
  }

  function openEvent() {
    props.navigation.navigate('eventPage', { base_url: formValidation.base_url, dataLogin: dataLogin });
  }

  function openInfo() {
    props.navigation.navigate('infoPage', { base_url: formValidation.base_url, dataLogin: dataLogin });
  }

  function Jadwal() {
    const newItems = dataJadwal;
    //alert(JSON.stringify(dataJadwal));
    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <View key={item.id_jadwal + "|" + item.id_detail} style={styles.Label_layanan_akhir_isi}>
            <Text style={[styles.rowLabel, {flex: 0.25}]}>{item.client}</Text>
            <Text style={[styles.rowLabel, {flex: 0.35, textAlign: 'center'}]}>{moment(item.order_date, "YYYY-MM-DD").format("DD/MM/YY") + ', ' + item.order_start_time.replace(':00:00', '.00') + ' WIB'}</Text>
            <Text style={[styles.rowLabel, {flex: 0.20, textAlign: 'center'}]}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
            <Btncheckin
              style={styles.btncheckin1}
              id={item.id_jadwal + '|' + item.id_detail}
              order_state={item.order_state}
              handleCheckIn={handleCheckIn}
              handleOnsite={handleOnsite}
            />
          </View>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  const [warnaTab, setWarnaTab] = useState(true);
  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 18,
            opacity: 0.8,
            fontWeight: 'bold',
          }}
          name={name}
        />
      );
    }
  };

  //untuk copy kode nakes
  const copyKodeNakes = e => {
    ToastAndroid.show('Kode Nakes berhasil di salin', ToastAndroid.SHORT);
    Clipboard.setString(e);
  };

  /* start untuk jadwal aktif dan reservasi */
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'JadwalAktif', title: 'Jadwal Aktif'},
    //{key: 'RiwayatReservasi', title: 'Riwayat Reservasi'},
  ]);

  const JadwalAktif = () => (
    <View
      style={[
        styles.Jadwal_menunggu(layout),
        {backgroundColor: 'rgba(200, 236, 255, 1)'},
      ]}>
      <View
        style={[
          styles.Label_layanan_akhir,
          {backgroundColor: 'rgba(0, 125, 189, 1)'},
        ]}>
        <View style={[styles.Lbl_layanan, {flex: 0.25}]}>
          <Text style={styles.Txt833}>Nama Client</Text>
        </View>
        <View style={[styles.Lbl_layanan, {flex: 0.35}]}>
          <Text style={styles.Txt833}>Jadwal</Text>
        </View>
        <View style={[styles.Lbl_layanan, {flex: 0.20}]}>
          <Text style={styles.Txt833}>Status</Text>
        </View>
        <View style={[styles.Lbl_layanan, {flex: 0.20}]}>
          <Text style={styles.Txt833}>Opsi</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {!loadingFetch ?
          <Jadwal />
          :
          <></>
        }
      </ScrollView>
    </View>
  );

  const RiwayatReservasi = () => (
    <View
      style={[
        styles.Jadwal_menunggu(layout),
        {backgroundColor: 'rgba(229, 229, 229, 1)'},
      ]}>
      <View
        style={[
          styles.Label_layanan_akhir,
          {backgroundColor: 'rgba(79, 92, 99, 1)'},
        ]}>
        <View style={styles.Lbl_layanan}>
          <Text style={styles.Txt833}>Nama Client</Text>
        </View>
        <View style={styles.Lbl_layanan}>
          <Text style={styles.Txt833}>Jadwal</Text>
        </View>
        <View style={styles.Lbl_layanan}>
          <Text style={styles.Txt833}>Laporan</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {dataJadwalLayanan.map((item, index) => {
          return (
            <View key={index} style={styles.Label_layanan_akhir_isi}>
              <View style={styles.Lbl_layanan_isi}>
                <Text style={styles.Txt833_isi}>{item.layanan}</Text>
              </View>
              <View style={styles.Lbl_layanan_isi}>
                <Text style={styles.Txt833_isi}>{item.jadwal}</Text>
              </View>
              <View style={styles.Lbl_layanan_isi_status}>
                <Text style={styles.Txt833_isi_status}>{item.status}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );

  const renderScene = SceneMap({
    JadwalAktif,
    RiwayatReservasi,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      renderLabel={({route, focused, color}) => (
        <Text style={styles.Txt616(focused, color)}>{route.title}</Text>
      )}
      indicatorStyle={{
        backgroundColor: 'rgba(0, 125, 189, 1)',
      }}
      activeColor="rgba(0, 125, 189, 1)"
      inactiveColor="rgba(79, 92, 99, 1)"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 1)',
        marginBottom: 10,
      }}
    />
  );
  /* end untuk jadwal aktif dan reservasi */

  /* start untuk jadwal layanan layanan */
  const dataJadwalLayanan = [
    {
      key: '1',
      layanan: 'Fisioterapi',
      jadwal: '12/05/2022',
      status: 'Aktif',
    },
    {
      key: '2',
      layanan: 'Fisioterapi',
      jadwal: '12/05/2022',
      status: 'Aktif',
    },
    {
      key: '3',
      layanan: 'Fisioterapi',
      jadwal: '12/05/2022',
      status: 'Aktif',
    },
  ];
  /* end untuk jadwal layanan layanan */

  // data untuk  card Reservasi Aktif, Reservasi Selesai, Reservasi Batal
  const dataReservasi = [
    {
      reservasi: 'Aktif',
      jumlah: dataJadwalAll ? dataJadwalAll.length : '0',
      color: '#43A9DD',
    },
    {
      reservasi: 'Selesai',
      jumlah: dataJadwalSelesai ? dataJadwalSelesai.length : '0',
      color: '#24C38E',
    },
    {
      reservasi: 'Batal',
      jumlah: cancelTrx ? cancelTrx.length : '0',
      color: '#FF0000',
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
      >
      <SafeAreaView style={styles.container}>
        <View
            style={styles.Beranda}
            onLayout={event => setLayout(event.nativeEvent.layout)}>

          {dataLogin ?
            <Header name="beranda" props={props} dataLogin={dataLogin} thumbProfile={dataLogin.thumbProfile}/>
            :
            <View style={styles.User} />
          }
          <ScrollView
            showsVerticalScrollIndicator={false}
            horizontal={false}
            contentContainerStyle={styles.scrollArea_contentContainerStyle}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          >

            <View style={styles.boxPartner}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                {dataReservasi.map((item, index) => {
                  return (
                    <View key={index} style={styles.videoPreview(item)}>
                      <View style={styles.wrapper}>
                        <View>
                          <Text style={styles.textReservasi}>Reservasi</Text>
                          <Text style={styles.textReservasi}>{item.reservasi}</Text>
                        </View>
                        <Icons
                          label="Panah"
                          name="add-circle"
                          color="rgba(255, 255, 255, 1)"
                        />
                      </View>
                      <View style={{justifyContent: 'center', marginRight: 25}}>
                        <Text style={styles.textNilai}>{item.jumlah}</Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </View>

            {/* untuk start tampilan Jadwal Aktif dan Riwayat Reservasi */}
            <View style={styles.wrapperTabView}>
              {/*<TabView
                navigationState={{index, routes}}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
              />*/}
              <JadwalAktif />
            </View>
            {/* untuk end tampilan Jadwal Aktif dan Riwayat Reservasi */}
            <View style={styles.boxInfo}>
              <Text style={styles.Txt616}>Informasi</Text>
              <View style={styles.wrapperInformasi}>
                <TouchableOpacity
                  onPress={() => openEvent()}
                  style={[styles.wrapperSeminar, {backgroundColor: '#FF7A00'}]}>
                  <View>
                    <Text style={styles.Txt8333}>Informasi</Text>
                    <Text style={styles.Txt8333}>Seminar & Pelatihan</Text>
                  </View>
                  <Icons
                    label="Panah"
                    name="share-social"
                    color="rgba(255, 255, 255, 1)"
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => openInfo()}
                  style={[styles.wrapperSeminar, {backgroundColor: '#D04BFF'}]}>
                  <View>
                    <Text style={styles.Txt8333}>Informasi</Text>
                    <Text style={styles.Txt8333}>Lowongan Kerja</Text>
                  </View>
                  <Icons
                    label="Panah"
                    name="share-social"
                    color="rgba(255, 255, 255, 1)"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginTop: '5%'}}>
              <TouchableOpacity style={styles.wrapperBantuan}>
                <Text style={styles.Txt8333}>Kanal Bantuan Customer Services</Text>

                <Icons label="Panah" name="mail" color="rgba(255, 255, 255, 1)" />
              </TouchableOpacity>
            </View>

            <Text style={styles.textLabel}>Diketahui :</Text>
            <View style={styles.boxPartner}>
              <Image
                style={styles.logoImage}
                source={{uri: formValidation.base_url + 'data_assets/partner/logo_ifi.jpeg'}}
                resizeMode="contain"
              />
              <Image
                style={styles.logoImage}
                source={{uri: formValidation.base_url + 'data_assets/partner/logo_ikatwi.jpeg'}}
                resizeMode="contain"
              />
            </View>
            
          </ScrollView>
        </View>
        <FooterListener props={props} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  containerKey: {
    flex: 1,
    backgroundColor: 'rgba(54,54,54,1)',
  },
  scrollArea_contentContainerStyle: {
    // flex: 1,
    height: 'auto',
  },
  Beranda: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: '2%',
    width: '100%',
  },
  rowLabel: {
    flex: 0.25,
    fontFamily: "roboto-regular",
    //color: "rgba(245,245,245,1)",
    height: 'auto',
    fontSize: 12,
    flexShrink:1,
    flexWrap: 'wrap',
    alignSelf: 'center',

  },
  btncheckin1: {
    fontFamily: "roboto-regular",
    color: "rgba(245,245,245,1)",
    minHeight: 20,
    height: 'auto',
    flex: 0.20,
    fontSize: 12,
    flexShrink:1,
    flexWrap: 'wrap',
    alignSelf: 'center'
  },
  boxInfo: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: '2%',
    justifyContent: 'center'
  },
  boxPartner: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: '2%',
    justifyContent: 'center',
  },
  textLabel: {
    textAlign: 'center',
    marginTop: '5%'
  },
  logoImage: {
    marginHorizontal: '2%',
    height: 60,
    width: 60,
    justifyContent: 'center',
  },

  User: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  subUser: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  Useravatar: {
    width: 40,
    height: 40,
    marginRight: 8,
    borderRadius: 100,
  },
  Text: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  Txt254: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 16,
    color: 'rgba(0,32,51,1)',
    marginBottom: 4,
  },
  Txt681: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,32,51,0.6)',
    paddingRight: 25,
  },

  Jadwal_menunggu: layout => ({
    justifyContent: 'space-between',
    borderRadius: 20,
    width: layout.width * 0.96,
    height: '100%',
    maxHeight: '100%',
  }),
  wrapperTabView: {
    flex: 1,
    height: 'auto',
    minHeight: 200
  },

  Lbl_layanan: {
    paddingTop: 2,
    borderRadius: 10,
    width: '25%',
    height: 20,
  },
  Lbl_layanan_isi: {
    paddingTop: 2,
    borderRadius: 10,
    width: '25%',
    height: 20,
  },
  Lbl_layanan_isi_status: {
    paddingTop: 2,
    borderRadius: 10,
    width: '25%',
    height: 20,
    backgroundColor: 'rgba(79, 92, 99, 1)',
  },
  Txt833: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Txt8333: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'left',
    justifyContent: 'center',
  },
  Txt833_isi: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    textAlign: 'center',
    color: 'rgba(0,0,0,1)',
    justifyContent: 'center',
  },
  Txt833_isi_status: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 1)',
    justifyContent: 'center',
  },

  Label_layanan_akhir: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
    paddingVertical: '4%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  Label_layanan_akhir_isi: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '2%',
    paddingVertical: '4%',
  },

  Txt616: (focused, color) => ({
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: color,
    textAlign: 'left',
  }),

  videoPreview: item => ({
    flex: 1,
    flexDirection: 'row',
    width: 240,
    height: 120,
    marginRight: 5,
    borderRadius: 8,
    backgroundColor: item.color,
  }),
  wrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 25,
    marginVertical: 10,
  },

  textReservasi: {
    fontSize: 14,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  textNilai: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  wrapperInformasi: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  wrapperSeminar: {
    height: 80,
    width: '45%',
    borderBottomRightRadius: 50,
    paddingLeft: 10,
    paddingVertical: 5,
    justifyContent: 'space-between',
  },
  wrapperBantuan: {
    borderRadius: 10,
    flexDirection: 'row',
    backgroundColor: '#7F8A8E',
    padding: 10,
    marginBottom: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  wrapperKembali: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 169, 221, 1)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
});
