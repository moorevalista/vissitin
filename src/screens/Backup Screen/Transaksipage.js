import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text, RefreshControl,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from "react-native";
import Transaksihead from "../components/Transaksihead";
import Btnselesai from "../components/Btnselesai";
import Btnbatal from "../components/Btnbatal";
import Btnmenunggu from "../components/Btnmenunggu";
import Btnbooking from "../components/Btnbooking";
import Footer from "../components/Footer";
import Tabtransaksi from "../components/Tabtransaksi";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import 'moment/locale/id';

function Transaksipage(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  //const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [dataReservasi, setDataReservasi] = useState([]);
  const [dataPendingTrx, setDataPendingTrx] = useState([]);
  const [dataCloseTrx, setDataCloseTrx] = useState([]);
  const [dataCancelTrx, setDataCancelTrx] = useState([]);
  const [activeTab, setActiveTab] = useState('');

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

  //const fetchMoreCancel = useCallback(() => setShouldFetchCancel(false), []);
  //params for pagination

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(async(val) => {
    setRefreshing(true);
    val === undefined ? val = activeTab:'';
    let success = '';
    switch(val) {
      case 'booking':
        success = await getReservation();
        break;
      case 'antrian':
        success = await getPendingTrx();
        break;
      case 'selesai':
        success = await getCloseTrx();
        break;
      case 'batal':
        success = await getCancelTrx();
        break;
    }

    !success ? setRefreshing(false):'';
    setLoadingFetch(success)

    return () => {
      setRefreshing(false);
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

  const onChangeTab = async (ev) => {
    if(ev !== activeTab) {
      setLoadingFetch(true);
      setActiveTab(ev);
    }
  }

  useEffect(() => {
    //getLoginData();
    setDataLogin(props.route.params.dataLogin);
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

  useEffect(() => {
    if(dataLogin) {
      if(loadingFetch) {
        onRefresh(activeTab);
      }
    }

    return () => {
      setLoadingFetch(false);
    }
  },[activeTab]);

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
    await setActiveTab('booking');
  }

  async function getReservation() {
    setShouldFetchBooking(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
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
    return(false);
  }

  async function getPendingTrx() {
    setShouldFetchPending(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
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
    return(false)
  }

  async function getCloseTrx() {
    setShouldFetchClose(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
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
    return(false);
  }

  async function getCancelTrx() {
    setShouldFetchCancel(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
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
    return(false);
  }

  const openBooking = async(e) => {
    props.navigation.navigate('bookingTrx', { base_url: props.route.params.base_url, id_jadwal: e, dataReservasi: dataReservasi, onRefresh: onRefresh, dataLogin: dataLogin } );
  }

  const openAntrian = async(e) => {
    props.navigation.navigate('antrianTrx', { base_url: props.route.params.base_url, id_jadwal: e, dataPendingTrx: dataPendingTrx, dataLogin: dataLogin } );
  }

  const openSelesai = async(id_jadwal, id_detail, id_paket) => {
    props.navigation.navigate('selesaiTrx', { base_url: props.route.params.base_url, id_jadwal: id_jadwal, id_detail: id_detail, id_paket: id_paket, dataCloseTrx: dataCloseTrx, dataLogin: dataLogin } );
  }

  const openBatal = async(e) => {
    props.navigation.navigate('batalTrx', { base_url: props.route.params.base_url, id_jadwal: e, dataCancelTrx: dataCancelTrx, dataLogin: dataLogin } );
  }  

  function Booking() {
    const newItems = dataReservasi;
    //alert(JSON.stringify(newItems));
    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_jadwal} style={styles.listJadwal} onPress={() => openBooking(item.id_jadwal)}>
            <View style={styles.rect}>
              <View style={styles.arielTatum1Row}>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold'}]}>{item.client}</Text>
                <Btnbooking style={styles.button} />
              </View>
              <View style={styles.arielTatum2Row}>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold', color: '#FF4242'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                {item.id_paket === '1' ?
                  <Text style={styles.arielTatum1}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                  :
                  <Text style={[styles.arielTatum2, {fontStyle: 'italic'}]}>Buka pesanan untuk melihat detail jadwal</Text>
                }
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.rect}>
          <View style={styles.arielTatum1Row}>
            <Text style={[styles.arielTatum1, {fontWeight: 'bold'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  function Antrian() {
    const newItems = dataPendingTrx;
    //alert(JSON.stringify(newItems));
    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_jadwal} style={styles.listJadwal} onPress={() => openAntrian(item.id_jadwal)}>
            <View style={styles.rect}>
              <View style={styles.arielTatum1Row}>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold'}]}>{item.client}</Text>
                <Btnmenunggu style={styles.button} />
              </View>
              <View style={styles.arielTatum2Row}>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold', color: '#FF4242'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold', color: '#2A8CD1'}]}>{'Reff. ID : ' + item.id_jadwal}</Text>
                <Text style={styles.arielTatum1}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.rect}>
          <View style={styles.arielTatum1Row}>
            <Text style={[styles.arielTatum1, {fontWeight: 'bold'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  function Selesai() {
    const newItems = dataCloseTrx;
    //alert(JSON.stringify(newItems));
    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_paket === '1' ? item.id_jadwal : item.id_detail} style={styles.listJadwal} onPress={() => openSelesai(item.id_jadwal, item.id_detail, item.id_paket)}>
            <View style={styles.rect}>
              <View style={styles.arielTatum1Row}>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold'}]}>{item.client}</Text>
                <Btnselesai style={styles.button} />
              </View>
              <View style={styles.arielTatum2Row}>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold', color: '#FF4242'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold', color: '#2A8CD1'}]}>{'Reff. ID : ' + item.id_jadwal}</Text>
                <Text style={styles.arielTatum1}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.rect}>
          <View style={styles.arielTatum1Row}>
            <Text style={[styles.arielTatum1, {fontWeight: 'bold'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  function Batal() {
    const newItems = dataCancelTrx;
    //alert(JSON.stringify(newItems));
    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_jadwal} style={styles.listJadwal} onPress={() => openBatal(item.id_jadwal)}>
            <View style={styles.rect}>
              <View style={styles.arielTatum1Row}>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold'}]}>{item.client}</Text>
                <Btnbatal style={styles.button} />
              </View>
              <View style={styles.arielTatum2Row}>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold', color: '#FF4242'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                {item.id_paket === '1' ?
                  <Text style={styles.arielTatum1}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
                  :
                  <Text style={[styles.arielTatum2, {fontStyle: 'italic'}]}>Buka pesanan untuk melihat detail jadwal</Text>
                }
              </View>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={styles.rect}>
          <View style={styles.arielTatum1Row}>
            <Text style={[styles.arielTatum1, {fontWeight: 'bold'}]}>Tidak ada data</Text>
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
            <Transaksihead style={styles.transaksihead} props={props} />
            <View style={styles.group5}>
              <Tabtransaksi style={styles.tabtransaksi} activeTab={activeTab} onChangeTab={onChangeTab} />
            </View>

            <ScrollView
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
              <View style={styles.container}>
                <View style={styles.scrollAreaStack}>
                  <View style={[styles.scrollArea, styles.inner]}>
                    <View style={styles.group4}>                      
                      {!loadingFetch ?
                        <TabJadwal />
                        :
                        <></>
                      }
                    </View>                  
                  </View>
                </View>
              </View>
            </ScrollView>
            <View>
              <Footer style={styles.footer1} props={props} dataLogin={dataLogin} />
            </View>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    left: 0
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  group4: {
    height: 'auto',
    justifyContent: "space-between",
    padding: '5%'
  },
  group5: {
    height: 50,
    padding: '2%',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  listJadwal: {
    height: 'auto',
    alignSelf: "stretch",
    marginBottom: 5
  },
  rect: {
    height: 'auto',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
    padding: '2%'
  },
  arielTatum1Row: {
    flex: 1,
    height: 'auto',
    flexDirection: "row",
    alignItems: "stretch",
    padding: 5
  },
  arielTatum2Row: {
    flex: 1,
    height: 'auto',
    padding: 5
  },
  arielTatum1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    alignSelf: "flex-start",
    height: 'auto',
    width: '70%',
    padding: '1%',
  },
  arielTatum2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    alignSelf: "flex-start",
    height: 'auto',
    width: '100%',
    padding: '1%',
  },
  button: {
    height: 'auto',
    width: '30%',
    padding: '1%',
  },
  text1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12,
    marginTop: 3,
    marginLeft: 12
  },
  layananFisioterapi: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12,
    marginTop: 3,
    marginLeft: 12
  },
  btnbatal1: {
    height: 16,
    width: 69,
    marginTop: 1
  },
  btnmenunggu2: {
    height: 16,
    width: 69,
    marginTop: 1
  },
  btnbooking: {
    height: 16,
    width: 69
  },
  pevitaPierceRow: {
    height: 16,
    flexDirection: "row",
    marginTop: 11,
    marginLeft: 12,
    marginRight: 9
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
  },
  tabtransaksi: {
    height: 56,
    marginTop: 0
  }
});

export default Transaksipage;
