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
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator, RefreshControl
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import Clipboard from '@react-native-clipboard/clipboard';
import {TabView, SceneMap, TabBar} from 'react-native-tab-view';
import {Header} from '../../components';

import Icon from 'react-native-vector-icons/Ionicons';
import Btnselesai from "../../components/Btnselesai";
import Btnbatal from "../../components/Btnbatal";
import Btnmenunggu from "../../components/Btnmenunggu";
import Btnbooking from "../../components/Btnbooking";
import Footer from "../../components/Footer";
import Tabtransaksi from "../../components/Tabtransaksi";
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment/min/moment-with-locales';
//import 'moment/locale/id';

export default function Reservasi(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');
  
  const [dataLogin, setDataLogin] = useState('');
  //const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  const [dataReservasi, setDataReservasi] = useState([]);
  const [dataPendingTrx, setDataPendingTrx] = useState([]);
  const [dataCloseTrx, setDataCloseTrx] = useState([]);
  const [dataCancelTrx, setDataCancelTrx] = useState([]);
  const [activeTab, setActiveTab] = useState('booking');

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [bookingPage, setBookingPage] = useState(0);
  const [shouldFecthBooking, setShouldFetchBooking] = useState(false);
  const [pendingPage, setPendingPage] = useState(0);
  const [shouldFetchPending, setShouldFetchPending] = useState(false);
  const [closePage, setClosePage] = useState(0);
  const [shouldFetchClose, setShouldFetchClose] = useState(false);
  const [cancelPage, setCancelPage] = useState(0);
  const [shouldFetchCancel, setShouldFetchCancel] = useState(false);

  const [fetchBooking, setFetchBooking] = useState(false);
  const [fetchPending, setFetchPending] = useState(false);
  const [fetchClose, setFetchClose] = useState(false);
  const [fetchCancel, setFetchCancel] = useState(false);

  //const fetchMoreCancel = useCallback(() => setShouldFetchCancel(false), []);
  //params for pagination

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback((val) => {
    setRefreshing(true);
    // val === undefined ? val = activeTab:'';
    // let success = '';
    // switch(val) {
    //   case 'booking':
    //     success = await getReservation();
    //     break;
    //   case 'antrian':
    //     success = await getPendingTrx();
    //     break;
    //   case 'selesai':
    //     success = await getCloseTrx();
    //     break;
    //   case 'batal':
    //     success = await getCancelTrx();
    //     break;
    // }

    // !success ? setRefreshing(false):'';
    // setLoadingFetch(success)

    // return () => {
    //   setRefreshing(false);
    // }
    if(val !== '') {
      refetchData(val);
    }else {
      if(dataLogin) {
        setCurrentDataNakes();
      }
    }

    wait(2000).then(() => setRefreshing(false));
  },[]);

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

  const onChangeTab = async (ev) => {
    //if(ev !== activeTab) {
      //setLoadingFetch(true);
      setActiveTab(ev);
      refetchData(ev);
    //}
  }

  async function refetchData(e){
    if (e === 'booking') {
      setBookingPage(0);
      setDataReservasi([]);
      setFetchBooking(true);
    }else if(e === 'antrian') {
      setPendingPage(0);
      setDataPendingTrx([]);
      setFetchPending(true);
    }else if(e === 'selesai') {
      setClosePage(0);
      setDataCloseTrx([]);
      setFetchClose(true);
    }else if(e === 'batal') {
      setCancelPage(0);
      setDataCancelTrx([]);
      setFetchCancel(true);
    }
  }

  useEffect(() => {
    getLoginData();
    //setDataLogin(props.route.params.dataLogin);
    // console.log(props.route.params.dataLogin);

    return () => {
      setLoadingFetch(false);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      setCurrentDataNakes();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  // useEffect(() => {
  //   if(dataLogin) {
  //     if(loadingFetch) {
  //       onRefresh(activeTab);
  //     }
  //   }

  //   return () => {
  //     setLoadingFetch(false);
  //   }
  // },[activeTab]);

  useEffect(() => {
    if(fetchBooking) {
      getReservation();
    }

    return () => {
      setFetchBooking(false);
    }
  }, [fetchBooking]);

  useEffect(() => {
    if(fetchPending) {
      getPendingTrx();
    }

    return () => {
      setFetchPending(false);
    }
  }, [fetchPending]);

  useEffect(() => {
    if(fetchClose) {
      getCloseTrx();
    }

    return () => {
      setFetchClose(false);
    }
  }, [fetchClose]);

  useEffect(() => {
    if(fetchCancel) {
      getCancelTrx();
    }

    return () => {
      setFetchCancel(false);
    }
  }, [fetchCancel]);

  /*useEffect(() => {
    if(dataLogin) {
      if(refreshing) {
        switch(activeTab) {
          case 'booking':
            getReservation(false);
            break;
          case 'antrian':
            getPendingTrx(false);
            break;
          case 'selesai':
            getCloseTrx(false);
            break;
          case 'batal':
            getCancelTrx(false);
            break;
        }
      }
    }
  },[refreshing]);*/

  const setCurrentDataNakes = async () => {
    await setLoadingFetch(true);
    //await setActiveTab('booking');

    await getReservation();
    await getPendingTrx();
    await getCloseTrx();
    await getCancelTrx();
    await setLoadingFetch(false);
  }

  async function getReservation() {
    setShouldFetchBooking(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getReservation(params, bookingPage, 10);

    if(success.status === true) {
      try {
        setShouldFetchBooking(false);
        //setDataReservasi(success.res);
        if(success.res !== undefined) {
          setDataReservasi(oldData => [...oldData, ...success.res]);

          setBookingPage(bookingPage + 1);
        }
      } catch (error) {
        alert(error);
      } finally {

      }
    }
    //return(false);
  }

  async function getPendingTrx() {
    setShouldFetchPending(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getPendingTrx(params, pendingPage, 10);

    if(success.status === true) {
      try {
        setShouldFetchPending(false);
        //setDataPendingTrx(success.res);
        if(success.res !== undefined) {
          setDataPendingTrx(oldData => [...oldData, ...success.res]);

          setPendingPage(pendingPage + 1);
        }
      } catch (error) {
        alert(error);
      } finally {

      }
    }
    //return(false)
  }

  async function getCloseTrx() {
    setShouldFetchClose(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getCloseTrx(params, closePage, 10);

    if(success.status === true) {
      try {
        setShouldFetchClose(false);
        //setDataCloseTrx(success.res);
        if(success.res !== undefined) {
          setDataCloseTrx(oldData => [...oldData, ...success.res]);

          setClosePage(closePage + 1);
        }
      } catch (error) {
        alert(error);
      } finally {

      }
    }
    //return(false);
  }

  async function getCancelTrx() {
    setShouldFetchCancel(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getCancelTrx(params, cancelPage, 10);

    if(success.status === true) {
      try {
        setShouldFetchCancel(false);
        //setDataCancelTrx(success.res);
        if(success.res !== undefined) {
          setDataCancelTrx(oldData => [...oldData, ...success.res]);
          
          //increment page for the next call
          setCancelPage(cancelPage + 1);
        }
      } catch (error) {
        alert(error);
      } finally {

      }
    }
    //return(false);
  }

  const openBooking = async(e) => {
    props.navigation.navigate('bookingTrx', { base_url: formValidation.base_url, id_jadwal: e, dataReservasi: dataReservasi, onRefresh: onRefresh, dataLogin: dataLogin, refetchData: refetchData } );
  }

  const openAntrian = async(e) => {
    props.navigation.navigate('antrianTrx', { base_url: formValidation.base_url, id_jadwal: e, dataPendingTrx: dataPendingTrx, dataLogin: dataLogin, refetchData: refetchData } );
  }

  const openSelesai = async(id_jadwal, id_detail, id_paket) => {
    props.navigation.navigate('selesaiTrx', { base_url: formValidation.base_url, id_jadwal: id_jadwal, id_detail: id_detail, id_paket: id_paket, dataCloseTrx: dataCloseTrx, dataLogin: dataLogin, refetchData: refetchData } );
  }

  const openBatal = async(e) => {
    props.navigation.navigate('batalTrx', { base_url: formValidation.base_url, id_jadwal: e, dataCancelTrx: dataCancelTrx, dataLogin: dataLogin, refetchData: refetchData } );
  }

  function Booking() {
    const newItems = dataReservasi;
    //alert(JSON.stringify(newItems));
    if(newItems.length > 0) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_jadwal} onPress={() => openBooking(item.id_jadwal)}>
            <View style={[
              styles.Label_layanan_akhir,
              {backgroundColor: '#43A9DD'}
            ]}>
              {/*<Image
                style={styles.Useravatar}
                source={{
                  uri: 'http://placeimg.com/640/480/any',
                }}
              />*/}
              <IconImage label="image" name="person-circle-outline" />
              <View style={styles.subUser}>
                <Text style={[styles.Txt254, {fontWeight: 'bold'}]}>{item.client}</Text>
                <Text style={[styles.Txt681, {fontWeight: 'bold'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                {item.id_paket === '1' ?
                  <Text style={styles.Txt681}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
                  :
                  <Text style={[styles.Txt681, {fontStyle: 'italic'}]}>Buka pesanan untuk melihat detail jadwal</Text>
                }
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.User}>
          <View style={styles.subUser}>
            <Text style={[styles.Txt681, {fontWeight: 'bold', color: 'rba(0,0,0,1)'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  function Antrian() {
    const newItems = dataPendingTrx;
    //alert(JSON.stringify(newItems));
    if(newItems.length > 0) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_jadwal} onPress={() => openAntrian(item.id_jadwal)}>
            <View style={[
              styles.Label_layanan_akhir,
              {backgroundColor: '#43A9DD'},
            ]}>
              {/*<Image
                style={styles.Useravatar}
                source={{
                  uri: 'http://placeimg.com/640/480/any',
                }}
              />*/}
              <IconImage label="image" name="person-circle-outline" />
              <View style={styles.subUser}>
                <Text style={[styles.Txt254, {fontWeight: 'bold'}]}>{item.client}</Text>
                <Text style={[styles.Txt681, {fontWeight: 'bold'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                <Text style={styles.Txt681}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.User}>
          <View style={styles.subUser}>
            <Text style={[styles.Txt681, {fontWeight: 'bold', color: 'rba(0,0,0,1)'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  function Selesai() {
    const newItems = dataCloseTrx;
    //alert(JSON.stringify(newItems));
    if(newItems.length > 0) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_paket === '1' ? item.id_jadwal : item.id_detail} onPress={() => openSelesai(item.id_jadwal, item.id_detail, item.id_paket)}>
            <View style={[
              styles.Label_layanan_akhir,
              {backgroundColor: '#43A9DD'},
            ]}>
              {/*<Image
                style={styles.Useravatar}
                source={{
                  uri: 'http://placeimg.com/640/480/any',
                }}
              />*/}
              <IconImage label="image" name="person-circle-outline" />
              <View style={styles.subUser}>
                <Text style={[styles.Txt254, {fontWeight: 'bold'}]}>{item.client}</Text>
                <Text style={[styles.Txt681, {fontWeight: 'bold'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                {/*<Text style={[styles.Txt681, {fontWeight: 'bold'}]}>{'Reff. ID : ' + item.id_jadwal}</Text>*/}
                <Text style={[styles.Txt681, {fontWeight: 'bold'}]}>{'Kode Booking : ' + item.booking_code}</Text>
                <Text style={styles.Txt681}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.User}>
          <View style={styles.subUser}>
            <Text style={[styles.Txt681, {fontWeight: 'bold', color: 'rba(0,0,0,1)'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  function Batal() {
    const newItems = dataCancelTrx;
    //alert(JSON.stringify(newItems));
    if(newItems.length > 0) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_jadwal} onPress={() => openBatal(item.id_jadwal)}>
            <View style={[
              styles.Label_layanan_akhir,
              {backgroundColor: '#43A9DD'},
            ]}>
              {/*<Image
                style={styles.Useravatar}
                source={{
                  uri: 'http://placeimg.com/640/480/any',
                }}
              />*/}
              <IconImage label="image" name="person-circle-outline" />
              <View style={styles.subUser}>
                <Text style={[styles.Txt254, {fontWeight: 'bold'}]}>{item.client}</Text>
                <Text style={[styles.Txt681, {fontWeight: 'bold'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                {item.id_paket === '1' ?
                  <Text style={styles.Txt681}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                  :
                  <Text style={[styles.Txt681, {fontStyle: 'italic'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                }
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.User}>
          <View style={styles.subUser}>
            <Text style={[styles.Txt681, {fontWeight: 'bold', color: 'rba(0,0,0,1)'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  function TabJadwal() {
    let tab = '';
    if(activeTab) {
      switch(activeTab) {
        case 'booking':
          return (
            <>
              <Booking />
              {shouldFecthBooking ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
            </>
          )
          break;
        case 'antrian':
          return (
            <>
              <Antrian />
              {shouldFetchPending ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
            </>
          )
          break;
        case 'selesai':
          return (
            <>
              <Selesai />
              {shouldFetchClose ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
            </>
          )
          break;
        case 'batal':
          return (
            <>
              <Batal />
              {shouldFetchCancel ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
            </>
          )
          break;
      }
    }else {
      return (
        <></>
      )
    }
  }

  function FetchData() {
    if(activeTab) {
      switch(activeTab) {
        case 'booking':
          getReservation();
          break;
        case 'antrian':
          getPendingTrx();
          break;
        case 'selesai':
          getCloseTrx()
          break;
        case 'batal':
          getCancelTrx();
          break;
      }
    }
  }

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {key: 'Booking', title: 'Booking'},
    {key: 'Antrian', title: 'Antrian'},
    {key: 'Selesai', title: 'Selesai'},
    {key: 'Batal', title: 'Batal'},
  ]);

  // const Booking = () => (
  //   <ScrollView showsVerticalScrollIndicator={false}>
  //     {dataJadwalLayanan.map((item, index) => {
  //       return (
  //         <TouchableOpacity
  //           onPress={() => props.navigation.navigate('DetailBooking')}
  //           key={index}
  //           style={[
  //             styles.Label_layanan_akhir,
  //             {backgroundColor: 'rgba(0, 125, 189, 1)'},
  //           ]}>
  //           <View style={styles.User}>
  //             <View style={styles.subUser}>
  //               <Image
  //                 style={styles.Useravatar}
  //                 source={{
  //                   uri: 'http://placeimg.com/640/480/any',
  //                 }}
  //               />
  //               <View style={styles.Text}>
  //                 <Text style={styles.Txt254}>Aldiory Xavian Shaquille</Text>
  //                 <Text style={styles.Txt681}>1234567891239545</Text>
  //               </View>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     })}
  //   </ScrollView>
  // );

  // const Antrian = () => (
  //   <ScrollView showsVerticalScrollIndicator={false}>
  //     {dataJadwalLayanan.map((item, index) => {
  //       return (
  //         <TouchableOpacity
  //           onPress={() => props.navigation.navigate('DetailAntrian')}
  //           key={index}
  //           style={[
  //             styles.Label_layanan_akhir,
  //             {backgroundColor: 'rgba(36, 195, 142, 1)'},
  //           ]}>
  //           <View style={styles.User}>
  //             <View style={styles.subUser}>
  //               <Image
  //                 style={styles.Useravatar}
  //                 source={{
  //                   uri: 'http://placeimg.com/640/480/any',
  //                 }}
  //               />
  //               <View style={styles.Text}>
  //                 <Text style={styles.Txt254}>Aldiory Xavian Shaquille</Text>
  //                 <Text style={styles.Txt681}>1234567891239545</Text>
  //               </View>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     })}
  //   </ScrollView>
  // );
  // const Selesai = () => (
  //   <ScrollView showsVerticalScrollIndicator={false}>
  //     {dataJadwalLayanan.map((item, index) => {
  //       return (
  //         <TouchableOpacity
  //           onPress={() => props.navigation.navigate('DetailSelesai')}
  //           key={index}
  //           style={[
  //             styles.Label_layanan_akhir,
  //             {backgroundColor: 'rgba(255, 122, 0, 1)'},
  //           ]}>
  //           <View style={styles.User}>
  //             <View style={styles.subUser}>
  //               <Image
  //                 style={styles.Useravatar}
  //                 source={{
  //                   uri: 'http://placeimg.com/640/480/any',
  //                 }}
  //               />
  //               <View style={styles.Text}>
  //                 <Text style={styles.Txt254}>Aldiory Xavian Shaquille</Text>
  //                 <Text style={styles.Txt681}>1234567891239545</Text>
  //               </View>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     })}
  //   </ScrollView>
  // );

  // const Batal = () => (
  //   <ScrollView showsVerticalScrollIndicator={false}>
  //     {dataJadwalLayanan.map((item, index) => {
  //       return (
  //         <TouchableOpacity
  //           onPress={() => props.navigation.navigate('DetailBatal')}
  //           key={index}
  //           style={[
  //             styles.Label_layanan_akhir,
  //             {backgroundColor: 'rgba(255, 0, 0, 1)'},
  //           ]}>
  //           <View style={styles.User}>
  //             <View style={styles.subUser}>
  //               <Image
  //                 style={styles.Useravatar}
  //                 source={{
  //                   uri: 'http://placeimg.com/640/480/any',
  //                 }}
  //               />
  //               <View style={styles.Text}>
  //                 <Text style={styles.Txt254}>Aldiory Xavian Shaquille</Text>
  //                 <Text style={styles.Txt681}>1234567891239545</Text>
  //               </View>
  //             </View>
  //           </View>
  //         </TouchableOpacity>
  //       );
  //     })}
  //   </ScrollView>
  // );

  // const renderTabBar = props => (
  //   <TabBar
  //     {...props}
  //     renderLabel={({route, focused, color}) => (
  //       <Text style={styles.Txt616(focused, color)}>{route.title}</Text>
  //     )}
  //     indicatorStyle={{
  //       backgroundColor: 'rgba(0, 125, 189, 1)',
  //     }}
  //     activeColor="rgba(0, 125, 189, 1)"
  //     inactiveColor="rgba(79, 92, 99, 1)"
  //     style={{
  //       backgroundColor: 'rgba(255, 255, 255, 1)',
  //       marginBottom: 10,
  //     }}
  //   />
  // );

  // const dataJadwalLayanan = [
  //   {
  //     key: '1',
  //     layanan: 'Fisioterapi',
  //     jadwal: '12/05/2022',
  //     status: 'Aktif',
  //   },
  //   {
  //     key: '2',
  //     layanan: 'Fisioterapi',
  //     jadwal: '12/05/2022',
  //     status: 'Aktif',
  //   },
  //   {
  //     key: '3',
  //     layanan: 'Fisioterapi',
  //     jadwal: '12/05/2022',
  //     status: 'Aktif',
  //   },
  // ];

  const IconImage = ({label, name}) => {
    return <Icon style={{color: 'rgba(255,255,255,1)', fontSize: 60, alignSelf: 'center'}} name={name} />;
  };

  return (
  <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.containerKey}
      >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <Spinner
            visible={loadingSave}
            textContent={''}
            textStyle={styles.spinnerTextStyle}
            color="#236CFF"
            overlayColor="rgba(255, 255, 255, 0.5)"
          />
          <SafeAreaView style={styles.container}>
            <View
              style={styles.Beranda}
              onLayout={event => setLayout(event.nativeEvent.layout)}>
              {/*<View style={styles.User}>
                <View style={styles.subUser}>
                  {dataLogin ?
                  <Header name="reservasi" props={props} dataLogin={dataLogin} thumbProfile={dataLogin.thumbProfile}/>
                  :
                  <View style={styles.User} />
                }
                </View>
              </View>*/}

              <View style={styles.group5}>
                <Tabtransaksi style={styles.tabtransaksi} activeTab={activeTab} onChangeTab={onChangeTab} />
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
                onScrollEndDrag={FetchData}
                /*refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }*/
              >

                {/*<TabView
                  navigationState={{index, routes}}
                  renderScene={SceneMap({
                    Booking,
                    Antrian,
                    Selesai,
                    Batal,
                  })}
                  onIndexChange={setIndex}
                  renderTabBar={renderTabBar}
                />*/}

                {!loadingFetch ?
                  <TabJadwal />
                  :
                  <Spinner
                    visible={loadingFetch}
                    textContent={''}
                    textStyle={styles.spinnerTextStyle}
                    color="#236CFF"
                    overlayColor="rgba(255, 255, 255, 0.5)"
                  />
                }

              </ScrollView>
            </View>
          </SafeAreaView>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  group5: {
    // height: 50,
    // padding: '2%',
    // paddingLeft: '5%',
    // paddingRight: '5%'
    borderBottomWidth: 4,
    borderColor: 'rgba(54,54,54,1)',
  },
  tabtransaksi: {
    // height: 56,
    // marginTop: 0
  },
  containerKey: {
    flex: 1,
    backgroundColor: 'rgba(54,54,54,1)',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
    paddingBottom: '5%'
  },

  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  Beranda: {
    flex: 1,
    flexDirection: 'column',
    // paddingHorizontal: 25,
  },

  User: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    //alignItems: 'flex-start',
    padding: '2%',
    borderBottomWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.5)'
  },
  subUser: {
    marginLeft: '2%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },

  Txt254: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    lineHeight: 16,
    color: 'rgba(255, 255, 255, 1)',
    marginBottom: 4,
  },
  Txt681: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'justify',
    marginBottom: 4,
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

  Jadwal_menunggu: layout => ({
    justifyContent: 'space-between',
    borderRadius: 20,
    width: layout.width - 50,
    height: '100%',
    maxHeight: '100%',
  }),
  wrapperTabView: {height: '30%'},

  Lbl_layanan: {
    paddingTop: 2,
    borderRadius: 10,
    width: '30%',
    height: 20,
  },
  Lbl_layanan_isi: {
    paddingTop: 2,
    borderRadius: 10,
    width: '30%',
    height: 20,
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

  Label_layanan_akhir: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    // paddingHorizontal: 10,
    // paddingVertical: 10,
    padding: '2%',
    borderBottomWidth: 0.8,
    borderColor: 'rgba(255, 255, 255, 0.5)'
    // marginTop: 5,
    // borderRadius: 10,
  },

  Txt616: (focused, color) => ({
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: color,
    textAlign: 'left',
  }),

  videoPreview: item => ({
    flexDirection: 'row',
    width: 240,
    height: 120,
    marginHorizontal: 5,
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
  Txt2541: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 16,
    color: 'rgba(0,32,51,1)',
    marginBottom: 4,
  },
});
