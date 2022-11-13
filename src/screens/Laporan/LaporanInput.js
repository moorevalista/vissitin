import React, { Component, useState, useEffect, useRef, useContext } from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  Text,
  TextInput,
  View,
  SafeAreaView,
  Image, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Linking
} from 'react-native';
import IconPanah from 'react-native-vector-icons/Ionicons';
import IconInfo from 'react-native-vector-icons/Entypo';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment/min/moment-with-locales';
// import 'moment/locale/id';
import Loader from '../../components/Loader';
import { launchCamera, launchImageLibrary, ImagePicker } from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';

export default function LaporanInput(props) {
  const formValidation = useContext(form_validation);
  moment.locale('id');

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
    Linking.openURL(e);
  };

  function openFoto(e) {
    Linking.openURL(e);
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
            <View style={styles.Hasil_pemeriksaan}>
              <Text style={styles.Txt957}>HASIL PEMERIKSAAN</Text>
            </View>

            <View style={styles.sub_Hasil_pemeriksaan} />
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="md-add-circle" />
                <Text style={styles.Txt0810}>Keluhan Utama*</Text>
              </View>
              <TextInput
                style={styles.Txt875}
                placeholder="Keluhan Utama"
                multiline={true}
                editable={false}
                value={item.keluhan_utama}
              />
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="md-alert-circle" />
                <Text style={styles.Txt0810}>Pemeriksaan Umum*</Text>
              </View>
              <TextInput
                style={styles.Txt875}
                placeholder="Pemeriksaan Umum"
                multiline={true}
                editable={false}
                value={item.pemeriksaan_umum}
              />
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="flask-sharp" />
                <Text style={styles.Txt0810}>Pemeriksaan Khusus</Text>
              </View>
              <TextInput
                style={styles.Txt875}
                placeholder="Pemeriksaan Khusus"
                multiline={true}
                editable={false}
                value={item.pemeriksaan_khusus !== '' ? item.pemeriksaan_khusus : '-'}
              />
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="info" name="info" />
                <Text style={styles.Txt0810}>Pemeriksaan Penunjang</Text>
              </View>
              <TextInput
                style={styles.Txt875}
                placeholder="Pemeriksaan Penunjang"
                multiline={true}
                editable={false}
                value={item.pemeriksaan_penunjang !== '' ? item.pemeriksaan_penunjang : '-'}
              />
            </View>
            <View style={styles.sub_Hasil_pemeriksaan} />
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="flash-sharp" />
                <Text style={styles.Txt0810}>Diagnosa Tenaga Professional*</Text>
              </View>
              <TextInput
                style={styles.Txt875}
                placeholder="Diagnosa Tenaga Professional"
                multiline={true}
                editable={false}
                value={item.diagnosa_nakes}
              />
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="ios-bar-chart-sharp" />
                <Text style={styles.Txt0810}>Target dan Potensi*</Text>
              </View>
              <TextInput
                style={styles.Txt875}
                placeholder="Target dan Potensi"
                multiline={true}
                editable={false}
                value={item.target_potensi}
              />
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="ios-bar-chart-sharp" />
                <Text style={styles.Txt0810}>Tindakan Intervensi*</Text>
              </View>
              <TextInput
                style={styles.Txt875}
                placeholder="Tindakan Intervensi"
                multiline={true}
                editable={false}
                value={item.intervensi}
              />
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="ios-bar-chart-sharp" />
                <Text style={styles.Txt0810}>Home Program*</Text>
              </View>
              <TextInput
                style={styles.Txt875}
                placeholder="Home Program"
                multiline={true}
                editable={false}
                value={item.home_program}
              />
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="ios-bookmark" />
                <Text style={styles.Txt0810}>Catatan Khusus</Text>
              </View>
              <TextInput
                style={styles.Txt875}
                placeholder="Catatan Khusus"
                multiline={true}
                editable={false}
                value={item.catatan_tambahan !== '' ? item.catatan_tambahan : '-'}
              />
            </View>
            <View style={styles.Keluhan_utama1}>
              <View style={styles.Keluhan_utama}>
                <Icons label="Panah" name="document" />
                <Text style={styles.Txt0810}>Dokumen Penunjang</Text>
              </View>
              {(item.foto_visit == '' && item.dokumen_visit == '') ? <Text style={styles.Txt875}>Tidak ada..</Text>:<></>}
              {/*<TextInput style={styles.Txt874} placeholder="Dokumen Penunjang" />*/}
            </View>
            <View style={styles.Group814}>
              
              {item.foto_visit !== '' ?
                <TouchableOpacity
                  style={styles.Tbl_bertemu}
                  onPress={() => openFoto(thumbFoto)}>
                  <View style={styles.Tbl_iconPanah}>
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
                  <Text style={styles.Txt0810}>{dokumen_visit.name}</Text>
                </TouchableOpacity>
                :
                <></>
              }

            </View>
          </View>
        )
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
            <ScrollView
              showsVerticalScrollIndicator={false}
              horizontal={false}
              contentContainerStyle={styles.scrollArea_contentContainerStyle}
            >
              <View style={styles.Group329}>
                <View style={styles.Data_reservasi}>
                  <View style={styles.Group575}>
                    <View style={styles.Kategori_layanan_kiri}>
                      <Text style={styles.Txt596}>Kategori Layanan</Text>
                      <Text style={styles.Txt375}>{"Visit " + dataJadwal[0].order_type}</Text>
                    </View>
                    <View style={styles.Kategori_layanan_kanan}>
                      <Text style={styles.Txt596}>Jenis Layanan</Text>
                      <Text style={styles.Txt375}>{dataJadwal[0].id_paket === '1' ? 'REGULER' : 'KHUSUS'}</Text>
                    </View>
                  </View>
                  <View style={styles.Group575}>
                    <View style={styles.Kategori_layanan_kiri}>
                      <Text style={styles.Txt596}>Nama Pasien</Text>
                      <Text style={styles.Txt375}>{dataJadwal[0].service_user === 'self' ? dataJadwal[0].client : dataJadwal[0].nama_kerabat}</Text>
                    </View>
                    {/*<View style={styles.Kategori_layanan_kanan}>
                      <Text style={styles.Txt596}>Nama Nakes</Text>
                      <Text style={styles.Txt375}></Text>
                    </View>*/}
                  </View>
                  <View style={styles.Jadwal1}>
                    <Text style={styles.Txt881}>Jadwal Reservasi</Text>
                    <Text style={styles.Txt662}>{moment(dataJadwal[0].order_date).format('dddd') + ', ' + moment(dataJadwal[0].order_date).format('DD/MM/YYYY') + ' - ' + dataJadwal[0].order_start_time.substr(0, 5) + ' WIB'}</Text>
                  </View>
                </View>

                {dataReport ?

                  <DetailReport />
                  :
                  <View>
                    <View style={styles.Hasil_pemeriksaan}>
                      <Text style={styles.Txt957}>HASIL PEMERIKSAAN</Text>
                    </View>

                    <View style={styles.sub_Hasil_pemeriksaan} />
                    <View style={styles.Keluhan_utama1}>
                      <View style={styles.Keluhan_utama}>
                        <Icons label="Panah" name="md-add-circle" />
                        <Text style={styles.Txt0810}>Keluhan Utama*</Text>
                      </View>
                      <TextInput
                        style={inputError === 'keluhan_utama' ? [styles.Txt874, {borderColor: 'red'}] : styles.Txt874}
                        placeholder="Keluhan Utama"
                        multiline={true}
                        editable={true}
                        ref={refKeluhan}
                        value={keluhan_utama}
                        onChangeText={setKeluhan_utama}
                      />
                    </View>
                    <View style={styles.Keluhan_utama1}>
                      <View style={styles.Keluhan_utama}>
                        <Icons label="Panah" name="md-alert-circle" />
                        <Text style={styles.Txt0810}>Pemeriksaan Umum*</Text>
                      </View>
                      <TextInput
                        style={inputError === 'pemeriksaan_umum' ? [styles.Txt874, {borderColor: 'red'}] : styles.Txt874}
                        placeholder="Pemeriksaan Umum"
                        multiline={true}
                        editable={true}
                        ref={refPemeriksaan_umum}
                        value={pemeriksaan_umum}
                        onChangeText={setPemerksaan_umum}
                      />
                    </View>
                    <View style={styles.Keluhan_utama1}>
                      <View style={styles.Keluhan_utama}>
                        <Icons label="Panah" name="flask-sharp" />
                        <Text style={styles.Txt0810}>Pemeriksaan Khusus</Text>
                      </View>
                      <TextInput
                        style={styles.Txt874}
                        placeholder="Pemeriksaan Khusus"
                        multiline={true}
                        editable={true}
                        value={pemeriksaan_khusus}
                        onChangeText={(e) => setPemerksaan_khusus(e)}
                      />
                    </View>
                    <View style={styles.Keluhan_utama1}>
                      <View style={styles.Keluhan_utama}>
                        <Icons label="info" name="info" />
                        <Text style={styles.Txt0810}>Pemeriksaan Penunjang</Text>
                      </View>
                      <TextInput
                        style={styles.Txt874}
                        placeholder="Pemeriksaan Penunjang"
                        multiline={true}
                        editable={true}
                        value={pemeriksaan_penunjang}
                        onChangeText={(e) => setPemerksaan_penunjang(e)}
                      />
                    </View>
                    <View style={styles.sub_Hasil_pemeriksaan} />
                    <View style={styles.Keluhan_utama1}>
                      <View style={styles.Keluhan_utama}>
                        <Icons label="Panah" name="flash-sharp" />
                        <Text style={styles.Txt0810}>Diagnosa Tenaga Professional*</Text>
                      </View>
                      <TextInput
                        style={inputError === 'diagnosa_nakes' ? [styles.Txt874, {borderColor: 'red'}] : styles.Txt874}
                        placeholder="Diagnosa Tenaga Professional"
                        multiline={true}
                        editable={true}
                        ref={refDiagnosa_nakes}
                        value={diagnosa_nakes}
                        onChangeText={(e) => setDiagnosa_nakes(e)}
                      />
                    </View>
                    <View style={styles.Keluhan_utama1}>
                      <View style={styles.Keluhan_utama}>
                        <Icons label="Panah" name="ios-bar-chart-sharp" />
                        <Text style={styles.Txt0810}>Target dan Potensi*</Text>
                      </View>
                      <TextInput
                        style={inputError === 'target_potensi' ? [styles.Txt874, {borderColor: 'red'}] : styles.Txt874}
                        placeholder="Target dan Potensi"
                        multiline={true}
                        editable={true}
                        ref={refTarget_potensi}
                        value={target_potensi}
                        onChangeText={(e) => setTarget_potensi(e)}
                      />
                    </View>
                    <View style={styles.Keluhan_utama1}>
                      <View style={styles.Keluhan_utama}>
                        <Icons label="Panah" name="ios-bar-chart-sharp" />
                        <Text style={styles.Txt0810}>Tindakan Intervensi*</Text>
                      </View>
                      <TextInput
                        style={inputError === 'intervensi' ? [styles.Txt874, {borderColor: 'red'}] : styles.Txt874}
                        placeholder="Tindakan Intervensi"
                        multiline={true}
                        editable={true}
                        ref={refIntervensi}
                        value={intervensi}
                        onChangeText={(e) => setIntervensi(e)}
                      />
                    </View>
                    <View style={styles.Keluhan_utama1}>
                      <View style={styles.Keluhan_utama}>
                        <Icons label="Panah" name="ios-bar-chart-sharp" />
                        <Text style={styles.Txt0810}>Home Program*</Text>
                      </View>
                      <TextInput
                        style={inputError === 'home_program' ? [styles.Txt874, {borderColor: 'red'}] : styles.Txt874}
                        placeholder="Home Program"
                        multiline={true}
                        editable={true}
                        ref={refHome_program}
                        value={home_program}
                        onChangeText={(e) => setHome_program(e)}
                      />
                    </View>
                    <View style={styles.Keluhan_utama1}>
                      <View style={styles.Keluhan_utama}>
                        <Icons label="Panah" name="ios-bookmark" />
                        <Text style={styles.Txt0810}>Catatan Khusus</Text>
                      </View>
                      <TextInput
                        style={styles.Txt874}
                        placeholder="Catatan Khusus"
                        multiline={true}
                        editable={true}
                        value={catatan_tambahan}
                        onChangeText={(e) => setCatatan_tambahan(e)}
                      />
                    </View>
                    <View style={styles.Keluhan_utama1}>
                      <View style={styles.Keluhan_utama}>
                        <Icons label="Panah" name="document" />
                        <Text style={styles.Txt0810}>Dokumen Penunjang</Text>
                      </View>
                      {/*<TextInput style={styles.Txt874} placeholder="Dokumen Penunjang" />*/}
                    </View>
                    <View style={styles.Group814}>
                      
                      <TouchableOpacity
                        style={styles.Tbl_bertemu}
                        onPress={() => handleChoosePhoto()}>
                        <View style={styles.Tbl_iconPanah}>
                          {thumbFoto !== '' ?
                            <Image
                              source={{uri: thumbFoto}}
                              resizeMode="cover"
                              style={styles.image}
                            />
                            :
                            <Icons label="Panah" name="image" fontSize={28} />
                          }
                        </View>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.Tbl_live_cam}
                        onPress={() => handleChooseFile()}>
                        <View style={styles.Tbl_iconPanah}>
                          <Icons label="Panah" name="document" fontSize={28} />
                        </View>
                        <Text style={styles.Txt0810}>{dokumen_visit.name}</Text>
                      </TouchableOpacity>
     
                    </View>
                    <TouchableOpacity
                      style={styles.Keluhan_utama11}
                      onPress={onSubmit}>
                      <Text style={styles.Txt08101}>SIMPAN</Text>
                    </TouchableOpacity>
                  </View>
                }
              </View>
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
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,1)',
    borderRadius: 20,
    height: 50,
    marginBottom: 20,
  },

  Txt0810: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    lineHeight: 14,
    color: 'rgba(79,92,99,1)',
    paddingLeft: 10,
  },
  Txt081: {
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
    paddingVertical: '2%',
    paddingHorizontal: '4%',
    width: '100%',
    height: 'auto',
    minHeight: 40,
    maxHeight: 80,
    borderWidth: 1,
    borderRadius: 10,
  },
  Txt875: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: '400',
    color: 'rgba(79,92,99,1)',
    paddingVertical: '2%',
    paddingHorizontal: '4%',
    width: '100%',
    height: 'auto',
    minHeight: 40,
    maxHeight: 80,
    borderWidth: 0.5,
    borderRadius: 10,
  },

  Group814: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
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
    marginBottom: 10,
    width: 50,
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
  Txt08101: {
    fontSize: 12,
    //fontFamily: 'Poppins, sans-serif',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 1)',
  },
});
