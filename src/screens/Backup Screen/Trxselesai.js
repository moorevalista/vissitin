import React, { Component, useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, ScrollView, Text, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import Transaksihead from "../components/Transaksihead";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Footer from "../components/Footer";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import 'moment/locale/id';
import Loader from '../components/Loader';

function Trxselesai(props) {
  const formValidation = useContext(form_validation);
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
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Reff. ID</Text>
              <Text style={styles.label2}>{item.id_jadwal}</Text>
            </View>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>User</Text>
              <Text style={styles.label2}>{item.client}</Text>
            </View>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Pasien</Text>
              <Text style={styles.label2}>{item.service_user === 'self' ? item.client : item.nama_kerabat}</Text>
            </View>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Jadwal</Text>
              <Text style={styles.label2}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib' + ' | (' + item.order_state + ')'}</Text>
            </View>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Layanan</Text>
              <Text style={styles.label2}>Visit {item.order_type}</Text>
            </View>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Paket Layanan</Text>
              <Text style={styles.label2}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
            </View>
                    
            <View style={styles.iconStack}>
              <Text style={styles.label1}>RINCIAN BIAYA</Text>
              <View style={styles.rincianbiaya}>
                <View style={styles.boxrincianbiaya}>
                  <View style={styles.labeltarif}>
                    <Text style={styles.labeltarifLayanan}>Tarif Layanan</Text>
                    <Text style={styles.labelSeparator}>Rp.</Text>
                    <Text style={styles.infotarifLayanan}>{biaya_layanan}</Text>
                  </View>
                  {/*<View style={styles.labeltarif}>
                    <Text style={styles.labeltarifLayanan}>Sewa Alat</Text>
                    <Text style={styles.labelSeparator}>Rp.</Text>
                    <Text style={styles.infotarifLayanan}>{tool_fee}</Text>
                  </View>
                  <View style={styles.labeltarif}>
                    <Text style={styles.labeltarifLayanan}>Sewa Tempat</Text>
                    <Text style={styles.labelSeparator}>Rp.</Text>
                    <Text style={styles.infotarifLayanan}>{place_fee}</Text>
                  </View>*/}
                  <View style={styles.labeltarif}>
                    <Text style={styles.labeltarifLayanan}>Biaya Platform</Text>
                    <Text style={styles.labelSeparator}>Rp.</Text>
                    <Text style={styles.infotarifLayanan}>({biaya_platform})</Text>
                  </View>
                  <View style={styles.labeltarif}>
                    <Text style={styles.labeltarifLayanan}>Diskon</Text>
                    <Text style={styles.labelSeparator}>Rp.</Text>
                    <Text style={styles.infotarifLayanan}>({biaya_potongan})</Text>
                  </View>
                  <View style={styles.labeltarif}>
                    <Text style={[styles.labeltarifLayanan, {fontWeight: 'bold'}]}>Total Pendapatan</Text>
                    <Text style={[styles.labelSeparator, {fontWeight: 'bold'}]}>Rp.</Text>
                    <Text style={[styles.infotarifLayanan, {fontWeight: 'bold'}]}>{total}</Text>
                  </View>
                </View>
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
          <Text key={item.id_detail} style={styles.label2}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib' + ' | (' + item.order_state + ')'}</Text>
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
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Reff. ID</Text>
              <Text style={styles.label2}>{item.id_jadwal}</Text>
            </View>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>User</Text>
              <Text style={styles.label2}>{item.client}</Text>
            </View>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Pasien</Text>
              <Text style={styles.label2}>{item.service_user === 'self' ? item.client : item.nama_kerabat}</Text>
            </View>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Jadwal</Text>
              <ItemPaket />
            </View>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Layanan</Text>
              <Text style={styles.label2}>Visit {item.order_type}</Text>
            </View>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Paket Layanan</Text>
              <Text style={styles.label2}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
            </View>
                    
            <View style={styles.iconStack}>
              <Text style={styles.label1}>RINCIAN BIAYA</Text>
              <View style={styles.rincianbiaya}>
                <View style={styles.boxrincianbiaya}>
                  <View style={styles.labeltarif}>
                    <Text style={styles.labeltarifLayanan}>Tarif Layanan</Text>
                    <Text style={styles.labelSeparator}>Rp.</Text>
                    <Text style={styles.infotarifLayanan}>{biaya_layanan}</Text>
                  </View>
                  {/*<View style={styles.labeltarif}>
                    <Text style={styles.labeltarifLayanan}>Sewa Alat</Text>
                    <Text style={styles.labelSeparator}>Rp.</Text>
                    <Text style={styles.infotarifLayanan}>{tool_fee}</Text>
                  </View>
                  <View style={styles.labeltarif}>
                    <Text style={styles.labeltarifLayanan}>Sewa Tempat</Text>
                    <Text style={styles.labelSeparator}>Rp.</Text>
                    <Text style={styles.infotarifLayanan}>{place_fee}</Text>
                  </View>*/}
                  <View style={styles.labeltarif}>
                    <Text style={styles.labeltarifLayanan}>Biaya Platform</Text>
                    <Text style={styles.labelSeparator}>Rp.</Text>
                    <Text style={styles.infotarifLayanan}>({biaya_platform})</Text>
                  </View>
                  <View style={styles.labeltarif}>
                    <Text style={styles.labeltarifLayanan}>Diskon</Text>
                    <Text style={styles.labelSeparator}>Rp.</Text>
                    <Text style={styles.infotarifLayanan}>({biaya_potongan})</Text>
                  </View>
                  <View style={styles.labeltarif}>
                    <Text style={[styles.labeltarifLayanan, {fontWeight: 'bold'}]}>Total Pendapatan</Text>
                    <Text style={[styles.labelSeparator, {fontWeight: 'bold'}]}>Rp.</Text>
                    <Text style={[styles.infotarifLayanan, {fontWeight: 'bold'}]}>{total}</Text>
                  </View>
                </View>
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
                  <View style={styles.iconStack}>
                    <Icon name="check-decagram" style={styles.icon}></Icon>
                    <Text style={styles.selesai}>SELESAI</Text>
                  </View>
                  
                  <ShowDetail />

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
  iconStack: {
    flex: 1,
    height: 'auto',
    marginTop: '2%',
    padding: '2%'
  },
  icon: {
    height: 'auto',
    color: "rgba(0,217,41,1)",
    fontSize: 30,
    textAlign: "center",
    alignSelf: "flex-start",
    height: 'auto',
    width: '100%',
    padding: '1%',
  },
  selesai: {
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
  rincianbiaya: {
    height: 'auto',
    padding: '2%'
  },
  boxrincianbiaya: {
    height: 'auto',
    padding: '2%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
  },
  labeltarif: {
    width: '100%',
    height: 'auto',
    flexDirection: 'row',
  },
  labeltarifLayanan: {
    fontFamily: "roboto-regular",
    color: "#121212",
    width: '65%',
    alignSelf: 'flex-start',
  },
  labelSeparator: {
    fontFamily: "roboto-regular",
    color: "#121212",
    width: '10%',
    alignSelf: 'flex-start',
  },
  infotarifLayanan: {
    fontFamily: "roboto-regular",
    color: "#121212",
    width: '25%',
    alignSelf: 'flex-start',
    textAlign: 'right',
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

export default Trxselesai;
