import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView,
  BackHandler, ScrollView, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';

import Petapasien from "../../components/Petapasien";
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment/min/moment-with-locales';
// import 'moment/locale/id';
import Loader from '../../components/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FooterListener from '../../FooterListener';
import { CommonActions } from '@react-navigation/native';

export default function Checkin(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

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
    success = await formValidation.getCurrentLoginData();

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
    getLoginData();
    // setDataLogin(props.route.params.dataLogin);
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
      base_url: formValidation.base_url,
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
      base_url: formValidation.base_url,
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
    await setLoadingFetch(true);
    let timing = await checkTiming();
    if(timing) {
      success = await reqCheckIn();
      success ? setReqCheckin(true) : setReqCheckin(false);
    }
    await setLoadingFetch(false);
    refRBSheet.current.close();
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
      base_url: formValidation.base_url,
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
      base_url: formValidation.base_url,
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
      base_url: formValidation.base_url,
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
        // props.navigation.navigate('antrianTrx', { base_url: formValidation.base_url, id_jadwal: dataPendingTrx[0].id_jadwal, dataPendingTrx: dataPendingTrx, dataLogin: dataLogin });

        props.navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {
                name: 'MainApp',
                params: { base_url: formValidation.base_url },
              },
              {
                name: 'antrianTrx',
                params: { base_url: formValidation.base_url, id_jadwal: dataPendingTrx[0].id_jadwal, dataPendingTrx: dataPendingTrx, dataLogin: dataLogin },
              }
            ],
          })
        )
      }

      await setLoadingFetch(false);
    }
  }

  const openLaporan = () => {
    props.navigation.navigate('laporanInput', { base_url: formValidation.base_url, dataLogin: dataLogin, dataJadwal: dataJadwal, dataReport: dataReport, onRefresh: onRefresh });
  }

  function RenderJadwal() {
    const newItems = dataJadwal;
    //alert(JSON.stringify(newItems));
    if(newItems) {
      return newItems.map((item) => {
        return (
          <View key={item.id_jadwal + item.id_detail}>
            <View style={styles.wrapperCardAtas}>
              <View style={styles.Group378}>
                <View style={styles.Jenis_layanan_kiri}>
                  <Text style={styles.Txt319}>Kategori Layanan</Text>
                  <Text style={styles.Txt656}>{"Visit " + item.order_type}</Text>
                </View>
                <View style={styles.Jenis_layanan_kanan}>
                  <Text style={styles.Txt319}>Jenis Layanan</Text>
                  <Text style={styles.Txt656}>{item.id_paket === '1' ? 'REGULER' : 'KHUSUS'}</Text>
                </View>
              </View>
              <View style={styles.Group378}>
                <View style={styles.Jenis_layanan_kiri}>
                  <Text style={styles.Txt319}>Nama Pasien</Text>
                  <Text style={styles.Txt656}>
                    {item.service_user === 'self' ? item.client : item.nama_kerabat}
                  </Text>
                </View>
                <View style={styles.Jenis_layanan_kanan}>
                  <Text style={styles.Txt319}>Metode Pembayaran</Text>
                  <Text style={styles.Txt656}>{item.payment_type}</Text>
                </View>
              </View>
              <View style={styles.Group378}>
                <View style={styles.Jenis_layanan_kiri}>
                  <Text style={styles.Txt319}>Kode Booking</Text>
                  <Text style={styles.Txt656}>{item.booking_code}</Text>
                </View>
                <View style={styles.Jenis_layanan_kanan}>
                  <Text style={styles.Txt319}>Tarif Layanan</Text>
                  <Text style={styles.Txt656}>{formValidation.currencyFormat(item.total_price)}</Text>
                </View>
              </View>
            </View>
            <View style={styles.wrapperLingkaran}>
              <View style={styles.wrapperLingkaranKiriKanan} />
              <View style={styles.wrapperLingkaranKiriKanan} />
            </View>
            <View style={styles.wrapperCardBawah}>
              <View style={styles.Jadwal1}>
                <Text style={styles.Txt091}>Jadwal Reservasi</Text>
                <Text style={styles.Txt710}>{moment(item.order_date, "YYYY-MM-DD").format("dddd") + ', ' + moment(item.order_date, "YYYY-MM-DD").format("DD/MM/YY") + ', ' + item.order_start_time.replace(":00:00", ".00") + ' WIB'}</Text>
              </View>

              <View style={styles.Jadwal1}>
                <Text style={styles.Txt091}>Alamat Client/Pasien</Text>
                <Text style={styles.Txt710}>
                  {item.destination_address}
                </Text>
              </View>
            </View>

            {currentState !== 'ONSITE'?
              <>
                <View style={styles.wrapperPeta}>
                  <Petapasien style={styles.mapspasien} lat={parseFloat(item.lat)} lon={parseFloat(item.lon)}></Petapasien>
                </View>
                
                {/*<TblCheckin
                  style={styles.btncheckin}
                  handleCheckIn={handleCheckIn}
                  reqCheckin={reqCheckin}
                  order_state={item.order_state}
                  currentState={currentState}
                />*/}

                <View style={styles.Group546}>
                  <Text style={styles.Txt484}>KONFIRMASI CHECK-IN</Text>
                  <View style={styles.Group814}>
                    <TouchableOpacity
                      style={[styles.Tbl_bertemu, {flex: 1}]}
                      onPress={() => refRBSheet.current.open()}>
                      <View style={styles.Tbl_iconPanah}>
                        <Icons label="Panah" name="enter" />
                      </View>
                      <Text style={styles.Txt981}>SUDAH TIBA</Text>
                      <Text style={styles.Txt981}>DI LOKASI PASIEN</Text>
                    </TouchableOpacity>
                    {/*<TouchableOpacity
                      style={styles.Tbl_live_cam}
                      onPress={() => props.navigation.navigate('KonfirmasiVCall')}>
                      <View style={styles.Tbl_iconPanah}>
                        <Icons label="Panah" name="camera" />
                      </View>
                      <Text style={styles.Txt981}>LIVE </Text>
                      <Text style={styles.Txt981}>CAMERA</Text>
                    </TouchableOpacity>*/}
                  </View>
                </View>
              </>
              :<></>
            
            }

            {currentState === 'ONSITE' ?
              <View style={styles.Group546}>
                <View style={styles.Group814}>
                  <TouchableOpacity
                    style={styles.Tbl_bertemu}
                    onPress={openLaporan}>
                    <View style={styles.Tbl_iconPanah}>
                      <Icons label="Panah" name="document-text" />
                    </View>
                    <Text style={styles.Txt981}>{dataReport ? 'LIHAT LAPORAN' : 'ISI LAPORAN'}</Text>
                    <Text style={styles.Txt981}>KUNJUNGAN</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.Tbl_live_cam}
                    onPress={onCheckout}>
                    <View style={styles.Tbl_iconPanah}>
                      <Icons label="Panah" name="exit" />
                    </View>
                    <Text style={styles.Txt981}>SELESAIKAN</Text>
                    <Text style={styles.Txt981}>KUNJUNGAN</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
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

  const refRBSheet = useRef();

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
          }}
          name={name}
        />
      );
    }
  };

  return (
    !loading ?
    <SafeAreaView style={styles.containerKey}>
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
            <View
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                paddingTop: 10,
              }}>

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

                <View style={styles.wrapperHeader}>
                  <View style={styles.Group378}>
                    <Text style={[styles.Txt319, {fontWeight: 'bold'}]}>{currentState !== 'ONSITE' ? 'CHECK-IN' : currentState}</Text>
                  </View>
                </View>

                <RenderJadwal />
                
                <RBSheet
                  ref={refRBSheet}
                  closeOnDragDown={false}
                  closeOnPressMask={false}
                  animationType="fade"
                  customStyles={{
                    wrapper: {
                      backgroundColor: 'transparent',
                    },
                    container: {
                      backgroundColor: 'rgba(36,195,142,1)',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      height: '30%',
                    },
                    draggableIcon: {
                      backgroundColor: 'transparent',
                    },
                  }}>
                  <View style={styles.Email_bantuan}>
                    <Spinner
                      visible={loadingFetch}
                      textContent={''}
                      textStyle={styles.spinnerTextStyle}
                      color="#236CFF"
                      overlayColor="rgba(255, 255, 255, 0.5)"
                    />
                    <View style={styles.wrapperJangan}>
                      <View style={styles.Kirim_email}>
                        <Text style={styles.multiple}>Konfirmasi Check-In</Text>
                        <Text style={styles.multiple1}>
                          Pastikan anda telah tiba di lokasi kunjungan dan bertemu dengan pasien.
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                        <View style={styles.Tbl_iconPanah}>
                          <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={() => {
                          handleCheckIn();
                        }}>
                        <View style={styles.Btn_tambah}>
                          <Text style={styles.Txt6105}>MULAI KUNJUNGAN</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>
              </ScrollView>
            </View>
          </>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <FooterListener props={props} paramsCheck={paramsCheck} />
    </SafeAreaView>
    :
    <>
      <Loader
        visible={loading}
      />
    </>
  );
}

