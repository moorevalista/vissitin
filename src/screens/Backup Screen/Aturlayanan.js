import React, { Component, useState, useEffect, useRef, useContext } from "react";
import { Switch, TextInput, StyleSheet, View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import Headr1 from "../components/Headr1";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialSwitch from "../components/MaterialSwitch";
import MaterialSwitchPaket from "../components/MaterialSwitchPaket";
import MaterialStackedLabelTextbox from "../components/MaterialStackedLabelTextbox";
import CupertinoButtonInfo from "../components/CupertinoButtonInfo";
import Footer from "../components/Footer";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FlashMessage from 'react-native-flash-message';
import { showMessage, hideMessage } from 'react-native-flash-message';
import AwesomeAlert from 'react-native-awesome-alerts';
import CupertinoButtonUpload from "../components/CupertinoButtonUpload";
import CupertinoButtonCancel from "../components/CupertinoButtonCancel";
import axios from 'axios';
import Loader from '../components/Loader';
import { CommonActions } from '@react-navigation/native';

function Aturlayanan(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  const [dataNakes, setDataNakes] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  //const [currentData, setCurrentData] = useState([]);
  const [id_kategori, setId_kategori] = useState('');
  //const [paketPilihan, setPaketPilihan] = useState([]); //untuk menampung data paket yang dipilih

  //untuk menampung dataset dari database
  const [kategoriPasien, setKategoriPasien] = useState([]);
  const [klasifikasiPasien, setKlasifikasiPasien] = useState([]);
  const [biayaLayanan, setBiayaLayanan] = useState([]);
  const [dataPaket, setDataPaket] = useState([]);

  //dataList yang diambil dari dataset untuk dirender ke dropdown
  const [itemsKategoriPasien, setItemsKategoriPasien] = useState([]);
  const [itemsKlasifikasiPasien, setItemsKlasifikasiPasien] = useState([]);
  const [dataBiaya, setDataBiaya] = useState([]);
  const [itemsPaket, setItemsPaket] = useState([]);

  //ref input
  const refBiayaLayanan = useRef(null);

  //untuk menampung input
  //const [newBiayaLayanan, setNewBiayaLayanan] = useState('');
  //const [kategoriPilihan, setKategoriPilihan] = useState([]);

  //stylesheets
  const [styleList, setstyleList] = useState(styles.list);

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    //alert(JSON.stringify(success));
    if(success[0].loginState === 'true') {
      try {
        await setDataLogin(success[0]);  
      } catch (error) {
        alert(error);
      } finally {
        //await alert(dataLogin);
        //await setLoading(false);
      }
    }
  }

  const getDataNakes = async () => {
    axios
      .get(props.route.params.base_url + "nakes/getUser/" + dataLogin.id_nakes, {params: {token: dataLogin.token}})
      .then(res => {
        //alert(res.data);
        setDataNakes(res.data); 
      })
      .catch(error => {
        console.log(error);
      })
  }

  useEffect(() => {
    //getLoginData();

    setDataLogin(props.route.params.dataLogin);

    return () => {
      setDataNakes([]);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      setCurrentDataNakes();
      //getDataNakes();
    }
  },[dataLogin]);

  /*useEffect(() => { //set existing data Nakes
    if(dataNakes) {
      setCurrentDataNakes();
    }
  }, [dataNakes]);*/

  useEffect(() => {
    if(kategoriPasien) {
      listKategoriPasien();
      //setCurrentKategoriPilihan();
      //alert(JSON.stringify(kategoriPasien));
    }
  }, [kategoriPasien]);

  useEffect(() => {
      listKlasifikasiPasien();
  }, [klasifikasiPasien]);

  useEffect(() => {
    if(biayaLayanan) {
      //setCurrentBiayaLayanan();
      setDataBiaya(biayaLayanan);
    }
  },[biayaLayanan]);

  useEffect(() => {
    if(dataPaket) {
      listPaket();
      //alert(JSON.stringify(dataPaket));
      //console.log(dataPaket);
    }
  },[dataPaket]);

  useEffect(() => {
    if(!updateData) {
      //setCurrentDataNakes();
    }
  },[updateData]);

  const setCurrentDataNakes = async () => {
    await setLoading(true);
    //await setCurrentData(dataNakes.data);
    await getKategoriPasien();
    await getKlasifikasiPasien();
    await getBiayaLayanan();
    await getPaketAll();
    await setLoading(false);
  }

  /*const setCurrentKategoriPilihan = async () => {
    const newItems = kategoriPasien;
    let newKategoriPilihan = {};
    newItems.map((item) => {
      newKategoriPilihan[item.id_kategori] = item.checked == 1 ? true : false;
    });
    await setKategoriPilihan(newKategoriPilihan);
  }*/

  const getKategoriPasien = async () => {
    let params = [];
    params.push({ base_url: props.route.params.base_url, id_nakes: dataLogin.id_nakes, token: dataLogin.token });

    success = await formValidation.getKategoriPasien(params);

    if(success.status === true) {
      try {
        await setKategoriPasien(success.res);
      } catch (error) {
        alert(error);
      } finally {
        //await setLoading(false);
      }
    }
  }

  //set listKategoriPasien dari dataset kategoriPasien
  const listKategoriPasien = async () => {
    const newItems = kategoriPasien;

    let options = [];

    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_kategori, label: item.kategori + " (" + item.rentang_umur + ")", checked: item.checked}
        )
      });
    }

    setItemsKategoriPasien(options);
  }

  //render Dropdown listPendidikan untuk ditampilkan di form
  const KategoriPasien = () => {
    const items = itemsKategoriPasien;
    return (
        items.map((item, index) => (
          <MaterialSwitch type="kategori" key={item.value} name={item.value} value={item.checked} label={item.label} style={styles.switchItems} updateData={updateData} handleChangeKategori={handleChangeKategori} />
        ))
    )
  }

  const getKlasifikasiPasien = async () => {
    let params = [];
    params.push({ base_url: props.route.params.base_url, id_nakes: dataLogin.id_nakes, id_profesi: dataLogin.id_profesi, token: dataLogin.token });

    success = await formValidation.getKlasifikasiPasien(params);
    
    if(success.status === true) {
      try {
        await setKlasifikasiPasien(success.res);
      } catch (error) {
        alert(error);
      } finally {
        //await setLoading(false);
      }
    }
  }

  //set listKategoriPasien dari dataset kategoriPasien
  const listKlasifikasiPasien = async () => {
    const newItems = klasifikasiPasien;

    let options = [];

    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_klasifikasi, label: item.klasifikasi, desc: item.deskripsi, checked: item.checked}
        )
      });
    }

    setItemsKlasifikasiPasien(options);
  }

  //render Dropdown listPendidikan untuk ditampilkan di form
  const KlasifikasiPasien = () => {
    const items = itemsKlasifikasiPasien;
    return (
        items.map((item, index) => (
          <MaterialSwitch type="klasifikasi" key={item.value} name={item.value} value={item.checked} label={item.label} desc={item.desc} style={styles.switchItems} updateData={updateData} handleChangeKlasifikasi={handleChangeKlasifikasi} />
        ))
    )
  }

  //ambil biaya layanan
  const getBiayaLayanan = async () => {
    let params = [];
    params.push({ base_url: props.route.params.base_url, id_nakes: dataLogin.id_nakes, token: dataLogin.token });

    success = await formValidation.getBiayaLayanan(params);
    
    if(success.status === true) {
      try {
        await setBiayaLayanan(success.res);
      } catch (error) {
        alert(error);
      } finally {
        //await setLoading(false);
      }
    }
  }

  const setCurrentBiayaLayanan = async () => {
    let params = [];
    if(biayaLayanan[0] !== undefined && biayaLayanan[0] !== undefined && biayaLayanan[0].biaya_layanan !== '' && biayaLayanan[0].biaya_potongan !== '') {
      let biaya = biayaLayanan[0].biaya_layanan;
      biaya = biaya.replace(/\./g,"");
      let biaya_fix = biaya.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      biaya_fix = biaya_fix.replace(/,/g, ".");

      let potongan = biayaLayanan[0].biaya_potongan;
      potongan = potongan.replace(/\./g,"");
      let potongan_fix = potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      potongan_fix = potongan_fix.replace(/,/g, ".");

      params.push({id_nakes: dataLogin.id_nakes, biaya_layanan: biaya_fix, biaya_potongan: potongan_fix});
    }else {
      params.push({id_nakes: dataLogin.id_nakes, biaya_layanan: '', biaya_potongan: ''});
    }
    //alert(JSON.stringify(params));
    setDataBiaya(params);
  }

  //ambil data paket
  const getPaketAll = async () => {
    let params = [];
    params.push({ base_url: props.route.params.base_url, id_nakes: dataLogin.id_nakes, token: dataLogin.token });

    success = await formValidation.getPaketAll(params);
    
    if(success.status === true) {
      try {
        await setDataPaket(success.res);
        //await setPaketPilihan(success.res);
      } catch (error) {
        alert(error);
      } finally {
        //await setLoading(false);
      }
    }
  }

  //set listPaket dari dataset dataPaket
  const listPaket = async () => {
    const newItems = dataPaket;

    let options = [];

    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_paket, label: item.jenis_paket, desc: item.deskripsi, duration: item.duration, date_range: item.date_range, biaya_layanan: item.biaya_layanan, biaya_potongan: item.biaya_potongan, active: item.active}
        )
      });
    }

    setItemsPaket(options);
  }

  //render listPaket untuk ditampilkan di form
  const Paket = () => {
    //alert(JSON.stringify(itemsPaket));
    const items = itemsPaket;
    
    return items.map((item, index) => {
      let active = (item.active === '' || item.active === null || item.active === '0') ? false : true;

        let biaya_layanan = '';
        let biaya_potongan = '';

        let layanan = item.biaya_layanan;
        if(layanan !== '' && layanan !== null && layanan !== 0) {
          layanan = layanan.replace(/\./g,"");
          biaya_layanan = layanan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          biaya_layanan = biaya_layanan.replace(/,/g, ".");
        }
        
        let potongan = item.biaya_potongan;
        if(potongan !== '' && potongan !== null && potongan !== 0) {
          potongan = potongan.replace(/\./g,"");
          biaya_potongan = potongan.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
          biaya_potongan = biaya_potongan.replace(/,/g, ".");  
        }
      return (
          /*<MaterialSwitchPaket onChangeBiaya={onChangeBiaya} toogleSwitch={toogleSwitch} key={item.value} value={item.value} label={item.label} desc={item.desc} duration={item.duration} date_range={item.date_range} biaya_layanan={item.biaya_layanan} biaya_potongan={item.biaya_potongan} active={item.active} style={styles.switchItems} updateData={updateData} />*/
          <View key={item.value} style={[styles1.container, styles.switchItems]}>
            <View style={styles1.boxSwitch1}>
              <Switch
                value={active}
                trackColor={{ true: "rgba(0,0,0,1)", false: "rgba(155,155,155,1)" }}
                thumbColor="rgba(65,170,223,1)"
                style={styles1.switch1}
                disabled={!updateData}
                //onValueChange={(e) => toogleSwitch(e, 'paket', item.value)}
                onValueChange={(e) => handleChangePaket(e, item.value)}
              ></Switch>
            </View>
            <View style={styles1.boxSwitch2}>
              <Text style={styles1.label}>{item.desc}</Text>
            </View>
            <View style={[styles2.container, styles1.biayalayanankhusus1]}>
              <Text style={styles2.stackedLabel}>Set Biaya Khusus Per-Jam</Text>
              <TextInput
                placeholder="Input"
                style={styles2.inputStyle}
                editable={(!updateData || (item.active === null || item.active === '' || item.active === '0')) ? false : true}
                onEndEditing={(e) => handleChangeBiayaPaket(e, item.value + '|biaya_layanan')}
                defaultValue={(item.active !== '' && item.active !== null) ? biaya_layanan : ''}
                keyboardType="numeric"
              />
            </View>
            <View style={styles1.separator1}></View>
          </View>
        )}) 
  }

