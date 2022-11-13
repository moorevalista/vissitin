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
import { launchCamera, launchImageLibrary, ImagePicker } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

function Laporaninput(props) {
  const formValidation = useContext(form_validation);
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  const refKeluhan = useRef(null);
  const refPemeriksaan_umum = useRef(null);
  const refDiagnosa_nakes = useRef(null);
  const refTarget_potensi = useRef(null);
  const refIntervensi = useRef(null);
  const refHome_program = useRef(null);

  const [inputError, setInputError] = useState('');

  //from prev page
  const id_jadwal = props.route.params.dataJadwal[0].id_jadwal;
  const id_detail = props.route.params.dataJadwal[0].id_detail;
  const id_paket = props.route.params.dataJadwal[0].id_paket;
  const dataLogin = props.route.params.dataLogin;
  const dataJadwal = props.route.params.dataJadwal;

  //from database if already exist
  const [dataReport, setDataReport] = useState(props.route.params.dataReport);

  //for input report
  const [keluhan_utama, setKeluhan_utama] = useState('');
  const [pemeriksaan_umum, setPemerksaan_umum] = useState('');
  const [pemeriksaan_khusus, setPemerksaan_khusus] = useState('');
  const [pemeriksaan_penunjang, setPemerksaan_penunjang] = useState('');
  const [diagnosa_nakes, setDiagnosa_nakes] = useState('');
  const [target_potensi, setTarget_potensi] = useState('');
  const [intervensi, setIntervensi] = useState('');
  const [home_program, setHome_program] = useState('');
  const [catatan_tambahan, setCatatan_tambahan] = useState('');
  const [dokumen_visit, setDokumen_visit] = useState('');
  const [foto_visit, setFoto_visit] = useState('');

  const [thumbFoto, setThumbFoto] = useState('');
  const [filename_dokumen, setFilename_dokumen] = useState('');

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
  },[]);

  useEffect(() => {
    setLoading(true);
    if(dataLogin) {
      setCurrentDataNakes();
    }

    return () => {
      setLoading(false);
    }
  },[dataLogin]);

  const setCurrentDataNakes = async () => {
    //alert(JSON.stringify(dataJadwal));
    //await getCurrentReport();
    await setLoading(false);
  }

  /*async function getCurrentReport() {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      id_nakes: dataLogin.id_nakes,
      id_jadwal: dataJadwal[0].id_jadwal,
      id_paket: dataJadwal[0].id_paket,
      id_detail: dataJadwal[0].id_detail,
      token: dataLogin.token
    });

    success = await formValidation.getCurrentReport(params);

    if(success.status === true) {
      if(success.res.responseCode === '000') {
        await setDataReport(success.res.data);
      }
    }
  }*/

  async function handleValidSubmit() {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      keluhan_utama: keluhan_utama,
      pemeriksaan_umum: pemeriksaan_umum,
      diagnosa_nakes: diagnosa_nakes,
      intervensi: intervensi,
      target_potensi: target_potensi,
      home_program: home_program
    });

    success = await formValidation.handlePreSubmitReport(params);

    if(success.status === true) {
      return true;
    }else {
      try {
        if(success.keluhan_utama !== '') {
          refKeluhan.current.focus();
          formValidation.showError(success.keluhan_utama);
          setInputError('keluhan_utama');
          return;
        }else if(success.pemeriksaan_umum !== '') {
          refPemeriksaan_umum.current.focus();
          formValidation.showError(success.pemeriksaan_umum);
          setInputError('pemeriksaan_umum');
          return;
        }else if(success.diagnosa_nakes !== '') {
          refDiagnosa_nakes.current.focus();
          formValidation.showError(success.diagnosa_nakes);
          setInputError('diagnosa_nakes');
          return;
        }else if(success.target_potensi !== '') {
          refTarget_potensi.current.focus();
          formValidation.showError(success.target_potensi);
          setInputError('target_potensi');
          return;
        }else if(success.intervensi !== '') {
          refIntervensi.current.focus();
          formValidation.showError(success.intervensi);
          setInputError('intervensi');
          return;
        }else if(success.home_program !== '') {
          refHome_program.current.focus();
          formValidation.showError(success.home_program);
          setInputError('home_program');
          return;
        }
      } catch (error) {
        throw(error);
      }
      return false;
    }
  }

  async function onSubmit() {
    const valid = await handleValidSubmit();
    if(valid) {
      setLoadingSave(true);
      let params = [];
      let dataLaporan = {
        keluhan_utama: keluhan_utama,
        pemeriksaan_umum: pemeriksaan_umum,
        pemeriksaan_khusus: pemeriksaan_khusus,
        pemeriksaan_penunjang: pemeriksaan_penunjang,
        diagnosa_nakes: diagnosa_nakes,
        target_potensi: target_potensi,
        intervensi: intervensi,
        home_program: home_program,
        catatan_tambahan: catatan_tambahan
      };

      params.push({
        base_url: props.route.params.base_url,
        id_nakes: dataLogin.id_nakes,
        id_jadwal: dataJadwal[0].id_jadwal,
        id_detail: dataJadwal[0].id_detail,
        dataLaporan: dataLaporan,
        dokumen_visit: dokumen_visit,
        foto_visit: foto_visit,
        token: dataLogin.token
      });

      success = await formValidation.saveVisitReport(params);

      if(success.status === true) {
        if(success.res.responseCode === '000') {
          formValidation.showError(success.res.messages);
          props.route.params.onRefresh();
          props.navigation.goBack();
        }else {
          (success.res.messages[0].length > 1) ? formValidation.showError(success.res.messages[0]) : formValidation.showError(success.res.messages);
        }
      }
      setLoadingSave(false);
    }
  }

  const handleChoosePhoto = () => {
    let options = {
      mediaType: 'photo',
      maxWidth: 1024
    };

    launchCamera(options, (response) => { // Use launchImageLibrary to open image gallery
      //console.log('Response = ', response);
    
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        console.log(response);
        //if((response.assets[0].fileSize * 10240) > 2048) {
        //  showError('Ukuran foto tidak boleh lebih dari 2Mb !!!');
        //  return;
        //}

        const source = response.assets[0].uri;
    
        // You can also display the image using data:
        // const source = { uri: 'data:image/jpeg;base64,' + response.data };
    
        console.log(source);
        setThumbFoto(source);
        setFoto_visit(response.assets[0]);
        
        //console.log(imageKTP.height);
      }
    });
  }

  const handleChooseFile = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf]
      })

      console.log(
        res
      )

      if(res[0].size > 2048000) {
        formValidation.showError('Ukuran dokumen tidak boleh lebih dari 2Mb !!!');
      }

      //setFilename_dokumen(res[0].name);
      setDokumen_visit(res[0]);

    } catch (error) {
      if(DocumentPicker.isCancel(error)) {

      }else {
        throw(error)
      }
    }
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
    const item = dataReport;
    let filename_dokumen = '';
    let thumbFoto = '';
    if(item) {
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
              <Text style={styles.label1}>User/Pasien</Text>
              <Text style={styles.label2}>{item.client}</Text>
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

                    {dataReport ?
                      <DetailReport />
                      :
                      <View>
                        <View style={styles.iconStack}>
                          <Text style={styles.label1}>User/Pasien</Text>
                          <Text style={styles.label2}>{dataJadwal[0].client}</Text>
                        </View>
                        <View style={styles.iconStack}>
                          <Text style={styles.label1}>Jadwal</Text>
                          <Text style={styles.label2}>{moment(dataJadwal[0].order_date).format('dddd') + ', ' + moment(dataJadwal[0].order_date).format('DD/MM/YYYY') + ' - ' + dataJadwal[0].order_start_time.substr(0, 5) + ' wib'}</Text>
                        </View>
                        <View style={styles.iconStack}>     
                          <Text style={styles.label1}>Laporan Kunjungan</Text>                   
                          <View style={styles.lapcontent}>
                            <View style={styles.sublaporan}>
                              <Text style={styles.label3}>Keluhan Utama</Text>
                              <View style={inputError === 'keluhan_utama' ? [styles.rect, {borderColor: 'red'}] : styles.rect}>
                                <TextInput
                                  placeholder="Utama"
                                  style={styles.inputBox}
                                  multiline={true}
                                  editable={true}
                                  ref={refKeluhan}
                                  value={keluhan_utama}
                                  onChangeText={setKeluhan_utama}
                                />
                              </View>
                            </View>

                            <View style={styles.sublaporan}>
                              <Text style={styles.label3}>Pemeriksaan Umum</Text>
                              <View style={inputError === 'pemeriksaan_umum' ? [styles.rect, {borderColor: 'red'}] : styles.rect}>
                                <TextInput
                                  placeholder="Umum"
                                  style={styles.inputBox}
                                  multiline={true}
                                  editable={true}
                                  ref={refPemeriksaan_umum}
                                  value={pemeriksaan_umum}
                                  onChangeText={setPemerksaan_umum}
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
                                  editable={true}
                                  value={pemeriksaan_khusus}
                                  onChangeText={(e) => setPemerksaan_khusus(e)}
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
                                  editable={true}
                                  value={pemeriksaan_penunjang}
                                  onChangeText={(e) => setPemerksaan_penunjang(e)}
                                />
                              </View>
                            </View>

                            <View style={styles.sublaporan}>
                              <Text style={styles.label3}>Diagnosa Tenaga Kesehatan</Text>
                              <View style={inputError === 'diagnosa_nakes' ? [styles.rect, {borderColor: 'red'}] : styles.rect}>
                                <TextInput
                                  placeholder="Hasil Diagnosa"
                                  style={styles.inputBox}
                                  multiline={true}
                                  editable={true}
                                  ref={refDiagnosa_nakes}
                                  value={diagnosa_nakes}
                                  onChangeText={(e) => setDiagnosa_nakes(e)}
                                />
                              </View>
                            </View>

                            <View style={styles.sublaporan}>
                              <Text style={styles.label3}>Target dan Potensi</Text>
                              <View style={inputError === 'target_potensi' ? [styles.rect, {borderColor: 'red'}] : styles.rect}>
                                <TextInput
                                  placeholder="Target dan Potensi"
                                  style={styles.inputBox}
                                  multiline={true}
                                  editable={true}
                                  ref={refTarget_potensi}
                                  value={target_potensi}
                                  onChangeText={(e) => setTarget_potensi(e)}
                                />
                              </View>
                            </View>

                            <View style={styles.sublaporan}>
                              <Text style={styles.label3}>Tindakan Intervensi</Text>
                              <View style={inputError === 'intervensi' ? [styles.rect, {borderColor: 'red'}] : styles.rect}>
                                <TextInput
                                  placeholder="Intervensi"
                                  style={styles.inputBox}
                                  multiline={true}
                                  editable={true}
                                  ref={refIntervensi}
                                  value={intervensi}
                                  onChangeText={(e) => setIntervensi(e)}
                                />
                              </View>
                            </View>

                            <View style={styles.sublaporan}>
                              <Text style={styles.label3}>Home Program</Text>
                              <View style={inputError === 'home_program' ? [styles.rect, {borderColor: 'red'}] : styles.rect}>
                                <TextInput
                                  placeholder="Tindakan di rumah"
                                  style={styles.inputBox}
                                  multiline={true}
                                  editable={true}
                                  ref={refHome_program}
                                  value={home_program}
                                  onChangeText={(e) => setHome_program(e)}
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
                                  editable={true}
                                  value={catatan_tambahan}
                                  onChangeText={(e) => setCatatan_tambahan(e)}
                                />
                              </View>
                            </View>

                            <View style={styles.sublaporan}>
                              <Text style={styles.label3}>Dokumen Tambahan</Text>
                              <View style={styles.rect}>
                                <View style={styles.viewFile}>
                                  <Text style={styles.label5}>{dokumen_visit.name}</Text>
                                  <TouchableOpacity style={styles.btn} onPress={() => handleChooseFile()}>
                                    <Text style={styles.button}>Upload Dokumen</Text>
                                  </TouchableOpacity>
                                </View>
                                <View style={styles.viewPhoto}>
                                    {thumbFoto !== '' ?
                                      <Image
                                        source={{uri: thumbFoto}}
                                        style={[styles.image, {}]}
                                        resizeMode="contain"
                                      />
                                      :
                                      <></>
                                    }
                                    <TouchableOpacity
                                      style={[styles.btn, {marginTop: '2%'}]}
                                      onPress={() => handleChoosePhoto()}
                                    ><Text style={styles.button}>Ambil Foto</Text></TouchableOpacity>
                                </View>
                              </View>
                            </View>

                          </View>
                          <Sharebtn style={styles.cupertinoButtonInfo1} onSubmit={onSubmit} label="SIMPAN" />
                        </View>
                      </View>
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

export default Laporaninput;
