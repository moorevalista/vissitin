import React, { Component, useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput, Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Linking } from "react-native";
import Lapheader from "../components/Lapheader";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Sharebtn from "../components/Sharebtn";
import Footer from "../components/Footer";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import 'moment/locale/id';
import Loader from '../components/Loader';

function Laporanview(props) {
  const formValidation = useContext(form_validation);
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
    Linking.canOpenURL(e).then(supported => {
      if (supported) {
        Linking.openURL(e);
      } else {
        console.log("Don't know how to open URI: " + e);
      }
    });
  };

  function openFoto(e) {
    Linking.canOpenURL(e).then(supported => {
      if (supported) {
        Linking.openURL(e);
      } else {
        console.log("Don't know how to open URI: " + e);
      }
    });
  };

  function DetailReport() {
    if(dataReportDetail) {
      let filename_dokumen = '';
      let thumbFoto = '';
      return dataReportDetail.map((item, index) => {
        if(item.dokumen_visit !== '' && item.dokumen_visit !== null) {
          filename_dokumen = props.route.params.base_url + 'data_assets/dokumen_visit/' + item.dokumen_visit;
        }
        if(item.foto_visit !== '' && item.foto_visit !== null) {
          thumbFoto = props.route.params.base_url + 'data_assets/foto_visit/' + item.foto_visit;
        }
        
        return (
          <View key={item.id_jadwal + "|" + item.id_detail}>
            <View style={styles.iconStack}>
              <Text style={styles.label1}>Reff. ID</Text>
              <Text style={styles.label2}>{item.id_referensi}</Text>
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
              <Text style={styles.label2}>{moment(item.order_date).format('dddd') + ', ' + moment(item.order_date).format('DD/MM/YYYY') + ' - ' + item.order_start_time.substr(0, 5) + ' wib'}</Text>
            </View>
            <View style={styles.iconStack}>     
              <Text style={styles.label1}>Laporan Kunjungan</Text>                   
              <View style={styles.lapcontent}>
                <View style={styles.sublaporan}>
                  <Text style={styles.label3}>Keluhan Utama</Text>
                  <View style={styles.rect}>
                    <TextInput
                      placeholder="Utama"
                      style={styles.inputBox}
                      multiline={true}
                      editable={false}
                      value={item.keluhan_utama}
                    />
                  </View>
                </View>

                <View style={styles.sublaporan}>
                  <Text style={styles.label3}>Pemeriksaan Umum</Text>
                  <View style={styles.rect}>
                    <TextInput
                      placeholder="Umum"
                      style={styles.inputBox}
                      multiline={true}
                      editable={false}
                      value={item.pemeriksaan_umum}
                    />
                  </View>
                  <Text style={styles.label4}>Contoh : Kesadaran, Tekanan Darah, dll</Text>
                </View>

                <View style={styles.sublaporan}>
                  <Text style={styles.label3}>Pemeriksaan Khusus</Text>
                  <View style={styles.rect}>
                    <TextInput
                      placeholder="Khusus"
                      style={styles.inputBox}
                      multiline={true}
                      editable={false}
                      value={item.pemeriksaan_khusus}
                    />
                  </View>
                </View>

                <View style={styles.sublaporan}>
                  <Text style={styles.label3}>Pemeriksaan Penunjang</Text>
                  <View style={styles.rect}>
                    <TextInput
                      placeholder="Penunjang"
                      style={styles.inputBox}
                      multiline={true}
                      editable={false}
                      value={item.pemeriksaan_penunjang}
                    />
                  </View>
                </View>

                <View style={styles.sublaporan}>
                  <Text style={styles.label3}>Diagnosa Tenaga Kesehatan</Text>
                  <View style={styles.rect}>
                    <TextInput
                      placeholder="Hasil Diagnosa"
                      style={styles.inputBox}
                      multiline={true}
                      editable={false}
                      value={item.diagnosa_nakes}
                    />
                  </View>
                </View>

                <View style={styles.sublaporan}>
                  <Text style={styles.label3}>Target dan Potensi</Text>
                  <View style={styles.rect}>
                    <TextInput
                      placeholder="Target dan Potensi"
                      style={styles.inputBox}
                      multiline={true}
                      editable={false}
                      value={item.target_potensi}
                    />
                  </View>
                </View>

                <View style={styles.sublaporan}>
                  <Text style={styles.label3}>Tindakan Intervensi</Text>
                  <View style={styles.rect}>
                    <TextInput
                      placeholder="Intervensi"
                      style={styles.inputBox}
                      multiline={true}
                      editable={false}
                      value={item.intervensi}
                    />
                  </View>
                </View>

                <View style={styles.sublaporan}>
                  <Text style={styles.label3}>Home Program</Text>
                  <View style={styles.rect}>
                    <TextInput
                      placeholder="Tindakan di rumah"
                      style={styles.inputBox}
                      multiline={true}
                      editable={false}
                      value={item.home_program}
                    />
                  </View>
                </View>

                <View style={styles.sublaporan}>
                  <Text style={styles.label3}>Catatan Khusus</Text>
                  <View style={styles.rect}>
                    <TextInput
                      placeholder="Catatan Khusus"
                      style={styles.inputBox}
                      multiline={true}
                      editable={false}
                      value={item.catatan_tambahan}
                    />
                  </View>
                </View>

                <View style={styles.sublaporan}>
                  <Text style={styles.label3}>Dokumen Tambahan</Text>
                  <View style={styles.rect}>
                    <View style={styles.viewFile}>
                      <Text style={styles.label5}>Dokumen Pendukung Laporan</Text>
                      {item.dokumen_visit !== '' ?
                        <TouchableOpacity style={styles.btn} onPress={() => openDoc(filename_dokumen)}>
                          <Text style={styles.button}>Lihat Dokumen</Text>
                        </TouchableOpacity>
                        :<><Text style={{alignSelf: "center", fontSize: 12, fontStyle: "italic"}}>Tidak ada dokumen</Text></>}
                    </View>
                    <View style={styles.viewPhoto}>
                      <Text style={styles.label5}>Foto Pendukung Laporan</Text>
                        {item.foto_visit !== '' ?
                          <TouchableOpacity style={styles.btn1} onPress={() => openFoto(thumbFoto)}>
                            <Image
                              source={{uri: thumbFoto}}
                              style={[styles.image, {}]}
                              resizeMode="contain"
                            />
                          </TouchableOpacity>
                          :<><Text style={{alignSelf: "center", fontSize: 12, fontStyle: "italic"}}>Tidak ada foto</Text></>
                        }
                    </View>
                  </View>
                </View>

              </View>
              {/*<Sharebtn style={styles.cupertinoButtonInfo1}></Sharebtn>*/}
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
            <Lapheader style={styles.lapheader1} props={props} backScreen="laporanScreen" />
            <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                  >
              <View style={styles.container}>
                <View style={styles.scrollAreaStack}>
                  <View style={[styles.scrollArea, styles.inner]}>
                    <View style={styles.iconStack}>
                      <Icon name="card-account-details" style={styles.icon}></Icon>
                      <Text style={styles.textHeader}>LAPORAN</Text>
                    </View>

                    <DetailReport />
                      
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
  lapheader1: {
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
    color: "#00a732",
    fontSize: 30,
    textAlign: "center",
    alignSelf: "flex-start",
    height: 'auto',
    width: '100%',
    padding: '1%',
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
  label3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12
  },
  label4: {
    fontFamily: "roboto-regular",
    color: "#41aadf",
    fontSize: 10,
    textAlign: "right"
  },
  label5: {
    fontFamily: "roboto-regular",
    color: "#41aadf",
    fontSize: 12,
    textAlign: "center",
    marginBottom: '2%'
  },
  rect: {
    height: 'auto',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(65,170,223,1)",
    padding: '2%'
  },
  inputBox: {
    fontFamily: "roboto-regular",
    color: "rgba(74,74,74,1)",
    minHeight: 50,
    height: 'auto',
    width: '100%'
  },
  lapcontent: {
    height: 'auto',
    marginTop: '2%',
    padding: '2%'
  },
  sublaporan: {
    height: 'auto',
    alignSelf: "stretch",
    marginBottom: 10
  },
  viewFile: {
    flex: 1,
    height: 'auto',
    justifyContent: "center"
  },
  viewPhoto: {
    flex: 1,
    height: 'auto',
    justifyContent: "center",
    marginTop: 20,
  },
  image: {
    width: '100%',
    height: 200,
    padding: 10,
    //borderWidth: 1
  },
  textHeader: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    textAlign: "center",
    fontSize: 16
  },
  cupertinoButtonInfo1: {
    marginTop: 10,
    height: 40,
    width: 'auto',
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
  btn: {
    backgroundColor: "#41D3FC",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    borderRadius: 5,
    padding: '2%',
    width: '50%'
  },
  btn1: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    width: '100%'
  },
  button: {
    color: "#fff",
    fontSize: 12
  }
});

export default Laporanview;
