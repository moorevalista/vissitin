import React, { Component, useState, useEffect, useRef, useContext } from "react";
import { Image, StyleSheet, View, Text, ScrollView, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FeatherIcon from "react-native-vector-icons/Feather";
import CupertinoButtonInfo from "../components/CupertinoButtonInfo";
import Footer from "../components/Footer";
import Headr1 from "../components/Headr1";
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
import RNPickerSelect from 'react-native-picker-select';
import { CommonActions } from '@react-navigation/native';

function Dataprofesi(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  const [dataNakes, setDataNakes] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [newData, setNewData] = useState([]);
  const [location, setLocation] = useState('');

  const [dataFaskes, setDataFaskes] = useState([]);
  const [itemFaskes, setItemFaskes] = useState([]);
  const [id_faskes, setId_faskes] = useState('');

  const refSertifikasi = useRef(null);
  const refCompany = useRef(null);
  const refCompany_address = useRef(null);

  const [styleSertifikasi, setstyleSertifikasi] = useState(styles.rect);
  const [styleCompany, setstyleCompany] = useState(styles.rect);
  const [styleCompany_address, setstyleCompany_address] = useState(styles.rect);


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
    //alert(JSON.stringify(dataLogin[0].id_nakes));
    //alert(dataLogin[0].token); return;
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
      getDataNakes();
    }

    return () => {
      setCurrentData([]);
      setId_faskes('');
    }
  },[dataLogin]);

  useEffect(() => { //set existing data Nakes
    if(dataNakes) {
      setCurrentDataNakes();
    }
  }, [dataNakes]);

  useEffect(() => {
    updateData ? onUpdate():'';
  },[updateData]);

  useEffect(() => {
    listFaskes();
  }, [dataFaskes]);

  const getFaskes = async (data) => {
    let params = [];
    params.push({
      base_url: props.route.params.base_url,
      token: dataLogin.token
    });

    success = await formValidation.getAllFaskes(params);

    if(success.status === true) {
      try {
        await setDataFaskes(success.res);
      } catch(error) {
        alert(error);
      } finally {

      }
    }
  }

  const listFaskes = async () => {
    const newItems = dataFaskes.data;

    let options = [];

    if(newItems) {
      options = newItems.map((item) => {
        return (
          {value: item.id_faskes, label: item.faskes_name}
        )
      });
    }

    setItemFaskes(options);
  }

  const RenderFaskes = () => {
    const items = itemFaskes;
    const placeholder = {
      label: 'Pilih Faskes...',
      value: null
    };
    return (
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        onValueChange={(value) => {
          if(value !== id_faskes) {
            setId_faskes(value)
            onChange(value, 'id_faskes')
          }
        }}
        style={pickerSelectStyles}
        value={id_faskes}
        useNativeAndroidPickerStyle={true}
      />
    )
  }

  const setCurrentDataNakes = async () => {
    await setLoading(true);
    await setCurrentData(dataNakes.data);
    await setId_faskes(dataNakes.data.id_faskes);
    await getFaskes();
    await setLoading(false);
  }

  const onUpdate = async () => {
    let params = [];
    params.push({
      sertifikasi: currentData.sertifikasi,
      id_faskes: currentData.id_faskes,
      //company: currentData.company,
      //company_address: currentData.company_address,
      //company_address_detail: currentData.company_address_detail,
      //company_lat: currentData.company_lat,
      //company_lon: currentData.company_lon,
      about_me: currentData.about_me
    });
    await setNewData(params);
  }

  const onChange = async (ev, key) => {
    //alert(JSON.stringify(newData));
    let params = [];
    let inputData = [ ...newData ];
    inputData[0] = {...inputData[0], [key]: ev};
    //alert(JSON.stringify(inputData));
    params.push(inputData[0]);
    await setNewData(params);
  }

  const onSubmit = async () => {
    if(handleValidSubmit()) {
      setLoadingSave(true);
//      const geoLocation = await getLocationByAddress(newData[0].company + ', ' + newData[0].company_address + '(' + newData[0].company_address_detail + ')');
      //console.log(JSON.stringify(geoLocation));

//      if (geoLocation.code === undefined) {
//        if((geoLocation.lat !== '' && geoLocation.lat !== null) && (geoLocation.lng !== '' && geoLocation.lng !== null)) {
          const formData = new FormData();
          formData.append("sertifikasi", newData[0].sertifikasi);
          formData.append("id_faskes", newData[0].id_faskes);
          /*formData.append("company", newData[0].company);
          formData.append("company_address", newData[0].company_address);
          formData.append("company_address_detail", newData[0].company_address_detail);
          formData.append("company_lat", geoLocation.lat);
          formData.append("company_lon", geoLocation.lng);*/
          formData.append("about_me", newData[0].about_me);
          formData.append("token", dataLogin.token);

          axios
            .post(props.route.params.base_url + "nakes/updateDataPengalamanNakes/" + dataNakes.data.en_id_nakes, formData)
            .then((res =>{
              setLoadingSave(false);
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
              setLoadingSave(false);
              if(error.response != undefined && error.response.status == 404) {
                formValidation.showError('Terjadi kesalahan...');
              }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
                formValidation.showError(error.response.data.messages.error);
              }else {
                formValidation.showError(error);
              }
            })
      /*  }else {
          setLoadingSave(false);
          formValidation.showError('Gagal mendapatkan lokasi, pastikan GPS anda aktif dan periksa kembali detail lokasi yang anda isi');
        }
      } else {
        setLoadingSave(false);
        formValidation.showError('Gagal mendapatkan lokasi, pastikan GPS anda aktif dan periksa kembali detail lokasi yang anda isi');
      }*/
      
    }
  }

  const onCancel = async () => {
    //alert(birth_date);
    setCurrentDataNakes();
    setUpdateData(!updateData);
    //(dataNakes ? setCurrentDataNakes():'');
  }

  function getLocationByAddress(ev) {
    success = formValidation.getLocationByAddress(ev);
    //alert(JSON.stringify(success));
    setLocation(success);
    return(success);
  }

  const handleValidSubmit = () => {
    let isValid = true;
    let errorMsg = {};

    if(newData[0].sertifikasi === '') {
      isValid = false;
      errorMsg = '*Data harus diisi lengkap';
      formValidation.showError(errorMsg);
      refSertifikasi.current.focus();
      setstyleSertifikasi(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleSertifikasi(styles.rect);
    }

    if(newData[0].id_faskes === '') {
      isValid = false;
      errorMsg = '*Data harus diisi lengkap';
      formValidation.showError(errorMsg);
      setstyleCompany(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleCompany(styles.rect);
    }

    /*if(newData[0].company === '') {
      isValid = false;
      errorMsg = '*Data harus diisi lengkap';
      formValidation.showError(errorMsg);
      refCompany.current.focus();
      setstyleCompany(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleCompany(styles.rect);
    }

    if(newData[0].company_address == '') {
      isValid = false;
      errorMsg = '*Data harus diisi lengkap';
      formValidation.showError(errorMsg);
      refCompany_address.current.focus();
      setstyleCompany_address(styles.rectError);
      return isValid;
    }else {
      isValid = true;
      errorMsg = '';
      setstyleCompany_address(styles.rect);
    }*/

    return isValid;
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
            <View style={styles.group1}>
              <View style={styles.icon1Row}>
                <MaterialCommunityIconsIcon
                  name="newspaper"
                  style={styles.icon1}
                ></MaterialCommunityIconsIcon>
                <Text style={styles.text}>Data Profesi</Text>
              </View>
            </View>
            <View style={styles.scrollAreaStack}>

              <View style={[styles.scrollArea, styles.inner]}>
                    <View style={styles.textBox2}>
                      <Text style={{marginLeft: 5}}>Pendidikan</Text>
                      <View style={styles.rect}>
                        <TextInput
                          placeholder="Pendidikan"
                          style={styles.textInput}
                          editable={false}
                        >{currentData.pendidikan}</TextInput>
                      </View>
                    </View>
                    <View style={styles.textBox}>
                      <Text style={{marginLeft: 5}}>Profesi</Text>
                      <View style={styles.rect}>
                        <TextInput
                          placeholder="Profesi"
                          style={styles.textInput}
                          editable={updateData}
                        >{currentData.profesi}</TextInput>
                      </View>
                    </View>
                    <View style={styles.textBox}>
                      <Text style={{marginLeft: 5}}>Sertifikasi</Text>
                      <View style={styleSertifikasi}>
                        <TextInput
                          placeholder="Sertifikasi Keahlian"
                          style={styles.textInput}
                          editable={updateData}
                          autoCapitalize="words"
                          onChangeText={(e) => onChange(e, 'sertifikasi')}
                          ref={refSertifikasi}
                        >{currentData.sertifikasi}</TextInput>
                      </View>
                    </View>
                    <View style={styles.textBox} pointerEvents={!updateData ? 'none':'auto'}>
                      <Text style={{marginLeft: 5}}>Tempat Kerja Saat Ini</Text>
                      <RenderFaskes />
                    </View>
                    {/*<View style={styles.textBox}>
                      <Text style={{marginLeft: 5}}>Alamat Tempat Kerja</Text>
                      <View style={styleCompany_address}>
                        <TextInput
                          placeholder="Alamat Lengkap Tempat Kerja"
                          multiline={true}
                          maxLength={255}
                          style={styles.textInput2}
                          editable={updateData}
                          autoCapitalize="words"
                          onChangeText={(e) => onChange(e, 'company_address')}
                          ref={refCompany_address}
                        >{currentData.company_address}</TextInput>
                      </View>
                    </View>
                    <View style={styles.textBox}>
                      <Text style={{marginLeft: 5}}>Detail Alamat Tempat Kerja</Text>
                      <View style={styles.rect}>
                        <TextInput
                          placeholder={"Contoh : No. Rumah/Apartemen, RT/RW, Acuan \n(Boleh dikosongkan)"}
                          multiline={true}
                          maxLength={255}
                          style={styles.textInput2}
                          editable={updateData}
                          autoCapitalize="words"
                          onChangeText={(e) => onChange(e, 'company_address_detail')}
                        >{currentData.company_address_detail}</TextInput>
                      </View>
                    </View>*/}
                    <View style={styles.textBox}>
                      <Text style={{marginLeft: 5}}>Deskripsi Tentang Saya</Text>
                      <View style={styles.rect}>
                        <TextInput
                          placeholder="Deskripsi Tentang Saya"
                          multiline={true}
                          maxLength={1000}
                          style={styles.textInput2}
                          editable={updateData}
                          autoCapitalize="sentences"
                          onChangeText={(e) => onChange(e, 'about_me')}
                        >{currentData.about_me}</TextInput>
                      </View>
                    </View>

                    <CupertinoButtonInfo
                      style={styles.btnupdate}
                      updateData={updateData}
                      setUpdateData={setUpdateData}
                      onSubmit={onSubmit}
                    ></CupertinoButtonInfo>

                    {updateData ?
                    <CupertinoButtonCancel
                      style={styles.btncancel}
                      updateData={updateData}
                      setUpdateData={setUpdateData}
                      onCancel={onCancel}
                    ></CupertinoButtonCancel>:<></>}
                  
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
  group1: {
    width: 130,
    height: 30,
    flexDirection: "row",
    marginTop: 20,
    marginLeft: 20,
  },
  icon1: {
    color: "#41aadf",
    fontSize: 30
  },
  textBox: {
    height: 'auto',
    alignSelf: "stretch",
    marginBottom: 10,
  },
  textBox2: {
    height: 'auto',
    alignSelf: "stretch",
    marginBottom: 10,
    width: '55%'
  },
  text: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 16,
    marginLeft: 5,
    marginTop: 7
  },
  icon1Row: {
    height: 30,
    flexDirection: "row",
    flex: 1,
  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0,
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  rect: {
    height: 'auto',
    borderWidth: 1,
    borderColor: "#41aadf",
    borderRadius: 10,
    padding: 5
  },
  rectError: {
    height: 'auto',
    borderWidth: 1,
    borderColor: "red",
    borderRadius: 10,
    padding: 5
  },
  textInput: {
    fontFamily: "roboto-regular",
    color: "rgba(74,74,74,1)",
    height: 'auto',
    width: 'auto',
    padding: 0,
  },
  textInput2: {
    fontFamily: "roboto-regular",
    color: "rgba(74,74,74,1)",
    minHeight: 50,
    height: 'auto',
    width: 'auto',
    padding: 0,
  },
  btnupdate: {
    height: 40,
    width: 'auto'
  },
  btncancel: {
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
    marginTop: 0,
    flex: 1,
    padding: 20,
  },
  header1: {

  }
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    height: 'auto',
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#41aadf",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "white",
    fontSize: 14,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    height: 30,
    alignSelf: "stretch",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#41aadf",
    borderRadius: 10,
    padding: 5,
    backgroundColor: "white",
    fontSize: 14,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
});

export default Dataprofesi;
