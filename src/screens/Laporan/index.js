import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import Loader from '../../components/Loader';
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment/min/moment-with-locales';
//import 'moment/locale/id';
import Laporantab from "../../components/Laporantab";
import axios from 'axios';

export default function Laporan(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');
  
  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const [dataReport, setDataReport] = useState('');
  // const [activeTab, setActiveTab] = useState('');

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const [refreshing, setRefreshing] = useState(false);

  //params for pagination
  const [page, setPage] = useState(0);
  const [shouldFetch, setShouldFetch] = useState(false);
  const [filter, setFilter] = useState(false);
  const [filterText, setFilterText] = useState('');
  //params for pagination

  const onRefresh = useCallback(async() => {
    setRefreshing(true);
    const success = await setCurrentDataNakes();
    
    if(success) {
      setRefreshing(false);
      setLoadingFetch(false);
    }else {
      setRefreshing(true);
      setLoadingFetch(true);
    }

    return () => {
      setRefreshing(false);
    }

    //wait(2000).then(() => setRefreshing(false));
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

  // const onChangeTab = async (ev) => {
  //   setActiveTab(ev);
  // }

  useEffect(() => {
    getLoginData();
    // setDataLogin(formValidation.dataLogin);

    return () => {
      setLoading(false);
    }
  },[refreshing]);

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
  //       onRefresh();
  //     }
  //   }

  //   return () => {
  //     setLoadingFetch(false);
  //   }
  // },[activeTab]);

  const setCurrentDataNakes = async () => {
    success = await getAllReport();

    if(success) {
      await setLoading(false);
      await setLoadingFetch(false);
      // await setActiveTab('selesai');
    }
    return(true);
  }

  useEffect(() => {
    if(filterText !== '') {
      setPage(0);
      getFilterData(filterText);
    }else {
      setPage(0);
      setDataReport('');
      setFilter(false);
      getAllReport();
    }
  }, [filterText]);

  async function getFilterData(value) {
    await setDataReport('');
    await setFilter(true);
    await getFilterReport(value);
  }

  const refreshData = async () => {
    if(filterText === '' && filter) {
      await setPage(0);
      await setDataReport('');
      await setFilter(false);
      await setFilterText('');
      getAllReport();
    }else if(filterText === '' && !filter) {
      getAllReport();
    }else {
      getFilterReport(filterText);
    }
  }

  const getFilterReport = async (value) => {
    setShouldFetch(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
      id_nakes: dataLogin.id_nakes,
      token: dataLogin.token,
      filter: value
    });

    success = await formValidation.getFilterReport(params, page, 10);

    if(success.status ===  true) {
      setShouldFetch(false);
      if(success.res.responseCode !== '000') {

      }else {
        try {
          if(success.res.data !== undefined) {
            if(!filter) {
              await setDataReport(oldData => [...oldData, ...success.res.data]);
              await setPage(page + 1);
            }else {
              await setDataReport(success.res.data);
              await setPage(page + 1);
            }
            setFilter(false);
          }
        } catch (error) {
          alert(error);
        } finally {

        }
      }
      return true;
    }
  }

  async function getAllReport() {
    setShouldFetch(true);
    let params = [];
    params.push({
      base_url: formValidation.base_url,
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
    return(true);
  }

  const openReport = async(id_jadwal, id_detail, id_paket) => {
    props.navigation.navigate('laporanTrx', { base_url: formValidation.base_url, id_jadwal: id_jadwal, id_detail: id_detail, id_paket: id_paket, dataReport: dataReport, dataLogin: dataLogin } );
  }

  function Selesai() {
    const newItems = dataReport;

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <TouchableOpacity key={item.id_paket === '1' ? item.id_jadwal : item.id_detail} onPress={() => openReport(item.id_jadwal, item.id_detail, item.id_paket)}
            style={styles.Chat_label}
          >
            {/*<Image
              style={styles.Rectangle2}
              source={{
                uri: item.image,
              }}
            />*/}
            <IconImage label="image" name="person-circle-outline" />
            <View style={styles.Blockpesan}>
              <Text style={styles.Txt1032}>{item.client}</Text>
              <Text style={styles.Txt810}>{item.order_type} {item.id_paket === '1' ? '(Reguler)' : '(Khusus)'}</Text>
              <Text style={styles.Txt810}>{'Reff. ID : ' + item.id_referensi}</Text>
              <Text style={styles.Txt2910}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
            </View>
          </TouchableOpacity>
        )
      })
    }else {
      return (
        <View style={[styles.Chat_label, {backgroundColor: 'transparent'}]}>
          <View style={styles.Blockpesan}>
            <Text style={[styles.Txt681, {color: 'rgba(0,0,0,1)', fontWeight: 'bold'}]}>Tidak ada data</Text>
          </View>
        </View>
      )
    }
  }

  const IconImage = ({label, name}) => {
    return <Icon style={{color: 'rgba(255,255,255,1)', fontSize: 60, alignSelf: 'center'}} name={name} />;
  };


  // function TabLaporan() {
  //   let tab = '';
  //   if(activeTab) {
  //     switch(activeTab) {
  //       case 'selesai':
  //         return (
  //           <>
  //             <Selesai />
  //             {shouldFetch ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}
  //           </>
  //         )
  //     }
  //   }else {
  //     return (
  //       <></>
  //     )
  //   }
  // }

  return (
    !loading ?
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
            <View style={styles.GroupTab}>
              <View style={styles.Tab_laporan}>
                <View style={styles.Form_cari}>
                  <TextInput
                    style={styles.Txt657}
                    placeholder="Cari Laporan..."
                    placeholderTextColor="rgba(0,0,0,1)"
                    onEndEditing={(value) => {
                      setPage(0);
                      setFilterText(value.nativeEvent.text);
                    }}
                    defaultValue={filterText}
                  />
                </View>
                {/*<TouchableOpacity style={styles.Tbl_cari} onPress={() => null}>
                  <Text style={styles.Txt348}>Cari</Text>
                </TouchableOpacity>*/}
              </View>
            </View>

              {/*<View style={styles.group5}>
                <Laporantab style={styles.tablaporan} activeTab={activeTab} onChangeTab={onChangeTab} />
              </View>*/}

              {/*<View style={styles.User}>
                <View style={styles.Status}>
                  <View style={styles.Frame15}>
                    <Text style={styles.Txt676}>LAPORAN</Text>
                  </View>
                </View>
              </View>*/}

            <View style={styles.formReport}>
              <ScrollView
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
                onScrollEndDrag={refreshData}
                /*refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }*/
              >

                {/*!loadingFetch ?
                  <TabLaporan />
                  :
                  <></>
                */}

                <Selesai />
                {shouldFetch ? <ActivityIndicator size="small" color="#0000ff" /> : <></>}

              </ScrollView>
            </View>
          </SafeAreaView>
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
  containerKey: {
    flex: 1,
    backgroundColor: 'rgba(54,54,54,1)',
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
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
  Status: {
    flex: 1,
    //height: 30,
  },
  Frame15: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(36, 195, 142, 1)",
  },
  Txt676: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    justifyContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  group5: {
    height: 50,
    // padding: '2%',
    paddingLeft: '5%',
    paddingRight: '5%'
  },
  tablaporan: {
    height: 56,
    marginTop: 0
  },

  formReport: {
    flex: 1,
    // paddingTop: 10,
    flexDirection: 'column',
    // marginHorizontal: 20,
  },
  GroupTab: {
    // paddingHorizontal: '4%',
    // paddingVertical: '2%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Tab_laporan: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    // borderRadius: 15,
    backgroundColor: 'rgba(54,54,54,1)',
    padding: 5
  },
  Form_cari: {
    flex: 1,
    alignSelf: 'center',
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  Txt657: {
    flex: 1,
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(0,0,0,1)',
    paddingHorizontal: 10,
  },

  Tbl_cari: {flex: 0.2,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 10,
    backgroundColor: '#43A9DD',
    padding: 10
  },
  Txt348: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 14,
    color: 'rgba(255, 255, 255, 1)'
  },

  Chat_label: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    //alignItems: 'flex-start',
    padding: '2%',
    // borderRadius: 4,
    borderBottomWidth: 0.8,
    backgroundColor: '#43A9DD',
    borderColor: 'rgba(255, 255, 255, 0.5)'
    // marginBottom: 10,
  },
  Blockpesan: {
    marginLeft: '2%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  Txt1032: {
    fontSize: 16,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(250,250,250,1)',
    marginBottom: 4,
  },
  Txt810: {
    fontSize: 14,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(250,250,250,1)',
    textAlign: 'justify',
    marginBottom: 4,
  },
  Txt2910: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    lineHeight: 12,
    color: 'rgba(250,250,250,1)',
  },
  Txt681: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 1)',
    paddingRight: 25,
  },
  Rectangle2: {
    width: 45,
    height: 45,
    marginRight: 12,
    borderRadius: 100,
  },
});
