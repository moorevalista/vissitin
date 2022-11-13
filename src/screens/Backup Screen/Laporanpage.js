import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Text, RefreshControl,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from "react-native";
import Laporantab from "../components/Laporantab";
import Btninputlap from "../components/Btninputlap";
import Btnselesailap from "../components/Btnselesailap";
import Footer from "../components/Footer";
import Lapheader from "../components/Lapheader";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import 'moment/locale/id';

function Laporanpage(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  //const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [dataReport, setDataReport] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [page, setPage] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  //params for pagination

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const success = await getAllReport();
    
    !success ? setRefreshing(false):'';
    setLoadingFetch(success);

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
    setActiveTab(ev);
  }

  useEffect(() => {
    //getLoginData();
    setDataLogin(props.route.params.dataLogin);

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
        onRefresh();
      }
    }

    return () => {
      setLoadingFetch(false);
    }
  },[activeTab]);

  const setCurrentDataNakes = async () => {
    await setLoadingFetch(true);
    await setActiveTab('selesai');
  }

  async function getAllReport() {
    setShouldFetch(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token
    });

    success = await formValidation.getAllReport(params, page, 10);
    
    if(success.status === true) {
      try {
        //await setDataReport(success.res);
        setShouldFetch(false);
        if(success.res !== undefined) {
          setDataReport(oldData => [...oldData, ...success.res]);

          setPage(page + 1);
        }
      } catch (error) {
        alert(error);
      } finally {
        
      }
    }
    return(false);
  }

  const openReport = async(id_jadwal, id_detail, id_paket) => {
    props.navigation.navigate('laporanTrx', { base_url: props.route.params.base_url, id_jadwal: id_jadwal, id_detail: id_detail, id_paket: id_paket, dataReport: dataReport, dataLogin: dataLogin } );
  }

  function Selesai() {
    const newItems = dataReport;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_paket === '1' ? item.id_jadwal : item.id_detail} style={styles.list1} onPress={() => openReport(item.id_jadwal, item.id_detail, item.id_paket)}>
            <View style={styles.boxlistlap}>
              <View style={styles.arieltatum1Row}>
                <Text style={[styles.arieltatum, {fontWeight: 'bold'}]}>{item.client}</Text>
                <Btnselesailap style={styles.button} />
              </View>
              <View style={styles.arielTatum2Row}>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold', color: '#FF4242'}]}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
                <Text style={[styles.arielTatum1, {fontWeight: 'bold', color: '#2A8CD1'}]}>{'Reff. ID : ' + item.id_referensi}</Text>
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


  function TabLaporan() {
    let tab = '';
    if(activeTab) {
      switch(activeTab) {
        case 'selesai':
          return (
            <>
              <Selesai />
              {shouldFetch ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
            </>
          )
      }
    }else {
      return (
        <></>
      )
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
            <Lapheader style={styles.lapheader1} props={props} />
            <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                    onScrollEndDrag={getAllReport}
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
                      {/*<Laporantab style={styles.tablaporan} activeTab={activeTab} onChangeTab={onChangeTab} />*/}
                      {!loadingFetch ?
                        <TabLaporan />
                        :
                        <></>
                      }
                      {/*<TouchableOpacity style={styles.list1}>
                        <View style={styles.boxlistlap}>
                          <View style={styles.arieltatum1Row}>
                            <Text style={[styles.arieltatum, {fontWeight: 'bold'}]}>Anya Geraldine</Text>
                            <Btninputlap style={styles.button} />
                          </View>
                          <View style={styles.arielTatum2Row}>
                            <Text style={[styles.arielTatum1, {fontWeight: 'bold', color: '#FF4242'}]}>
                              Layanan Fisioterapi
                            </Text>
                            <Text style={styles.arielTatum1}>1 Oktober 2021, 09.00 wib</Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.list1}>
                        <View style={styles.boxlistlap}>
                          <View style={styles.arieltatum1Row}>
                            <Text style={[styles.arieltatum, {fontWeight: 'bold'}]}>Anya Geraldine</Text>
                            <Btnselesailap style={styles.button} />
                          </View>
                          <View style={styles.arielTatum2Row}>
                            <Text style={[styles.arielTatum1, {fontWeight: 'bold', color: '#FF4242'}]}>
                              Layanan Fisioterapi
                            </Text>
                            <Text style={styles.arielTatum1}>1 Oktober 2021, 09.00 wib</Text>
                          </View>
                        </View>
                      </TouchableOpacity>*/}
                      
                      {/*<TouchableOpacity style={styles.list2}>
                        <View style={styles.boxlistlap2}>
                          <View style={styles.arieltatum1Row}>
                            <Text style={styles.arieltatum1}>Ariel Tatum</Text>
                            <View style={styles.arieltatum1Filler}></View>
                            <Btnselesailap style={styles.btnselesailap}></Btnselesailap>
                          </View>
                          <Text style={styles.tglwaktu1}>
                            30 September 2021, 09.00 wib
                          </Text>
                          <Text style={styles.layananFisioterapi1}>
                            Layanan Fisioterapi
                          </Text>
                        </View>
                      </TouchableOpacity>*/}
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
  tablaporan: {
    height: 56,
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
  list1: {
    height: 'auto',
    alignSelf: "stretch",
    marginBottom: 5
  },
  boxlistlap: {
    height: 'auto',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
    padding: '2%'
  },
  arieltatum1Row: {
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
  arieltatum: {
    fontFamily: "roboto-regular",
    color: "#121212",
    alignSelf: "flex-start",
    height: 'auto',
    width: '70%',
    padding: '1%',
  },
  button: {
    height: 'auto',
    width: '30%',
    padding: '1%',
  },

  arieltatumFiller: {
    flex: 1,
    flexDirection: "row"
  },
  btninputlap: {
    height: 16,
    width: 63
  },
  
  tglwaktu: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 11
  },
  layananFisioterapi: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12,
    marginTop: 3,
    marginLeft: 11
  },
  list2: {
    height: 71,
    marginTop: 8
  },
  boxlistlap2: {
    height: 71,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)"
  },
  arieltatum1: {
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  arieltatum1Filler: {
    flex: 1,
    flexDirection: "row"
  },
  btnselesailap: {
    height: 16,
    width: 63
  },
  tglwaktu1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 11
  },
  layananFisioterapi1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12,
    marginTop: 3,
    marginLeft: 11
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
  lapheader1: {
    height: 75
  }
});

export default Laporanpage;