//---function manipulasi data paket (biaya, active/tidak)---//

  async function handleChange(ev, name) {
    //alert(JSON.stringify(dataBiaya)); return;
    if(ev.nativeEvent.text < 250000) {
      formValidation.showError('Biaya layanan minimum Rp. 250.000');
      refBiayaLayanan.current.focus();
    }else {
      const biaya = await formValidation.convertDecimal(ev.nativeEvent.text);
      const newDataBiaya = { ...dataBiaya, [name]: biaya};
      await setDataBiaya(newDataBiaya);
    }
  }

  /*async function convertDecimal(ev) {
    let biaya = ev;
    biaya = biaya.replace(/\./g,"");
    let biaya_fix = biaya.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    biaya_fix = biaya_fix.replace(/,/g, ".");
    return biaya_fix;
  }*/

  async function handleChangeBiayaPaket(ev, name) {
    //let { name, value } = ev.target;
    const str = name;
    const data = str.split("|");

    const biaya = await formValidation.convertDecimal(ev.nativeEvent.text);

    const index = dataPaket.findIndex((item) => item.id_paket === data[0]);
    let pilih = dataPaket.slice();
    pilih[index] = {id_paket: data[0], biaya_layanan: biaya, biaya_potongan:pilih[index].biaya_potongan, active: pilih[index].active, date_range: pilih[index].date_range, deskripsi: pilih[index].deskripsi, duration: pilih[index].duration, jenis_paket: pilih[index].jenis_paket};
    await setDataPaket(pilih);
  }

  const handleChangePaket = async (e, name) => {
    //let { name, checked } = ev.target;

    let paketExist = handleCheckPaket({id_paket: name});
    let active = e ? '1' : '0';

    if(paketExist === false) {
      const index =  dataPaket.findIndex((item) => item.id_paket === '');
      let pilih = dataPaket.slice();
      pilih[index] = {id_paket: name, biaya_layanan:pilih[index].biaya_layanan, biaya_potongan:pilih[index].biaya_potongan, active: active, date_range: pilih[index].date_range, deskripsi: pilih[index].deskripsi, duration: pilih[index].duration, jenis_paket: pilih[index].jenis_paket};
      await setDataPaket(pilih); 
    }else {
      const index = dataPaket.findIndex((item) => item.id_paket === name);
      let pilih = dataPaket.slice();
      let biaya_layanan = e ? pilih[index].biaya_layanan : pilih[index].biaya_layanan;
      let biaya_potongan = e ? pilih[index].biaya_potongan : pilih[index].biaya_potongan;
      pilih[index] = {id_paket: name, biaya_layanan:biaya_layanan, biaya_potongan:biaya_potongan, active: active, date_range: pilih[index].date_range, deskripsi: pilih[index].deskripsi, duration: pilih[index].duration, jenis_paket: pilih[index].jenis_paket};
      await setDataPaket(pilih);
    }
  }

  function handleCheckPaket(val) {
    return dataPaket.some(item => val.id_paket === item.id_paket);
  }

