import React, { Component, useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import Transaksihead from "../components/Transaksihead";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Petapasien from "../components/Petapasien";
import Btnterima from "../components/Btnterima";
import Btntolak from "../components/Btntolak";
import Btnkirim from "../components/Btnkirim";
import CupertinoButtonCancel from "../components/CupertinoButtonCancel";
import Footer from "../components/Footer";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import 'moment/locale/id';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { CommonActions } from '@react-navigation/native';
import Loader from '../components/Loader';

//import Notifications from '../Notifications';

function Trxbooking(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  const id_jadwal = props.route.params.id_jadwal;
  const dataReservasi = props.route.params.dataReservasi;
  const [dataReservasiDetail, setDataReservasiDetail] = useState([]);

  const [alasanTolak, setAlasanTolak] = useState('');
  const [reject, setReject] = useState(false);

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

    return () => {
      setLoading(false);
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

  const setCurrentDataNakes = async () => {
    setLoadingFetch(true);

    if(id_jadwal) {
      const newItems = dataReservasi.filter(
        item => item.id_jadwal === id_jadwal
      );

      if(newItems[0].id_paket !== '1') {
        await getReservationDetail(id_jadwal);
      }
    }

    await setLoading(false);
    await setLoadingFetch(false);
  }

  //untuk menampilkan error
  const showError = (e) => {
    showMessage({
      message: e,
      //description: "My message description",
      type: "warning",
      icon: "warning",
      //backgroundColor: "rgb(255, 195, 102)",
      color: "rgba(255,255,255,1)",
      floating:true
    });
  }

  const backToHome = () => {
    props.route.params.onRefresh !== undefined ? props.route.params.onRefresh():'';
    props.navigation.goBack();
    /*props.navigation.dispatch(
            CommonActions.reset({
              index: 1,
              routes: [
                {
                  name: 'transaksiScreen',
                  params: { base_url: props.route.params.base_url },
                }
              ],
            })
          )*/
  }

  async function submitTolak() {
    if(alasanTolak === '') {
      showError('Alasan penolakan harus diisi...');
    }else {
      await setLoadingSave(true);
      let params = [];
      params.push({
        base_url: props.route.params.base_url,
        id_jadwal: id_jadwal,
        id_pasien: dataReservasi[0].id_pasien,
        id_nakes: dataLogin.id_nakes,
        alasanTolak: alasanTolak,
        token: dataLogin.token,
        notif_type: 'reject_reservasi'
      });

      success = await formValidation.submitTolak(params);
      
      if(success.status === true) {
        if(success.res.responseCode === '000') {
          await showError(success.res.messages);

          //send notif
          success = await formValidation.sendNotif(params);

          if(success.status === true) {
            backToHome();
          }else {
            backToHome();
          }
          
        }else {
          showError(success.res.messages);
        }
      }
      await setLoadingSave(false);
    }
  }

  async function submitTerima() {
      await setLoadingSave(true);
      let params = [];
      params.push({
        base_url: props.route.params.base_url,
        id_jadwal: id_jadwal,
        id_pasien: dataReservasi[0].id_pasien,
        id_nakes: dataLogin.id_nakes,
        alasanTolak: alasanTolak,
        token: dataLogin.token,
        notif_type: 'confirm_reservasi'
      });

      success = await formValidation.submitTerima(params);
      
      if(success.status === true) {
        if(success.res.responseCode === '000') {
          await showError(success.res.messages);

          //set schedule reminder 30 minutes before visit start
          if(dataReservasi[0].id_paket === '1') {
            let reminderTime = new Date();
            let new_params = [];

            new_params.push({
              id: dataReservasi[0].id_jadwal.substring(4),
              client: dataReservasi[0].client,
              jam: dataReservasi[0].order_start_time.replace(':00:00', '.00')
            });

            reminderTime = new Date(moment(dataReservasi[0].order_date, 'YYYY-MM-DD').format('YYYY/MM/DD') + ' ' + dataReservasi[0].order_start_time);
            reminderTime.setHours(reminderTime.getHours()-1, reminderTime.getMinutes()+30, reminderTime.getSeconds());

            formValidation.scheduleNotification(reminderTime, new_params);
          }else {
            let i = 0;

            for(i=0;i<dataReservasiDetail.length;i++) {
              let reminderTime = new Date();
              let new_params = [];

              new_params.push({
                id: dataReservasiDetail[i].id_detail.substring(4),
                client: dataReservasiDetail[i].client,
                jam: dataReservasiDetail[i].order_start_time.replace(':00:00', '.00')
              });

              reminderTime = new Date(moment(dataReservasiDetail[i].order_date, 'YYYY-MM-DD').format('YYYY/MM/DD') + ' ' + dataReservasiDetail[i].order_start_time);
              reminderTime.setHours(reminderTime.getHours()-1, reminderTime.getMinutes()+30, reminderTime.getSeconds());

              formValidation.scheduleNotification(reminderTime, new_params);
            }
          }
          //set schedule reminder 30 minutes before visit end

          //send notif
          success = await formValidation.sendNotif(params);

          if(success.status === true) {
            backToHome();
          }else {
            backToHome();
          }
          
        }else {
          showError(success.res.messages);
        }
      }
      await setLoadingSave(false);
  }

  async function getReservationDetail(id_jadwal) {
    await setLoading(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_jadwal: id_jadwal,
      token: dataLogin.token
    });

    success = await formValidation.getReservationDetail(params);

    if(success.status === true) {
      try {
        await setDataReservasiDetail(success.res);
      } catch (error) {
        alert(error);
      } finally {

      }
    }
    await setLoading(false);
  }

  function ShowDetail() {
    const newItems = dataReservasi.filter(
      item => item.id_jadwal === id_jadwal
    );

    if(newItems[0].id_paket !== '1') {
      return (
        <ReservasiDetailPaket />
      )
    }else {
      return (
        <ReservasiDetail />
      )
    }
  }

  function ReservasiDetail() {
    const id = id_jadwal;
    const newItems = dataReservasi.filter(
      item => item.id_jadwal === id
    );

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <View key={item.id_jadwal}>
            <View style={styles.icon1Stack}>
              <Text style={styles.label1}>User/Pasien</Text>
              <Text style={styles.label2}>{item.client}</Text>
              <Text style={styles.label2}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
            </View>
            <View style={styles.icon1Stack}>
              <Text style={styles.label1}>Layanan</Text>
              <Text style={styles.label2}>Visit {item.order_type}</Text>
            </View>
            <View style={styles.icon1Stack}>
              <Text style={styles.label1}>Paket Layanan</Text>
              <Text style={styles.label2}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
            </View>
            <View style={styles.icon1Stack}>
              <Text style={styles.label1}>Alamat User/Pasien</Text>
              <Text style={styles.label2}>{item.destination_address}</Text>
            </View>
            <View style={styles.icon1Stack}>
              <Petapasien style={styles.mapspasien1} lat={parseFloat(item.lat)} lon={parseFloat(item.lon)} />
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

  function ItemPaket() {
    const itemDetail = dataReservasiDetail;
    return itemDetail.map((item, index) => {
      return (
        <Text key={item.id_detail} style={styles.label2}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
      )
    })
  }

  function ReservasiDetailPaket() {
    const id = id_jadwal;
    const newItems = dataReservasi.filter(
      item => item.id_jadwal === id
    );

    if(newItems) {
      return newItems.map((item, index) => {
        return (
          <View key={item.id_jadwal}>
            <View style={styles.icon1Stack}>
              <Text style={styles.label1}>User/Pasien</Text>
              <Text style={styles.label2}>{item.client}</Text>
            </View>
            <View style={styles.icon1Stack}>
              <Text style={styles.label1}>Jadwal</Text>
              <ItemPaket />
            </View>
            <View style={styles.icon1Stack}>
              <Text style={styles.label1}>Layanan</Text>
              <Text style={styles.label2}>Visit {item.order_type}</Text>
            </View>
            <View style={styles.icon1Stack}>
              <Text style={styles.label1}>Paket Layanan</Text>
              <Text style={styles.label2}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
            </View>
            <View style={styles.icon1Stack}>
              <Text style={styles.label1}>Alamat User/Pasien</Text>
              <Text style={styles.label2}>{item.destination_address}</Text>
            </View>
            <View style={styles.icon1Stack}>
              <Petapasien style={styles.mapspasien1} lat={parseFloat(item.lat)} lon={parseFloat(item.lon)} />
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

  function onReject() {
    setReject(true);
  }

  function onCancel() {
    setReject(false);
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
                  visible={loadingSave}
                  textContent={''}
                  textStyle={styles.spinnerTextStyle}
                  color="#236CFF"
                  overlayColor="rgba(255, 255, 255, 0.5)"
                />
            <Transaksihead style={styles.transaksihead} props={props} backScreen="transaksiScreen" />
            <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                  >
              <View style={styles.container}>
                <View style={styles.scrollAreaStack}>
                  <View style={[styles.scrollArea, styles.inner]}>
                      <View style={styles.icon1Stack}>
                        <Icon name="bell-ring" style={styles.icon1}></Icon>
                        <Text style={styles.bookingMasuk}>BOOKING MASUK</Text>
                      </View>

                      {!loadingFetch ?
                        <ShowDetail />
                        :<></>
                      }

                      {!reject ?
                        <View style={styles.icon1Stack}>
                          <TouchableOpacity style={styles.button}>
                            <Btnterima
                              style={styles.btnStyle}
                              submitTerima={submitTerima}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.button}>
                            <Btntolak style={styles.btnStyle} onReject={onReject} />
                          </TouchableOpacity>
                        </View>
                        :
                        <></>
                      }

                      {reject ?
                        <View style={styles.icon1Stack}>
                            <View style={styles.penolakanform}>
                              <Text style={styles.label1}>Alasan Penolakan</Text>
                              <View style={styles.framepenolakan}>
                                <TextInput
                                  placeholder="Sampaikan Alasan . . ."
                                  numberOfLines={10}
                                  maxLength={200}
                                  multiline={true}
                                  style={styles.textInput}
                                  onEndEditing={(e) => setAlasanTolak(e.nativeEvent.text)}
                                ></TextInput>
                              </View>
                            </View>
                            <TouchableOpacity style={styles.button}>
                              <Btnkirim
                                style={styles.btnStyle}
                                submitTolak={submitTolak}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.button}>
                              <CupertinoButtonCancel
                                style={styles.btnStyle}
                                onCancel={onCancel}
                              />
                            </TouchableOpacity>
                        </View>
                        :
                        <></>
                      }
                  </View>
                </View>
              </View>
          </ScrollView>
          <View>
            <Footer style={styles.footer1} props={props}></Footer>
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
    left: 0
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  icon1Stack: {
    flex: 1,
    height: 'auto',
    marginTop: '2%',
    padding: '2%'
  },
  icon1: {
    height: 'auto',
    color: "#41aadf",
    fontSize: 30,
    textAlign: "center",
    alignSelf: "flex-start",
    height: 'auto',
    width: '100%',
    padding: '1%',
  },
  bookingMasuk: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    alignSelf: "flex-start",
    height: 'auto',
    width: '100%',
    padding: '1%'
  },
  label1: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    fontSize: 14,
  },
  label2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 14,
    marginTop: 1
  },
  mapspasien1: {
    height: 188,
    borderRadius: 10,
    padding: '2%'
  },
  button: {
    height: 44,
    marginBottom: '2%',
    padding: '2%'
  },
  btnStyle: {
    height: 44
  },

  penolakanform: {
    height: 'auto',
    marginTop: 15,
    padding: '2%',
  },
  framepenolakan: {
    minHeight: 115,
    height: 'auto',
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
    borderRadius: 10,
    marginTop: 5,
  },
  textInput: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 95,
    marginTop: 10,
    marginLeft: 9,
    marginRight: 10
  },
  cupertinoButtonDanger: {
    height: 44,
    marginTop: 16,
    alignSelf: "center",
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

export default Trxbooking;
