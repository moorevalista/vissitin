import React, { Component, useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, BackHandler
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import RBSheet from 'react-native-raw-bottom-sheet';
import RNPickerSelect from 'react-native-picker-select';

import Petapasien from "../../components/Petapasien";
import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment/min/moment-with-locales';
//import 'moment/locale/id';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { CommonActions } from '@react-navigation/native';
import Loader from '../../components/Loader';
import axios from 'axios';

export default function DetailBooking(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  const id_jadwal = props.route.params.id_jadwal;
  const dataReservasi = props.route.params.dataReservasi;
  const [dataReservasiDetail, setDataReservasiDetail] = useState([]);

  const [alasanTolak, setAlasanTolak] = useState('');
  const [reject, setReject] = useState(false);

  const [idAlasan, setIdAlasan] = useState('');
  const [dataAlasan, setDataAlasan] = useState([]);
  const [itemsAlasan, setItemsAlasan] = useState([]);

  let refAlasan = useRef(null);

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

  useEffect(() => {
    if(dataAlasan) {
      listReasons();
    }
  },[dataAlasan]);

  function handleBackButtonClick() {
    return props.navigation.goBack();
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

    await getReasons();
    await setLoading(false);
    await setLoadingFetch(false);
  }

  const getReasons = async () => {
    axios
      .get(props.route.params.base_url + "layanan/getReasons/1", {params: {token: dataLogin.token}})
      .then(res => {
        setDataAlasan(res.data);
      })
      .catch(error => {
        console.log(error);
      })
  }

  const listReasons = async () => {
    const newItems = dataAlasan.data;

    let options = [];
    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_alasan, label: item.alasan}
        )
      });
    }

    setItemsAlasan(options);
  }

  const backToHome = async() => {
    if(props.route.params.onRefresh !== undefined) {
      await props.route.params.refetchData('booking');
      //await props.route.params.onRefresh();
    };
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

  const Reasons = () => {
    const items = itemsAlasan;
    const placeholder = {
      label: 'Pilih alasan pembatalan',
      value: null
    };

    return (
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={(value) => {
          if(value !== idAlasan) {
            const deskripsi = items.filter(
              item => item.value === value
            );

            if(value !== null) {
              setIdAlasan(value);
              setAlasanTolak(deskripsi[0].label);
            }else {
              setIdAlasan('');
              setAlasanTolak(null);
            }
          }
        }}
        style={pickerSelectStyles}
        value={idAlasan}
        useNativeAndroidPickerStyle={false}
        ref={el => {
          refAlasan = el;
        }}
      />
    );
  }

  async function submitTolak() {
    if(alasanTolak === '') {
      formValidation.showError('Alasan penolakan harus diisi...');
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
          await formValidation.showError(success.res.messages);

          //send notif
          success = await formValidation.sendNotif(params);

          if(success.status === true) {
            backToHome();
          }else {
            backToHome();
          }
          
        }else {
          formValidation.showError(success.res.messages);
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
          await formValidation.showError(success.res.messages);

          //set schedule reminder 30 minutes before visit start
          if(dataReservasi[0].id_paket === '1') {
            let reminderTime = new Date();
            let new_params = [];

            new_params.push({
              id: dataReservasi[0].id_jadwal.substring(4),
              client: dataReservasi[0].service_user === 'self' ? dataReservasi[0].client : dataReservasi[0].nama_kerabat,
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
                client: dataReservasi[0].service_user === 'self' ? dataReservasi[0].client : dataReservasi[0].nama_kerabat,
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
          formValidation.showError(success.res.messages);
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
            <View style={styles.wrapperCardAtas}>
              <View style={styles.Group378}>
                <View style={styles.Jenis_layanan_kiri}>
                  <Text style={styles.Txt319}>Kategori Layanan</Text>
                  <Text style={styles.Txt656}>Visit {item.order_type}</Text>
                </View>
                <View style={styles.Jenis_layanan_kanan}>
                  <Text style={styles.Txt319}>Jenis Layanan</Text>
                  <Text style={styles.Txt656}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
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
                <Text style={styles.Txt710}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
              </View>

              <View style={styles.Jadwal1}>
                <Text style={styles.Txt091}>Alamat Client/Pasien</Text>
                <Text style={styles.Txt710}>
                  {item.destination_address}
                </Text>
              </View>
            </View>
            <View style={styles.wrapperPeta}>
              {/*<Text style={styles.Txt091}>Peta Geotag Client</Text>*/}
              <Petapasien style={styles.mapspasien1} lat={parseFloat(item.lat)} lon={parseFloat(item.lon)} />
            </View>

            {!reject ?
              <View style={styles.Group546}>
                <View style={styles.Group814}>
                  <TouchableOpacity
                    style={styles.Tbl_bertemu}
                    onPress={() => refTolak.current.open()}>
                    <Text style={styles.Txt981}>TOLAK</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.Tbl_live_cam}
                    onPress={() => refTerima.current.open()}>
                    <Text style={styles.Txt981}>TERIMA</Text>
                  </TouchableOpacity>
                </View>
              </View>
              :<></>
            }

            <Text style={styles.Txt7101}>
              *Reservasi akan dibatalkan jika anda tidak menerima atau menyetujui
              jadwal reservasi yang masuk.
            </Text>
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
        <Text key={item.id_detail} style={styles.Txt710}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
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
            <View style={styles.wrapperCardAtas}>
              <View style={styles.Group378}>
                <View style={styles.Jenis_layanan_kiri}>
                  <Text style={styles.Txt319}>Kategori Layanan</Text>
                  <Text style={styles.Txt656}>Visit {item.order_type}</Text>
                </View>
                <View style={styles.Jenis_layanan_kanan}>
                  <Text style={styles.Txt319}>Jenis Layanan</Text>
                  <Text style={styles.Txt656}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
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
                <ItemPaket />
              </View>

              <View style={styles.Jadwal1}>
                <Text style={styles.Txt091}>Alamat Client/Pasien</Text>
                <Text style={styles.Txt710}>
                  {item.destination_address}
                </Text>
              </View>
            </View>
            <View style={styles.wrapperPeta}>
              {/*<Text style={styles.Txt091}>Peta Geotag Client</Text>*/}
              <Petapasien style={styles.mapspasien1} lat={parseFloat(item.lat)} lon={parseFloat(item.lon)} />
            </View>

            <View style={styles.Group546}>
              <View style={styles.Group814}>
                <TouchableOpacity
                  style={styles.Tbl_bertemu}
                  onPress={() => refTolak.current.open()}>
                  <Text style={styles.Txt981}>TOLAK</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.Tbl_live_cam}
                  onPress={() => refTerima.current.open()}>
                  <Text style={styles.Txt981}>TERIMA</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.Txt7101}>
              *Reservasi akan dibatalkan jika anda tidak menerima atau menyetujui
              jadwal reservasi yang masuk.
            </Text>
          </View>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  // function onReject() {
  //   setReject(true);
  // }

  // function onCancel() {
  //   setReject(false);
  // }


  const refTerima = useRef();
  const refTolak = useRef();

  const Icons2 = ({label, name}) => {
    return <Icon style={styles.Iconarrow} name={name} />;
  };

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
              style={{
                flex: 1,
                backgroundColor: 'rgba(255, 255, 255, 1)',
                paddingTop: 10,
              }}>

              {/*<View style={styles.User}>
                <View style={styles.subUser}>
                  <TouchableOpacity
                    style={styles.wrapperKembali}
                    onPress={backToHome}>
                    <Icons2
                      label="Panah"
                      name="chevron-back"
                      color="rgba(255, 255, 255, 1)"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.User}>
                <View style={styles.Status}>
                  <View style={styles.Frame15}>
                    <Text style={styles.Txt676}>BOOKING</Text>
                  </View>
                </View>
              </View>*/}
              
              <ScrollView
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
              >

                {!loadingFetch ?
                  <ShowDetail />
                  :<></>
                }

                {/* untuk start pop up tolak */}
                <RBSheet
                  ref={refTolak}
                  closeOnDragDown={false}
                  closeOnPressMask={false}
                  animationType="fade"
                  customStyles={{
                    wrapper: {
                      backgroundColor: 'transparent',
                    },
                    container: {
                      backgroundColor: 'rgba(255, 0, 0, 1)',
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
                      visible={loadingSave}
                      textContent={''}
                      textStyle={styles.spinnerTextStyle}
                      color="#236CFF"
                      overlayColor="rgba(255, 255, 255, 0.5)"
                    />
                    <View style={styles.wrapperJangan}>
                      <View style={styles.Kirim_email}>
                        <Text style={styles.multiple}>Konfirmasi Penolakan</Text>
                        <Text style={styles.multiple1}>
                          Sampaikan alasan penolakan anda!
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => refTolak.current.close()}>
                        <View style={styles.Tbl_iconPanah}>
                          <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View>
                      <View style={styles.Form_pass_lama}>
                        <View style={styles.Form_pass_lama1}>
                          <Reasons />
                        </View>
                      </View>
                      <TouchableOpacity
                        style={{alignItems: 'flex-end', paddingRight: 25}}
                        onPress={submitTolak}>
                        <View style={styles.Btn_tambah_penolakan}>
                          <Text style={styles.Txt6105}>Kirim</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>
                {/* untuk end pop up tolak */}
                {/* untuk start pop up terima */}
                <RBSheet
                  ref={refTerima}
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
                      visible={loadingSave}
                      textContent={''}
                      textStyle={styles.spinnerTextStyle}
                      color="#236CFF"
                      overlayColor="rgba(255, 255, 255, 0.5)"
                    />
                    <View style={styles.wrapperJangan}>
                      <View style={styles.Kirim_email}>
                        <Text style={styles.multiple}>Konfirmasi Aktivitas</Text>
                        <Text style={styles.multiple1}>
                          Dengan anda menerima berarti anda telah setuju dengan syarat dan
                          ketentuan yang berlaku di platform ini.
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => refTerima.current.close()}>
                        <View style={styles.Tbl_iconPanah}>
                          <Icons color="rgba(0,0,0,1)" label="Panah" name="close" />
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity
                        onPress={submitTerima}>
                        <View style={styles.Btn_tambah}>
                          <Text style={styles.Txt6105}>YAKIN DAN SETUJU</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </RBSheet>
                {/* untuk end pop up terima */}
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
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
  mapspasien1: {
    height: 188,
    //borderRadius: 10,
    //padding: '2%'
  },
  wrapperKembali: {
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(67, 169, 221, 1)',
    borderRadius: 100,
    width: 30,
    height: 30,
  },
  Iconarrow: {
    backgroundColor: 'transparent',
    color: 'white',
    fontSize: 14,
    opacity: 0.8,
  },

  Status: {
    flex: 1,
    // height: 30,
  },
  Frame15: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(67,169,221,1)",
  },
  Txt676: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 1)",
    textAlign: "center",
    justifyContent: "center",
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
  wrapperPeta: {
    padding: '2%',
    marginHorizontal: 15,
    marginTop: 20,
    borderRadius: 10,
    justifyContent: 'center',
    //height: 200,
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

  Group814: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  Tbl_bertemu: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '45%',
    backgroundColor: 'rgba(239,70,62,1)',
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
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    width: '45%',
    backgroundColor: 'rgba(36,195,142,1)',
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
  Btn_tambah_penolakan: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
    width: '25%',
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
  Form_pass_lama: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    marginHorizontal: 20,
  },
  Form_pass_lama1: {
    flex: 1,
    justifyContent: 'space-around',
    paddingHorizontal: 15,
    borderRadius: 20,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(184,202,213,1)',
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: '100%',
    fontSize: 12,
    borderColor: 'green',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: '100%',
    fontSize: 12,
    borderColor: 'blue',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});
