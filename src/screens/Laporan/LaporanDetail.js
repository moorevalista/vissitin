import React, { Component, useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  View,
  SafeAreaView,
  TextInput, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Linking, BackHandler
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import IconInfo from 'react-native-vector-icons/Entypo';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment/min/moment-with-locales';
//import 'moment/locale/id';
import Loader from '../../components/Loader';

export default function LaporanDetil(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const id_jadwal = props.route.params.id_jadwal;
  const id_detail = props.route.params.id_detail;
  const id_paket = props.route.params.id_paket;
  const dataReport = props.route.params.dataReport;
  const [dataReportDetail, setDataReportDetail] = useState([]);
  const [thumbImage, setThumbImage] = useState('');

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
    //setDataLogin(formValidation.dataLogin);

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

    if(dataReport) {
      if(id_paket === '1') {
        const newItems = dataReport.filter(
          item => item.id_jadwal === id_jadwal
        );
        setDataReportDetail(newItems);
      }else if(id_paket !== '1') {
        const newItems = dataReport.filter(
          item => item.id_detail === id_detail
        );
        setDataReportDetail(newItems);
      }
    }

    setLoadingFetch(false);
  }

  function openDoc(e) {
    Linking.openURL(e);
  };

  function openFoto(e) {
    Linking.openURL(e);
  };

  function DetailReport() {
    if(dataReportDetail) {
      let filename_dokumen = '';
      let thumbFoto = '';
      return dataReportDetail.map((item, index) => {
        if(item.dokumen_visit !== '' && item.dokumen_visit !== null) {
          filename_dokumen = formValidation.base_url + 'data_assets/dokumen_visit/' + item.dokumen_visit;
        }
        if(item.foto_visit !== '' && item.foto_visit !== null) {
          thumbFoto = formValidation.base_url + 'data_assets/foto_visit/' + item.foto_visit;
        }
        
        return (
          <View key={item.id_jadwal + "|" + item.id_detail} style={styles.Group329}>
            <View style={styles.Data_reservasi}>
              <View style={styles.Group575}>
                <View style={styles.Kategori_layanan_kiri}>
                  <Text style={styles.Txt596}>Kategori Layanan</Text>
                  <Text style={styles.Txt375}>{item.order_type}</Text>
                </View>
                <View style={styles.Kategori_layanan_kanan}>
                  <Text style={styles.Txt596}>Jenis Layanan</Text>
                  <Text style={styles.Txt375}>{item.id_paket === '1' ? 'Reguler' : 'Khusus'}</Text>
                </View>
              </View>
              <View style={styles.Group575}>
                <View style={styles.Kategori_layanan_kiri}>
                  <Text style={styles.Txt596}>Nama Pasien</Text>
                  <Text style={styles.Txt375}>{item.service_user === 'self' ? item.client : item.nama_kerabat}</Text>
                </View>
                <View style={styles.Kategori_layanan_kanan}>
                  <Text style={styles.Txt596}>Nama Nakes</Text>
                  <Text style={styles.Txt375}>{item.nakes}</Text>
                </View>
              </View>
              <View style={styles.Jadwal1}>
                <Text style={styles.Txt881}>Jadwal Reservasi</Text>
                <Text style={styles.Txt662}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' WIB'}</Text>
              </View>
            </View>
            <View style={styles.Hasil_pemeriksaan}>
              <Text style={styles.Txt957}>HASIL PEMERIKSAAN</Text>
            </View>
            <View style={styles.sub_Hasil_pemeriksaan} />
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="md-add-circle" />
                <Text style={styles.Txt0810}>Keluhan Utama</Text>
              </View>
              <Text style={styles.Txt874}>{item.keluhan_utama}</Text>
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="md-alert-circle" />

                <Text style={styles.Txt0810}>Pemeriksaan Umum</Text>
              </View>
              <Text style={styles.Txt874}>{item.pemeriksaan_umum}</Text>
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="flask-sharp" />

                <Text style={styles.Txt0810}>Pemeriksaan Khusus</Text>
              </View>
              <Text style={styles.Txt874}>{item.pemeriksaan_khusus}</Text>
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="info" name="info" />

                <Text style={styles.Txt0810}>Pemeriksaan Penunjang</Text>
              </View>
              <Text style={styles.Txt874}>{item.pemeriksaan_penunjang}</Text>
            </View>
            <View style={styles.sub_Hasil_pemeriksaan} />
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="flash-sharp" />
                <Text style={styles.Txt0810}>Diagnosa Tenaga Professional</Text>
              </View>
              <Text style={styles.Txt874}>{item.diagnosa_nakes}</Text>
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="ios-bar-chart-sharp" />
                <Text style={styles.Txt0810}>Target dan Potensi</Text>
              </View>
              <Text style={styles.Txt874}>
                {item.target_potensi}
              </Text>
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="ios-bar-chart-sharp" />
                <Text style={styles.Txt0810}>Tindakan Intervensi</Text>
              </View>
              <Text style={styles.Txt874}>
                {item.intervensi}
              </Text>
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="ios-bar-chart-sharp" />
                <Text style={styles.Txt0810}>Home Program</Text>
              </View>
              <Text style={styles.Txt874}>
                {item.home_program}
              </Text>
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="ios-bookmark" />
                <Text style={styles.Txt0810}>Catatan Khusus</Text>
              </View>
              <Text style={styles.Txt874}>{item.catatan_tambahan}</Text>
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="document" />
                <Text style={styles.Txt0810}>Dokumen Penunjang</Text>
              </View>
              {(thumbFoto == '' && item.dokumen_visit == '') ? <Text style={styles.Txt874}>Tidak ada..</Text>:<></>}
            </View>
            <View style={styles.Group814}>
              {thumbFoto !== '' ?
                <TouchableOpacity
                  style={styles.Tbl_bertemu}
                  onPress={() => openFoto(thumbFoto)}>
                  <View style={styles.Tbl_iconPanah}>
                    {/*<Icons label="Panah" name="image" fontSize={28} />*/}
                    <Image
                      source={{uri: thumbFoto}}
                      resizeMode="cover"
                      style={styles.image}
                    />
                  </View>
                </TouchableOpacity>
                :
                <></>
              }

              {item.dokumen_visit !== '' ?
                <TouchableOpacity
                  style={styles.Tbl_live_cam}
                  onPress={() => openDoc(filename_dokumen)}>
                  <View style={styles.Tbl_iconPanah}>
                    <Icons label="Panah" name="document" fontSize={28} />
                  </View>
                </TouchableOpacity>
                :
                <></>
              }
            </View>
            
            {/*<TouchableOpacity style={styles.Keluhan_utama11} onPress={() => null}>
              <View style={styles.Tbl_iconPanahDownload}>
                <Icons
                  label="Panah"
                  name="download-outline"
                  color="rgba(255, 255, 255, 1)"
                  fontSize={28}
                />
              </View>
              <Text style={styles.Txt0810}>Simpan Laporan (*PDF)</Text>
            </TouchableOpacity>*/}
          </View>
        )
      })
    }else {
      return (
        <></>
      )
    }
  }

  // untuk icon
  const Icons = ({label, name, color, fontSize}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: fontSize ? fontSize : 14,
            opacity: 0.8,
          }}
          name={name}
        />
      );
    }
    if (label == 'info') {
      return <IconInfo style={styles.Iconarrow} name={name} />;
    }
  };
  return (
    !loadingFetch ?
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
          <ScrollView
            showsVerticalScrollIndicator={false}
            horizontal={false}
            contentContainerStyle={styles.scrollArea_contentContainerStyle}
          >
            <DetailReport />
          </ScrollView>
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
  image: {
    flex: 1,
    height: 200,
    width: '100%',
    marginTop: '2%',
    alignSelf: "center",
    borderRadius: 10,
  },

  Group329: {
    display: 'flex',
    flexDirection: 'column',
    borderColor: 'rgba(167,169,172,1)',
    marginHorizontal: 25,
  },
  Data_reservasi: {
    display: 'flex',
    flexDirection: 'column',
    paddingVertical: 19,
    paddingHorizontal: 19,
    marginVertical: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(79,92,99,1)',
  },
  Group575: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  Txt596: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(167,169,172,1)',
  },
  Txt375: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },

  Kategori_layanan_kiri: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  Kategori_layanan_kanan: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },

  Jadwal1: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  Txt881: {
    fontSize: 10,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(167,169,172,1)',
    textAlign: 'center',
  },
  Txt662: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
    textAlign: 'center',
  },

  Hasil_pemeriksaan: {
    alignItems: 'center',
    marginBottom: 10,
  },
  sub_Hasil_pemeriksaan: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(0,0,0,1)',
    height: 1,
    marginBottom: 10,
  },
  Txt957: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 17,
    color: 'rgba(79,92,99,1)',
    textAlign: 'center',
    justifyContent: 'center',
  },

  Keluhan_utama1: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginVertical: 10,
  },
  Keluhan_utama: {
    display: 'flex',
    flexDirection: 'row',
  },
  Keluhan_utama11: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  Txt0810: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: 'rgba(79,92,99,1)',
    paddingLeft: 10,
  },

  Txt874: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(79,92,99,1)',
    paddingLeft: 25,
  },
  Group814: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10
  },
  Tbl_bertemu: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    width: '40%',
    backgroundColor: '#D9D9D9',
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
    width: '40%',
    backgroundColor: '#D9D9D9',
  },

  Tbl_iconPanah: {
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 100,
    // marginBottom: 10,
    width: '100%',
    height: 80,
  },
  Tbl_iconPanahDownload: {
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: 10,
    width: 50,
    height: 50,
    backgroundColor: 'green',
  },
});