const styles = StyleSheet.create({
  containerKey: {
    flex: 1,
    backgroundColor: "white"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  wrapperPeta: {
    padding: '2%',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
    //height: 200,
    backgroundColor: 'rgba(217,217,217,1)',
  },
  mapspasien: {
    height: 188,
    //borderRadius: 10,
    //padding: '2%'
  },

  Txt656: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
  },
  Txt319: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(54,54,54,1)',
  },

  Jenis_layanan_kiri: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '50%',
    maxWidth: '50%',
  },
  Jenis_layanan_kanan: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '50%',
    maxWidth: '50%',
  },

  Jadwal1: {
    flexDirection: 'column',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  Txt710: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Txt7101: {
    marginTop: 20,
    fontSize: 12,
    marginHorizontal: 15,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(239,70,62,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },
  Txt091: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(54,54,54,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Group378: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  wrapperHeader: {
    marginBottom: 10,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(217,217,217,1)',
  },

  wrapperCardAtas: {
    marginBottom: -15,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: 'rgba(217,217,217,1)',
  },
  wrapperCardBawah: {
    marginTop: -14,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: 'rgba(217,217,217,1)',
  },

  wrapperLingkaran: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 1, //For iOS
    elevation: 1,
  },
  wrapperLingkaranKiriKanan: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },

  Group546: {
    flexDirection: 'column',
    paddingTop: 20,
    marginHorizontal: 20,
  },
  Txt484: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,1)',
    textAlign: 'center',
    marginBottom: 9,
  },
  Group814: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  Tbl_bertemu: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: 19,
    paddingBottom: 9,
    borderRadius: 10,
    width: '45%',
    backgroundColor: 'rgba(251,176,64,1)',
  },

  Txt981: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },
  Tbl_live_cam: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 19,
    paddingBottom: 9,
    borderRadius: 10,
    width: '45%',
    backgroundColor: 'rgba(36,195,142,1)',
  },

  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 100,
    marginBottom: 10,
    width: 50,
    height: 50,
  },
  User: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 20,
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
  IconHeader: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 169, 221, 1)',
    borderRadius: 100,
    width: 30,
    height: 30,
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
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 4,
  },
  Txt681: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
    paddingRight: 25,
  },
  Txt2541: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 16,
    color: 'rgba(0,32,51,1)',
    marginBottom: 4,
  },
  Txt6811: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(0,32,51,1)',
    paddingRight: 25,
  },
  Email_bantuan: {
    display: 'flex',
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'column',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
  },
  wrapperJangan: {
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
  },
  Kirim_email: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
  },
  multiple: {
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
  multiple1: {
    paddingTop: 20,
    fontSize: 12,
    //fontFamily: 'Inter, sans-serif',
    fontWeight: '400',
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 1)',
  },
  Btn_tambah: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    marginHorizontal: 50,
    backgroundColor: 'rgba(54,54,54,1)',
    height: 40,
  },
  Txt6105: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },

  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 100,
    marginBottom: 10,
    marginTop: -10,
    width: 30,
    height: 30,
  },
});
