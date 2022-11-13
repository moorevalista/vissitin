import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
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
import Icon from 'react-native-vector-icons/Ionicons';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment/min/moment-with-locales';
//import 'moment/locale/id';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { CommonActions } from '@react-navigation/native';
import Loader from '../../components/Loader';
import axios from 'axios';

export default function DetailSelesai(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const id_jadwal = props.route.params.id_jadwal;
  const id_detail = props.route.params.id_detail;
  const id_paket = props.route.params.id_paket;
  const dataCloseTrx = props.route.params.dataCloseTrx;
  const [dataCloseTrxDetail, setDataCloseTrxDetail] = useState([]);

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
      if(id_paket !== '1') {
        await getCloseTrxDetail(id_jadwal, id_detail);
      }
    }

    await setLoading(false);
    await setLoadingFetch(false);
  }

  async function getCloseTrxDetail(id_jadwal, id_detail) {
    await setLoading(true);
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      id_jadwal: id_jadwal,
      id_detail: id_detail,
      token: dataLogin.token
    });

    success = await formValidation.getCloseTrxDetail(params);
    
    if(success.status === true) {
      try {
        await setDataCloseTrxDetail(success.res);
      } catch (error) {
        alert(error);
      } finally {

      }
    }
    await setLoading(false);
  }

  function ShowDetail() {
    if(id_paket !== '1') {
      return (
        <CloseTrxPaket />
      )
    }else {
      return (
        <CloseTrx />
      )
    }
  }

  function CloseTrx() {
    const newItems = dataCloseTrx.filter(
      item => item.id_jadwal === id_jadwal
    );

    if(newItems) {
      return newItems.map((item, index) => {
        let order_price = parseFloat(item.order_price);
        let order_discount = parseFloat(item.order_discount);
        let platform_fee = parseFloat(item.biaya_platform);
        let sewa_alat = parseFloat(0);
        let sewa_tempat = parseFloat(0);
        let total_price = (order_price + sewa_alat + sewa_tempat) - (order_discount);
        let total_income = (order_price + sewa_alat + sewa_tempat) - (order_discount + platform_fee);

        const total_bill = formValidation.convertDecimal(total_price.toString());
        const total = formValidation.convertDecimal(total_income.toString());
        const biaya_layanan = formValidation.convertDecimal(order_price.toString());
        const biaya_potongan = formValidation.convertDecimal(order_discount.toString());
        const biaya_platform = formValidation.convertDecimal(platform_fee.toString());
        const tool_fee = formValidation.convertDecimal(sewa_alat.toString());
        const place_fee = formValidation.convertDecimal(sewa_tempat.toString());

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
                  <Text style={styles.Txt656}>{formValidation.currencyFormat(total_bill)}</Text>
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
                <Text style={styles.Txt710}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' WIB' + ' | (' + item.order_state + ')'}</Text>
              </View>

              <View style={styles.Jadwal1}>
                <Text style={styles.Txt091}>Alamat Client/Pasien</Text>
                <Text style={styles.Txt710}>
                  {item.destination_address}
                </Text>
              </View>
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
    const itemDetail = dataCloseTrxDetail.jadwal;
    if(itemDetail) {
      return itemDetail.map((item, index) => {
        return (
          <Text key={item.id_detail} style={styles.Txt710}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' WIB' + ' | (' + item.order_state + ')'}</Text>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  function CloseTrxPaket() {
    const newItems = dataCloseTrx.filter(
      item => item.id_jadwal === id_jadwal && item.id_detail === id_detail
    );

    if(newItems) {
      return newItems.map((item, index) => {
        let order_price = parseFloat(item.order_price);
        let order_discount = parseFloat(item.order_discount);
        let platform_fee = parseFloat(item.biaya_platform);
        let sewa_alat = parseFloat(0);
        let sewa_tempat = parseFloat(0);
        let total_price = (order_price + sewa_alat + sewa_tempat) - (order_discount);
        let total_income = (order_price + sewa_alat + sewa_tempat) - (order_discount + platform_fee);

        const total_bill = formValidation.convertDecimal(total_price.toString());
        const total = formValidation.convertDecimal(total_income.toString());
        const biaya_layanan = formValidation.convertDecimal(order_price.toString());
        const biaya_potongan = formValidation.convertDecimal(order_discount.toString());
        const biaya_platform = formValidation.convertDecimal(platform_fee.toString());
        const tool_fee = formValidation.convertDecimal(sewa_alat.toString());
        const place_fee = formValidation.convertDecimal(sewa_tempat.toString());

        return (
          <View key={item.id_jadwal + "|" + item.id_detail}>
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
                  <Text style={styles.Txt656}>{formValidation.currencyFormat(total_bill)}</Text>
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
          </View>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  const backToHome = async() => {
    // if(props.route.params.onRefresh !== undefined) {
    //   await props.route.params.refetchData('booking');
    //   //await props.route.params.onRefresh();
    // };
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

  const Icons2 = ({label, name}) => {
    return <Icon style={styles.Iconarrow} name={name} />;
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
                    <Text style={styles.Txt676}>SELESAI</Text>
                  </View>
                </View>
              </View>*/}
              
              <ScrollView
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
              >

                <ShowDetail />

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
  iconStack: {
    flex: 1,
    height: 'auto',
    marginTop: '2%',
    padding: '2%'
  },
  label1: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    fontSize: 14,
  },
  image: {
    width: 300,
    height: 300,
    alignSelf: "center"
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
});
