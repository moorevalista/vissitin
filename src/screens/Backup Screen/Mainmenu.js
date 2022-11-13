import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { RefreshControl, StyleSheet, View, Text, ScrollView, SafeAreaView, useColorScheme, TouchableWithoutFeedback } from "react-native";
import EntypoIcon from "react-native-vector-icons/Entypo";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import Btncheckin from "../components/Btncheckin";
import Label2 from "../components/Label2";
import Headr1 from "../components/Headr1";
import Footer from "../components/Footer";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import Loader from '../components/Loader';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { CommonActions } from '@react-navigation/native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import AwesomeAlert from 'react-native-awesome-alerts';
import axios from "axios";
//import Notifications from "../Notifications";

function Mainmenu(props) {
  const formValidation = useContext(form_validation);

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

  //alert(JSON.stringify(props));

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

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

  const checkFcmToken = async () => {
    const token = await AsyncStorage.getItem('token');
        if(token !== null) {
          let params = [];
          params.push({
            base_url: props.route.params.base_url,
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
                          params: { base_url: props.route.params.base_url },
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
      base_url: props.route.params.base_url,
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
      base_url: props.route.params.base_url,
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
      base_url: props.route.params.base_url,
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
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getCancelTrx(params);

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
      props.navigation.navigate('checkInScreen', { base_url: props.route.params.base_url, dataJadwal: resJadwal, onRefresh: onRefresh, dataLogin: dataLogin });
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
    props.navigation.navigate('checkInScreen', { base_url: props.route.params.base_url, dataJadwal: resJadwal, onRefresh: onRefresh, dataLogin: dataLogin });
  }

  function openEvent() {
    props.navigation.navigate('eventPage', { base_url: props.route.params.base_url, dataLogin: dataLogin });
  }

  function openInfo() {
    props.navigation.navigate('infoPage', { base_url: props.route.params.base_url, dataLogin: dataLogin });
  }

  function Jadwal() {
    const newItems = dataJadwal;
    //alert(JSON.stringify(dataJadwal));
    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <View key={item.id_jadwal + "|" + item.id_detail} style={styles.row2}>
            <View style={styles.usernameRow}>
              <Text style={[styles.rowLabel, {flex: 0.35}]}>{item.client}</Text>
              <Text style={styles.rowLabel}>{moment(item.order_date, "YYYY-MM-DD").format("DD/MM/YY") + ', ' + item.order_start_time.replace(':00:00', '.00')}</Text>
              <Text style={[styles.rowLabel, {flex: 0.20}]}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
              <Btncheckin
                style={styles.btncheckin1}
                id={item.id_jadwal + '|' + item.id_detail}
                order_state={item.order_state}
                handleCheckIn={handleCheckIn}
                handleOnsite={handleOnsite}
              />
            </View>
          </View>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  return (
    //!loading ?
    <View style={styles.containerKey}>
    {dataLogin ?
      <Headr1 style={styles.header1} dataLogin={dataLogin} thumbProfile={dataLogin.thumbProfile} />
      :
      <View style={styles.header1} />
    }
      <Spinner
                  //visible={loadingFetch}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#236CFF"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
      <ScrollView
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            >
        <View style={styles.container}>
          <View style={styles.scrollAreaStack}>
            <View style={[styles.scrollArea, styles.inner]}>
              <View style={styles.btnrow1Column}>
                <View style={styles.box}>
                  <Label2 style={styles.label2}></Label2>
                  <View style={styles.group}>
                    <View style={styles.rect5}>
                      <View style={styles.scrollArea2}>
                          <View style={styles.namaClient1Row}>
                            <Text style={[styles.colHead, {flex: 0.35}]}>Nama Client</Text>
                            <Text style={styles.colHead}>Jadwal</Text>
                            <Text style={[styles.colHead, {flex: 0.20}]}>Kategori</Text>
                            <Text style={styles.colHead}>Status</Text>
                          </View>
                          <View style={styles.rect4}></View>
                      </View>
                      <View style={styles.scrollArea1}>
                        <ScrollView
                          horizontal={true}
                          contentContainerStyle={styles.scrollArea1_contentContainerStyle}
                        >
                          <View style={styles.scrollAreaStack1}>
                            {!loadingFetch ?
                              <Jadwal />
                              :
                              <></>
                            }
                          </View>      
                        </ScrollView>
                      </View>
                    </View>
                  </View>
                </View>

                

                <View style={styles.box}>
                  <View style={[styles.label2, {marginTop: '2%'}]}>
                    <View style={styles.icon2Row}>
                      <MaterialCommunityIconsIcon
                        name="binoculars"
                        style={styles.icon2}
                      ></MaterialCommunityIconsIcon>
                      <Text style={styles.aktivitas1}>Aktivitas</Text>
                    </View>
                  </View>
                  <View style={styles.btnrow1}>
                    <View style={styles.btnactivity1}>
                      <View style={styles.rect1}>
                        <EntypoIcon name="back-in-time" style={styles.icon3}></EntypoIcon>
                        <Text style={styles.activenumber}>{dataJadwalAll ? dataJadwalAll.length : '0'}</Text>
                        <Text style={styles.aktif4}>Aktif</Text>
                      </View>
                    </View>
                    <View style={styles.btnactivity2}>
                      <View style={styles.rect6}>
                        <MaterialCommunityIconsIcon
                          name="checkbox-multiple-marked-circle-outline"
                          style={styles.icon4}
                        ></MaterialCommunityIconsIcon>
                        <Text style={styles.text4}>{dataJadwalSelesai ? dataJadwalSelesai.length : '0'}</Text>
                        <Text style={styles.selesai}>Selesai</Text>
                      </View>
                    </View>
                    <View style={styles.btnactivity3}>
                      <View style={styles.rect7}>
                        <IoniconsIcon
                          name="md-close-circle-outline"
                          style={styles.icon5}
                        ></IoniconsIcon>
                        <Text style={styles.text5}>{cancelTrx ? cancelTrx.length : '0'}</Text>
                        <Text style={styles.batal}>Batal</Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View style={styles.box}>
                  <View style={styles.btnKegiatan}>
                    <TouchableWithoutFeedback onPress={() => openEvent()}>
                      <View style={[styles.rect8, {backgroundColor: "rgba(0,104,159,1)"}]}>
                        <View style={styles.icon6Row}>
                          <EntypoIcon
                            name="briefcase"
                            style={styles.icon6}
                          ></EntypoIcon>
                          <Text style={styles.labelKegiatan}>
                            SEMINAR &amp; PELATIHAN
                          </Text>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={styles.btnKegiatan}>
                    <TouchableWithoutFeedback style={styles.btnKegiatan} onPress={() => openInfo()}>
                      <View style={[styles.rect8, {backgroundColor: "rgba(253,120,14,1)"}]}>
                        <View style={styles.icon6Row}>
                          <EntypoIcon name="dropbox" style={styles.icon6}></EntypoIcon>
                          <Text style={styles.labelKegiatan}>LOWONGAN KERJA</Text>
                        </View>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
              <View style={styles.btnrow1ColumnFiller}></View>
            </View>
          </View>
        </View>
      </ScrollView>
      <View>
        <Footer props={props} dataLogin={dataLogin} />
      </View>
      <FlashMessage position="top" />
    </View>
    //:
    //<>
    //  <Loader
    //    visible={loading}
    //  />
    //</>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: '25%',
    backgroundColor: "white"
  },
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  box: {
    flex: 1,
    height: 'auto',
    //marginTop: '2%',
    padding: '2%',
    //borderWidth: 2,
    borderColor: 'red'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  scrollAreaStack: {
    width: '100%',
    height: 'auto',
    flex: 1
  },
  scrollArea: {
    flex: 1,
    height: 'auto',
    padding: 10
  },
  btnrow1Column: {
    flex: 1,
    height: 'auto'
  },
  group: {
    height: 'auto',
    marginTop: '1%'
  },
  btnrow1ColumnFiller: {
    flex: 1
  },
  btnrow1: {
    flex: 1,
    height: 'auto',
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: '1%'
  },
  btnactivity1: {
    width: '30%',
    height: 'auto'
  },
  rect1: {
    width: '100%',
    height: 'auto',
    backgroundColor: "rgba(80,227,194,1)",
    borderRadius: 15,
    padding: '1%'
  },
  icon3: {
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    height: 23,
    width: 20,
    marginTop: 3,
    marginLeft: 4
  },
  activenumber: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 40,
    textAlign: "center"
  },
  aktif4: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    padding: '1%',
    textAlign: "center"
  },
  btnactivity2: {
    width: '30%',
    height: 'auto'
  },
  rect6: {
    width: '100%',
    height: 'auto',
    backgroundColor: "rgba(255,149,0,1)",
    borderRadius: 15,
    padding: '1%'
  },
  icon4: {
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    height: 23,
    width: 20,
    marginTop: 3,
    marginLeft: 4
  },
  text4: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 40,
    textAlign: "center"
  },
  selesai: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    padding: '1%',
    textAlign: "center"
  },
  btnactivity3: {
    width: '30%',
    height: 'auto'
  },
  rect7: {
    width: '100%',
    height: 'auto',
    backgroundColor: "rgba(255,70,0,1)",
    borderRadius: 15,
    padding: '1%'
  },
  icon5: {
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    height: 23,
    width: 20,
    marginTop: 3,
    marginLeft: 4
  },
  text5: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 40,
    textAlign: "center"
  },
  batal: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    padding: '1%',
    textAlign: "center"
  },
  rect5: {
    height: 'auto',
    backgroundColor: "#41aadf",
    borderRadius: 15
  },
  scrollArea2: {
    height: 'auto',
    padding: '1%',
    marginTop: '1%'
  },
  scrollArea2_contentContainerStyle: {
    width: '100%',
    height: '100%'
  },
  colHead: {
    color: "rgba(255,255,255,1)",
    flex: 0.25
  },
  namaClient1Row: {
    flex: 1,
    flexDirection: "row",
    padding: '2%'
  },
  rect4: {
    height: 1,
    backgroundColor: "#E6E6E6",
  },
  scrollArea1: {
    flex: 1,
    top: 0,
    left: 0
  },
  scrollArea1_contentContainerStyle: {
    height: 'auto',
    width: '100%'
  },
  scrollAreaStack1: {
    width: '100%',
    height: 'auto',
    minHeight: 50,
    marginTop: 0,
    flex: 1,
  },
  row2: {
    height: 'auto',
    padding: '2%'
  },
  rowLabel: {
    flex: 0.25,
    fontFamily: "roboto-regular",
    color: "rgba(245,245,245,1)",
    height: 'auto',
    fontSize: 13,
    flexShrink:1,
    flexWrap: 'wrap',
    alignSelf: 'center'
  },
  btncheckin1: {
    fontFamily: "roboto-regular",
    color: "rgba(245,245,245,1)",
    minHeight: 20,
    height: 'auto',
    flex: 0.25,
    fontSize: 12,
    flexShrink:1,
    flexWrap: 'wrap',
    alignSelf: 'center'
  },
  usernameRow: {
    flex: 1,
    padding: '1%',
    flexDirection: "row",
    height: 'auto'
  },
  icon2: {
    color: "#41aadf",
    fontSize: 30
  },
  aktivitas1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    //marginTop: 8
    alignSelf: 'center'
  },
  icon2Row: {
    flexDirection: "row",
    flex: 1,
    padding: '2%',
  },
  label2: {
    height: 'auto',
    width: '100%'
  },
  header1: {

  },
  btnKegiatan: {
    marginTop: '2%'
  },
  rect8: {
    backgroundColor: "rgba(80,227,194,1)",
    borderRadius: 15,
    padding: '1%',
    alignItems: "center"
  },
  icon6: {
    color: "rgba(255,255,255,1)",
    fontSize: 28
  },
  labelKegiatan: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 18,
    marginLeft: 8,
    marginTop: 5
  },
  icon6Row: {
    flexDirection: "row",
    padding: '5%'
  },
});

export default Mainmenu;