//---function manipulasi data paket (biaya, active/tidak)---//

//---function manipulasi data kategori (active/tidak)---//

  async function handleChangeKategori(e, name) {
    let checked = e ? '1' : '0';

    const index =  kategoriPasien.findIndex((item) => item.id_kategori === name);
    let pilih = kategoriPasien.slice();
    pilih[index] = {id_kategori: name, kategori:pilih[index].kategori, rentang_umur:pilih[index].rentang_umur, checked: checked};
    await setKategoriPasien(pilih); 
  }

  async function handleChangeKlasifikasi(e, name) {
    let checked = e ? '1' : '0';

    const index =  klasifikasiPasien.findIndex((item) => item.id_klasifikasi === name);
    let pilih = klasifikasiPasien.slice();
    pilih[index] = {id_klasifikasi: name, klasifikasi:pilih[index].klasifikasi, deskripsi:pilih[index].deskripsi, checked: checked};
    await setKlasifikasiPasien(pilih); 
  }

//---function manipulasi data kategori (active/tidak)---//

/*  const onChangePaket = async (ev, key) => {
    let status = ev ? '1' : '0';
    const index = dataPaket.findIndex((item) => item.id_paket === key);
    let pilih = dataPaket.slice();
    pilih[index] = {...dataPaket[index], active: status};
    await setDataPaket(pilih);
  }

  const onChangeBiayaPaket = async (active, ev, key) => {
    let status = active ? '1' : '0';
    const index = dataPaket.findIndex((item) => item.id_paket === key);
    let pilih = dataPaket.slice();
    pilih[index] = {...dataPaket[index], active: status, biaya_layanan: ev};
    await setDataPaket(pilih);
  }

  const toogleSwitch = async (e, type, name) => {
    if(type === 'paket') {
      await onChangePaket(e, name);
    }
  }

  const onChangeBiaya = async (active, e, type, name) => {
    if(type === 'paket') {
      await onChangeBiayaPaket(active, e, name);
    }
  }*/

  function handleValidSubmit() {
    let isValid = true;
    let errorMsg = {};
    //alert(JSON.stringify(dataBiaya)); return;
    if(dataBiaya.biaya_layanan === '') {
      isValid = false;
      errorMsg = '*Harus diisi';
      refBiayaLayanan.current.focus();
      formValidation.showError(errorMsg);
    }else {
      const val = parseFloat(dataBiaya.biaya_layanan);
      const numericRegex = /^([0-9]{1,7})$/
      if(val > 0) {
        if(numericRegex.test(val)) {
          isValid = true;
        }else {
          isValid = false;
          errorMsg = '*Nominal tidak valid';
          refBiayaLayanan.current.focus();
          formValidation.showError(errorMsg);
        }
      }else {
        isValid = false;
        errorMsg = '*Nominal tidak valid';
        refBiayaLayanan.current.focus();
        formValidation.showError(errorMsg);
      }
    }

    return isValid;
  }

  const onSubmit = async () => {
    if(handleValidSubmit()) {
      //console.log(dataPaket);
      //console.log(kategoriPasien);
      //console.log(klasifikasiPasien);
      //alert(dataBiaya.biaya_layanan);
      setLoadingSave(true);
      const formData = new FormData();
      formData.append("kategoriPilihan", JSON.stringify(kategoriPasien));
      formData.append("klasifikasiPilihan", JSON.stringify(klasifikasiPasien));
      formData.append("biaya_layanan", dataBiaya.biaya_layanan);
      formData.append("biaya_potongan", dataBiaya.biaya_potongan);
      formData.append("data_paket", JSON.stringify(dataPaket));
      formData.append("token", dataLogin.token);

      axios
          .post(props.route.params.base_url + "nakes/saveLayananNakes/" + dataLogin.id_nakes, formData)
          .then((res =>{
            setLoadingSave(false);
            //alert(JSON.stringify(res)); return
            if(res.data.responseCode !== "000") {
              formValidation.showError((res.data.messages[0] !== undefined && res.data.messages[0].length > 1) ? res.data.messages[0] : res.data.messages);
            }else {
              setUpdateData(false);
              formValidation.showError('Data berhasil disimpan...');

              props.navigation.dispatch(
                CommonActions.reset({
                  index: 1,
                  routes: [
                    {
                      name: 'mainMenuScreen',
                      params: { base_url: props.route.params.base_url },
                    },
                    {
                      name: 'settingScreen',
                      params: { base_url: props.route.params.base_url },
                    }
                  ],
                })
              )
            }
          }))
          .catch(error => {
            //alert(JSON.stringify(error)); return
            setLoadingSave(false);
            if(error.response != undefined && error.response.status == 404) {
              formValidation.showError('Terjadi kesalahan...');
            }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
              formValidation.showError(error.response.data.messages.error);
            }else {
              formValidation.showError(error);
            }
          })
    }
    //alert(JSON.stringify(kategoriPasien) + ' | ' + JSON.stringify(klasifikasiPasien) + ' | ' + JSON.stringify(dataPaket));
  }

  const onCancel = async () => {
    setLoadingSave(true);
    await getKategoriPasien();
    await getKlasifikasiPasien();
    await getBiayaLayanan();
    await getPaketAll();
    await setUpdateData(!updateData);
    setLoadingSave(false);
    //(dataNakes ? setCurrentDataNakes():'');
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
            <View>
              <Headr1
                style={styles.header1}
                dataLogin={dataLogin}
                updateData={updateData}
                setUpdateData={setUpdateData}
                name="Profile"
                thumbProfile={dataLogin.thumbProfile}
              />
            </View>
            <ScrollView
                    horizontal={false}
                    contentContainerStyle={styles.scrollArea_contentContainerStyle}
                  >
              <View style={styles.container}>
                <View style={styles.label}>
                  <View style={styles.icon1Row}>
                    <Icon name="auto-fix" style={styles.icon1}></Icon>
                    <Text style={styles.pengaturanLayanan}>Pengaturan Layanan</Text>
                  </View>
                </View>
                <View style={styles.scrollAreaStack}>
                  <View style={[styles.scrollArea, styles.inner]}>
                      <Text style={styles.desc}>Pilih kategori usia pasien;</Text>
                      <View style={styles.switchBox}>
                        <KategoriPasien />
                      </View>
                      <Text style={styles.desc}>Pilih klasifikasi kasus pasien;</Text>
                      <View style={styles.switchBox}>
                        <KlasifikasiPasien />
                      </View>
                      <Text style={styles.desc}>Pengaturan Biaya Reguler</Text>
                      <MaterialStackedLabelTextbox
                        name="biaya_layanan"
                        style={styles.biayareguler}
                        updateData={updateData}
                        dataBiaya={dataBiaya}
                        handleChange={handleChange}
                        refBiayaLayanan={refBiayaLayanan}
                      ></MaterialStackedLabelTextbox>
                      
                      {/*dataNakes.pendidikan === 'profesi' && dataNakes.id_faskes === '' ?*/}
                        <View style={styles.switchBox}>
                          <Text style={styles.text}>Pengaturan Biaya Paket Khusus</Text>
                          <Paket />
                        </View>
                        {/*:
                        <></>
                      */}

                      <CupertinoButtonInfo
                        style={styles.btnsimpan}
                        updateData={updateData}
                        setUpdateData={setUpdateData}
                        onSubmit={onSubmit}
                      />

                      {updateData ?
                        <CupertinoButtonCancel
                          style={styles.btncancel}
                          updateData={updateData}
                          setUpdateData={setUpdateData}
                          onCancel={onCancel}
                        />:<></>}
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
  header1: {

  },
  label: {
    width: 202,
    height: 30,
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 20
  },
  icon1: {
    color: "#41aadf",
    fontSize: 30
  },
  pengaturanLayanan: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    marginLeft: 5,
    marginTop: 7
  },
  icon1Row: {
    height: 33,
    flexDirection: "row",
    flex: 1,
    marginRight: 9
  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0,
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  desc: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 14,
    marginBottom: 10
  },
  switchBox: {
    width: '100%',
    height: 'auto',
    justifyContent: "space-between",
    marginBottom: 20,
  },
  switchItems: {
    width: '100%',
    minHeight: 50,
    height: 'auto'
  },
  desc3: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    fontSize: 14,
    marginTop: 26,
    marginRight: 35
  },
  biayareguler: {
    height: 60,
    width: 271,
    marginTop: 1
  },
  text: {
    fontFamily: "roboto-regular",
    color: "rgba(255,166,0,1)",
    fontSize: 14,
    marginTop: 16,
    marginRight: 35,
    marginBottom: 10
  },
  biayalayanankhusus1: {
    height: 60,
    width: 271
  },
  separator1: {
    width: 271,
    height: 1,
    backgroundColor: "rgba(65,170,223,1)",
    marginTop: 14
  },
  biayakhusus3: {
    height: 60,
    width: 271
  },
  separator2: {
    width: 271,
    height: 1,
    backgroundColor: "rgba(65,170,223,1)",
    marginTop: 13
  },
  biayakhusus6: {
    height: 60,
    width: 271,
    marginTop: 1
  },
  btnsimpan: {
    height: 40,
    marginTop: 27
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
    marginTop: 0,
    flex: 1,
    padding: 20,
  },
  list: {
    height: 100,
    width: '100%',
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#41aadf",
    borderRadius: 10,
    backgroundColor: "white"
  },
  listError: {
    height: 100,
    width: '100%',
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
    backgroundColor: "white"
  },
  listItems: {
    height: 100,
    width: 'auto',
    borderRadius: 10,
    fontSize: 12,
  },
  btncancel: {
    marginTop: 10,
    height: 40,
    width: 'auto',
  },
});

const styles1 = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  switch1: {
    width: 60,
    height: 30,
  },
  label: {
    fontFamily: "roboto-regular",
    color: "#121212",
    paddingTop: 5,
  },
  desc: {
    fontFamily: "roboto-regular",
    color: "#464655",
    padding: 0,
    fontStyle: 'italic',
    fontSize: 12
  },
  boxSwitch1: {
    alignSelf: "flex-start",
    width: '20%',
    height: 30,
    padding: 0,
    marginRight: '1%',
  },
  boxSwitch2: {
    alignSelf: "flex-start",
    width: '70%',
    height: 'auto',
    padding: 0,
    marginRight: '1%',
  },
  biayalayanankhusus1: {
    height: 60,
    width: 271
  },
});

const styles2 = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: "#D9D5DC",
    backgroundColor: "transparent"
  },
  stackedLabel: {
    fontFamily: "roboto-italic",
    fontSize: 12,
    textAlign: "left",
    color: "#000",
    opacity: 0.6,
    paddingTop: 16
  },
  inputStyle: {
    color: "#000",
    fontSize: 16,
    alignSelf: "stretch",
    flex: 1,
    lineHeight: 16,
    paddingTop: 0,
    paddingBottom: 0
  }
});

export default Aturlayanan;
