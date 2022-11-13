import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { BackHandler, StyleSheet, View, ScrollView, Text, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import Transaksihead from "../components/Transaksihead";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Petapasien from "../components/Petapasien";
import TblCheckin from "../components/TblCheckin";
import Isilaporan from "../components/Isilaporan";
import Footer from "../components/Footer";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import 'moment/locale/id';
import Loader from '../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Listener from '../listener';

function Checkin(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  //params for checkin
  const [currentState, setCurrentState] = useState('');
  const [reqCheckin, setReqCheckin] = useState(false);
  const [reqCheckout, setReqCheckout] = useState(false);
  const [checkinTime, setCheckinTime] = useState('');
  const [checkoutTime, setCheckoutTime] = useState('');
  const [paramsCheck, setParamsCheck] = useState(''); //to footer-event

  //dari page sebelumnya
  const [dataJadwal, setDataJadwal] = useState([]);

  //data report
  const [dataReport, setDataReport] = useState('');

  //data for checkout
  //const [dataJadwalCheckOut, setDataJadwalCheckOut] = useState([]);

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(async(val) => {
    await setReqCheckout(false);
    setRefreshing(true);
    const success = await getCurrentReport();
    //alert(success);
    if(success) {
      setRefreshing(false)
      //setLoadingFetch(false);
    }else {
      setRefreshing(true);
      //setLoadingFetch(true);
    }
    //wait(2000).then(() => setRefreshing(false));
  });

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);
      } catch (error) {
        alert(error);
      } finally {

      }
    }
  }

  useEffect(() => {
    //getLoginData();
    setDataLogin(props.route.params.dataLogin);
    // console.log(props.route.params.dataLogin);

    return () => {
      setLoading(false);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      setDataSource();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  useEffect(() => {
    if(dataJadwal.length > 0) {
      setDataParamsCheck();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataJadwal, reqCheckin, currentState]);

  useEffect(() => {
    if(dataJadwal.length > 0) {
      setDataParamsCheck();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[reqCheckout]);

  useEffect(() => {
    if(currentState === 'ONSITE') {
      setLoadingFetch(true);
      getCurrentReport();
      setLoadingFetch(false);
    }

    return () => {
      setLoadingFetch(false)
    }
  },[currentState]);

  function handleBackButtonClick() {
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    
    const unsubscribe = props.navigation.addListener('transitionEnd', (e) => {
      props.route.params.onRefresh()
    });

    return () => {
      unsubscribe;
      BackHandler.removeEventListener('hardwareBackPress', handleBackButtonClick);
    }
  }, [props.navigation]);

  const setDataSource = async () => {
    await setDataJadwal(props.route.params.dataJadwal);
    await setCurrentState(props.route.params.dataJadwal[0].order_state);
    await setLoading(false);
  }

  async function getCurrentReport() {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      id_jadwal: dataJadwal[0].id_jadwal,
      id_paket: dataJadwal[0].id_paket,
      id_detail: dataJadwal[0].id_detail,
      token: dataLogin.token
    });

    success = await formValidation.getCurrentReport(params);

    if(success.status === true) {
      if(success.res.responseCode === '000') {
        await setDataReport(success.res.data);
      }
    }
    return(true);
  }

  async function getCurrentSchedule() {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_jadwal: dataJadwal[0].id_jadwal,
      id_paket: dataJadwal[0].id_paket,
      id_detail: dataJadwal[0].id_detail,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getJadwalAktif(params);
    
    if(success.status === true) {
      if(success.res.responseCode === '000') {
        return(success.res.data);
      }
    }
    return(true);
  }

  const setDataParamsCheck = async () => {
    let data = [];
    data.push({
      setWaiting: setWaiting,
      goCheckIn: goCheckIn,
      id_jadwal: dataJadwal[0].id_jadwal,
      id_paket: dataJadwal[0].id_paket,
      id_detail: dataJadwal[0].id_detail,
      checkTiming: checkTiming,
      reqCheckin: reqCheckin,
      reqCheckout: reqCheckout,
      id_listener: dataJadwal[0].id_pasien,
      currentState: currentState
    });
    setParamsCheck(data);
    //alert(JSON.stringify(data));
  }

  const handleCheckIn = async () => {
    setLoadingFetch(true);
    let timing = await checkTiming();
    if(timing) {
      success = await reqCheckIn();
      success ? setReqCheckin(true) : setReqCheckin(false);
    }
    setLoadingFetch(false);
  }

  const setWaiting = async (type, value) => {
    if(type !== undefined && value !== undefined) {
      setLoadingFetch(false);
    }
  }

  //cek timing saat nakes checkin, minimal 10 menit sebelum jadwal kunjungan
  const checkTiming = async () => {
    let today = new Date();
    const resJadwal = dataJadwal;

    let sched = moment(resJadwal[0].order_date, 'YYYY-MM-DD').format('MM/DD/YYYY') + ' ' + resJadwal[0].order_start_time;
    let schedTime = new Date(sched);
    let diff = (Math.floor(((today-schedTime))/(1000*60)));

    if(diff < -10) {
      formValidation.showError('Check-in minimal 10 menit sebelum waktu kunjungan.');
      setLoadingFetch(false);
      return false;
    }else if(diff > 30) {
      formValidation.showError('Anda sudah melewati batas waktu Check-in (maksimal 30 menit dari jadwal kunjungan).');
      setLoadingFetch(false);
      return false;
    }else {
      return true;
    }
  }

  const reqCheckIn = async () => {
    //setLoadingFetch(true);

    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_jadwal: dataJadwal[0].id_jadwal,
      id_paket: dataJadwal[0].id_paket,
      id_pasien: dataJadwal[0].id_pasien,
      id_detail: dataJadwal[0].id_detail,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token,
      notif_type: 'checkin'
    });

    success = await formValidation.reqCheckIn(params);
    
    if(success.status === true) {
      if(success.res.responseCode === '000') {
        await setCheckinTime(success.res.check_in_time);
        //setLoadingFetch(false);

        //send notif
        success = await formValidation.sendNotif(params);

        if(success.status === true) {
          return true;
        }else {
          return true;
        }

      }else {
        //setLoadingFetch(false);
        return false;
      }
    }

    //setLoadingFetch(false);
  }

  const checkIn = async () => {
    setLoadingFetch(true);

    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_jadwal: dataJadwal[0].id_jadwal,
      id_paket: dataJadwal[0].id_paket,
      id_detail: dataJadwal[0].id_detail,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.checkIn(params);
    
    if(success.status ===  true) {
      if(success.res.responseCode === '000') {
        await setCheckinTime(success.res.check_in_time);
        await setLoadingFetch(false);
        return true;
      }else {
        await setLoadingFetch(false);
        return false;
      }
    }

    setLoadingFetch(false);
  }

  const goCheckIn = async (params) => {
    success = await checkIn(params);

    if(success) {
      await AsyncStorage.setItem('jadwalAktif', dataJadwal[0].id_jadwal);
      await AsyncStorage.setItem('id_paket', dataJadwal[0].id_paket);
      dataJadwal[0].id_detail !== null ? await AsyncStorage.setItem('id_detail', dataJadwal[0].id_detail) : '';
      await setReqCheckin(true);
      await setCurrentState('ONSITE');
    }
  }

  const checkOut = async () => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_jadwal: dataJadwal[0].id_jadwal,
      id_paket: dataJadwal[0].id_paket,
      id_detail: dataJadwal[0].id_detail,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.checkOut(params);

    if(success.status === true) {
      if(success.res.responseCode === '000') {
        await setReqCheckout(true);
        await setCheckoutTime(success.res.check_out_time);
        return true;
      }else {
        return false;
      }
    }else {
      return false;
    }
  }

  const onCheckout = async () => {
    if(!dataReport) {
      openLaporan();
    }else {
      await setLoadingFetch(true);
      success = await checkOut();
      //alert(success); return;

      if(success === true) {
        const dataPendingTrx = await getCurrentSchedule();
        await AsyncStorage.removeItem('jadwalAktif');
        await setLoadingFetch(false);
        props.navigation.navigate('antrianTrx', { base_url: props.route.params.base_url, id_jadwal: dataPendingTrx[0].id_jadwal, dataPendingTrx: dataPendingTrx, dataLogin: dataLogin });
      }

      await setLoadingFetch(false);
    }
  }

  const openLaporan = () => {
    props.navigation.navigate('laporanInput', { base_url: props.route.params.base_url, dataLogin: dataLogin, dataJadwal: dataJadwal, dataReport: dataReport, onRefresh: onRefresh });
  }

  function RenderJadwal() {
    const newItems = dataJadwal;
    //alert(JSON.stringify(newItems));
    if(newItems) {
      return newItems.map((item) => {
        return (
          <View key={item.id_jadwal + item.id_detail}>
            <Text style={styles.label}>User</Text>
            <Text style={styles.label1}>{item.client}</Text>
            <Text style={styles.label}>Pasien</Text>
            <Text style={styles.label1}>{item.service_user === 'self' ? item.client : item.nama_kerabat}</Text>
            <Text style={styles.label}>Jadwal</Text>
            <Text style={styles.label1}>{moment(item.order_date, "YYYY-MM-DD").format("dddd") + ', ' + moment(item.order_date, "YYYY-MM-DD").format("DD/MM/YY") + ', ' + item.order_start_time.replace(":00:00", ".00") + ' wib'}</Text>
            <Text style={styles.label}>Layanan</Text>
            <Text style={styles.label1}>{"Visit " + item.order_type}</Text>
            <Text style={styles.label}>Alamat</Text>
            <Text style={styles.label1}>{item.destination_address}</Text>
            {currentState !== 'ONSITE'?
              <>
                <Petapasien style={styles.mapspasien} lat={parseFloat(item.lat)} lon={parseFloat(item.lon)}></Petapasien>
                <TblCheckin
                  style={styles.btncheckin}
                  handleCheckIn={handleCheckIn}
                  reqCheckin={reqCheckin}
                  order_state={item.order_state}
                  currentState={currentState}
                />
              </>
              :<></>
            
            }
            {/*<Listener
              setWaiting={setWaiting}
              goCheckIn={goCheckIn}
              id_jadwal={item.id_jadwal}
              id_paket={item.id_paket}
              id_detail={item.id_detail}
              checkTiming={checkTiming}
              reqCheckin={reqCheckin}
              id_listener={item.id_pasien}
              currentState={currentState}
            />*/}
            {currentState === 'ONSITE' ?
              <Isilaporan style={styles.inputlaporan} action="report" openLaporan={openLaporan} />
              :
              <></>
            }
            {currentState === 'ONSITE' && dataReport ?
              <Isilaporan style={styles.inputlaporan} action="checkout" onCheckout={onCheckout} />
              :
              <></>
            }
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
    !loading ?
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <Spinner
                  visible={loadingFetch}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#236CFF"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
            <Transaksihead style={styles.transaksihead} props={props} />
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
                  <View style={styles.scrollArea}>
                      <Icon name="map-marker-radius" style={styles.icon1}></Icon>
                      <Text style={styles.text}>{currentState !== 'ONSITE' ? 'CHECK-IN' : currentState}</Text>

                      <RenderJadwal />
                  </View>
                </View>
              </View>
            </ScrollView>
            <View>
              <Footer style={styles.footer1} props={props} paramsCheck={paramsCheck} />
            </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    :
    <>
      <Loader
        visible={loading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: '25%',
    backgroundColor: "white",
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
  transaksihead: {
    height: 75
  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0,
    padding: '2%'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  icon1: {
    color: "rgba(65,170,223,1)",
    fontSize: 50,
    marginTop: 21,
    alignSelf: "center"
  },
  text: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    alignSelf: 'center'
  },
  label: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    fontSize: 14,
    marginTop: 14
  },
  label1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 16,
    marginTop: 1
  },
  mapspasien: {
    height: 188,
    marginTop: 20,
    marginLeft: 18,
    marginRight: 18
  },
  btncheckin: {
    height: 44,
    marginTop: 22,
    marginLeft: 18,
    marginRight: 18
  },
  inputlaporan: {
    height: 44,
    marginTop: 19,
    marginLeft: 18,
    marginRight: 18
  },
  footer1: {
    position: "absolute",
    left: 0,
    height: 91,
    right: 0,
    bottom: 0
  },
  scrollAreaStack: {
    height: 'auto',
    flex: 1
  }
});

export default Checkin;
