import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Image, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, RefreshControl, ActivityIndicator } from "react-native";
import BadgeFree from "../components/BadgeFree";
import BookBadga from "../components/BookBadga";
import Footer from "../components/Footer";
import HeaderInformasi from "../components/HeaderInformasi";
import Segmentinformasi from "../components/Segmentinformasi";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import 'moment/locale/id';
import Loader from '../components/Loader';

function EventPage(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  //const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [dataEvent, setDataEvent] = useState([]);
  const [dataPelatihan, setDataPelatihan] = useState([]);
  const [activeTab, setActiveTab] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [eventPage, setEventPage] = useState(0);
  const [pelatihanPage, setPelatihanPage] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  //params for pagination

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(async(val) => {
    setRefreshing(true);
    val === undefined ? val = activeTab: '';
    let success = '';
    success = await getEvent(val);

    !success ? setRefreshing(false): '';
    setLoadingFetch(success)

    return () => {
      setRefreshing(false);
      setLoadingFetch(false);
    }
  });

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    if(success[0].loginState === 'true') {
      try {
        setDataLogin(success[0]);
      } catch (error) {
        alert(error);
      } finally {

      }
    }
  }

  const onChangeTab = async (ev) => {
    if(ev !== activeTab) {
      //setDataEvent([]);
      setLoadingFetch(true);
      setActiveTab(ev);  
    }
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
      setCurrentData();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  useEffect(() => {
    if(dataLogin) {
      if(loadingFetch) {
        onRefresh(activeTab)
      }
    }

    return () => {
      setLoadingFetch(false);
    }
  },[activeTab]);

  const setCurrentData = async () => {
    /*try {
      const fetch = setLoadingFetch(true);
      const tab = setActiveTab('event');
      const all = await Promise.all([fetch, tab]);
      return all;
    } finally {

    }*/
    await setLoadingFetch(true);
    await setActiveTab('event');
  }

  async function getEvent(val) {
    setShouldFetch(true);
    let page = 0;
    if(val === 'event') {
      page = eventPage;
    }else if(val === 'pelatihan') {
      page = pelatihanPage;
    }

    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token,
      jenis_kegiatan: val
    });

    success = await formValidation.getEvent(params, page, 10);

    if(success.status === true) {
      try {
        setShouldFetch(false);

        if(val === 'event') {
          //await setDataEvent(success.res);
          if(success.res !== undefined) {
            setDataEvent(oldData => [...oldData, ...success.res]);

            setEventPage(eventPage + 1);
          }
        }else if(val === 'pelatihan') {
          //await setDataPelatihan(success.res);
          if(success.res !== undefined) {
            setDataPelatihan(oldData => [...oldData, ...success.res]);

            setPelatihanPage(pelatihanPage + 1);
          }
        }
        
      } catch (error) {
        alert(error)
      } finally {

      }
    }
    return(false);
  }

  function RenderEvent() {
    const newItems = dataEvent;

    if(newItems.length > 0) {
      return newItems.map((item, index) => {
        let thumbImage = props.route.params.base_url + 'data_assets/fotoEvent/' + item.image;
        return (
          <View key={item.id_kegiatan} style={styles.rect}>
            <View style={styles.boxImage}>
              <Image
                source={{uri: thumbImage}}
                resizeMode="cover"
                style={styles.image}
              />
            </View>
            <View style={styles.back_title}>
              <Text style={styles.title}>{item.jenis_kegiatan.toUpperCase()}</Text>
            </View>
            <View style={styles.boxEvent}>
              <Text style={styles.titleEvent}>{item.judul.toUpperCase()}</Text>

              <View style={{marginTop: '2%'}}>
                <Text style={styles.labelTitle}>Jadwal Kegiatan</Text>
                <Text style={styles.labelEvent}>{item.jadwal_kegiatan}</Text>
                <Text style={styles.labelEvent}>{'Pukul ' + item.waktu_kegiatan}</Text>
              </View>
              <View style={{marginTop: '2%'}}>
                <Text style={styles.labelTitle}>Batas Waktu Pendaftaran</Text>
                <Text style={styles.labelEvent}>{item.batas_waktu_pendaftaran}</Text>
              </View>
              <View style={{marginTop: '2%'}}>
                <Text style={styles.labelTitle}>Deskripsi Kegiatan</Text>
                <Text style={styles.labelEvent}>{item.deskripsi}</Text>
              </View>

              {item.kategori_kegiatan === "gratis" ?
                <BadgeFree style={[styles.button, {marginTop: '5%'}]} link={item.link}></BadgeFree>
                :
                <BookBadga style={[styles.button, {marginTop: '5%'}]} link={item.link}></BookBadga>
              }
            </View>
          </View>
        )
      })
    }else {
      return (
        <>
          <Text style={[styles.title2, {fontStyle: 'italic'}]}>Tidak ada data informasi kegiatan yang dapat ditampilkan...</Text>
        </>
      )
    }
  }

  function RenderPelatihan() {
    const newItems = dataPelatihan;

    if(newItems.length > 0) {
      return newItems.map((item, index) => {
        let thumbImage = props.route.params.base_url + 'data_assets/fotoEvent/' + item.image;
        return (
          <View key={item.id_kegiatan} style={styles.rect}>
            <View style={styles.boxImage}>
              <Image
                source={{uri: thumbImage}}
                resizeMode="cover"
                style={styles.image}
              />
            </View>
            <View style={styles.back_title}>
              <Text style={styles.title}>{item.jenis_kegiatan.toUpperCase()}</Text>
            </View>
            <View style={styles.boxEvent}>
              <Text style={styles.titleEvent}>{item.judul.toUpperCase()}</Text>

              <View style={{marginTop: '2%'}}>
                <Text style={styles.labelTitle}>Jadwal Kegiatan</Text>
                <Text style={styles.labelEvent}>{item.jadwal_kegiatan}</Text>
                <Text style={styles.labelEvent}>{'Pukul ' + item.waktu_kegiatan}</Text>
              </View>
              <View style={{marginTop: '2%'}}>
                <Text style={styles.labelTitle}>Batas Waktu Pendaftaran</Text>
                <Text style={styles.labelEvent}>{item.batas_waktu_pendaftaran}</Text>
              </View>
              <View style={{marginTop: '2%'}}>
                <Text style={styles.labelTitle}>Deskripsi Kegiatan</Text>
                <Text style={styles.labelEvent}>{item.deskripsi}</Text>
              </View>

              {item.kategori_kegiatan === "gratis" ?
                <BadgeFree style={[styles.button, {marginTop: '5%'}]} link={item.link}></BadgeFree>
                :
                <BookBadga style={[styles.button, {marginTop: '5%'}]} link={item.link}></BookBadga>
              }
            </View>
          </View>
        )
      })
    }else {
      return (
        <>
          <Text style={[styles.title2, {fontStyle: 'italic'}]}>Tidak ada data informasi pelatihan yang dapat ditampilkan...</Text>
        </>
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
            <HeaderInformasi style={styles.headerInformasi} props={props} />
            <View style={styles.group1}>
              <Segmentinformasi style={styles.tabInformasi} activeTab={activeTab} onChangeTab={onChangeTab} />
            </View>

              <ScrollView
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
                onScrollEndDrag={() => getEvent(activeTab)}
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
                      <View style={styles.group}>
                        {!loadingFetch ?
                          activeTab === 'event' ?
                            <>
                              <RenderEvent />
                              {shouldFetch ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
                            </>
                            :
                            <>
                              <RenderPelatihan />
                              {shouldFetch ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
                            </>
                          :
                          <></>
                        }
                      </View>
                    </View>
                  </View>
                </View>
              </ScrollView>
              <View>
                <Footer props={props} dataLogin={dataLogin} />
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
    //padding: '4%',
    flex: 1,
    justifyContent: "space-around",
    //alignItems: 'center',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  headerInformasi: {
    height: 75
  },
  scrollArea: {
    flex: 1,
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  group: {
    height: 'auto',
    justifyContent: "space-between",
    alignItems: 'center',
    padding: '5%'
  },
  group1: {
    height: 50,
    padding: '2%',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  tabInformasi: {
    height: 56
  },
  rect: {
    flex: 1,
    width: 322,
    height: 'auto',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
    marginBottom: '2%'
  },
  button: {
    flex: 1,
    marginTop: '2%',
    padding: '2%',
    borderRadius: 20
  },
  boxImage: {
    flex: 1,
    alignItems: 'center'
  },
  image: {
    width: 320,
    height: 320,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: "#000000",
  },
  title: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: 'center'
  },
  title2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: 'center',
    height: 'auto',
    padding: '1%',
  },
  back_title: {
    height: 'auto',
    padding: '2%',
    alignItems: 'center',
    backgroundColor: "rgba(74,74,74,1)"
  },
  boxEvent: {
    padding: '4%'
  },
  titleEvent: {
    flex: 1,
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    fontSize: 12,
    fontWeight: "bold",
  },
  labelEvent: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    fontSize: 12
  },
  labelTitle: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    fontSize: 12,
    fontWeight: 'bold'
  },
  scrollAreaStack: {
    height: 'auto',
    flex: 1
  }
});

export default EventPage;
