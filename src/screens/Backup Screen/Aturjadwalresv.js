import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, ScrollView, Text, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import Headr1 from "../components/Headr1";
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
import CompJadwal from "../components/CompJadwal";
import Loader from '../components/Loader';
import { CommonActions } from '@react-navigation/native';

function Aturjadwalresv(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  const [dataNakes, setDataNakes] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);
  const [updateData, setUpdateData] = useState(false);
  const [jadwalExist, setJadwalExist] = useState([]);
  const [jamPilihan, setJamPilihan] = useState('');

  const [refreshing, setRefreshing] = useState(false);

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const getLoginData = async () => {
    success = await formValidation.getLoginData();

    //alert(JSON.stringify(success));
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
      setDataNakes([]);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      setCurrentDataNakes();
    }

    return () => {
      setLoadingSave(false);
    }
  },[dataLogin]);

  useEffect(() => {
    if(jadwalExist) {
      setCurrJadwalExist();
    }

    return () => {
      setLoadingSave(false);
    }
  },[jadwalExist]);

  useEffect(() => {
    refreshing ? setCurrentDataNakes() : '';

    return () => {
      setLoadingSave(false);
    }
  },[refreshing]);

  const setDefaultJamPilihan = async () => {
    await setJamPilihan(
      {
        senin: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        selasa: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        rabu: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        kamis: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        jumat: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        sabtu: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
        minggu: {
          pagi: {
            awal: '',
            akhir: '',
            active: false
          },
          sore: {
            awal: '',
            akhir: '',
            active: false
          },
        },
      }
    )
  }

  const setCurrentDataNakes = async () => {
    await setDefaultJamPilihan();
    await setLoading(true);
    await getJadwalNakes();
    //await setCurrJadwalExist();
    await setLoading(false);
  }

  const getJadwalNakes = async () => {
    let params = [];
    params.push({ base_url: props.route.params.base_url, id_nakes: dataLogin.id_nakes, token: dataLogin.token });

    success = await formValidation.getJadwalNakes(params);

    if(success.status === true) {
      try {
        await setJadwalExist(success.res);
      } catch (error) {
        alert(error);
      } finally {

      }
    }
  }

  async function setCurrJadwalExist() {
    //alert(JSON.stringify(jadwalExist));
    const newItems = jadwalExist;
    let newJamPilihan = { ...jamPilihan };
    let shift = '';
    let jadwal = '';

    if(newItems !== null) {
      newItems.map((item, i) => {
        let hari = newItems[i];
        //console.log(hari);
        Object.keys(hari).map((key, i) => { //key = senin, selasa dst
          shift = hari[key];
          Object.keys(shift).map((keys, i) => {
            jadwal = shift[keys];
            Object.keys(jadwal).map((keyName, i) => { //keyName = pagi, sore
              newJamPilihan[key][keyName]['awal'] = jadwal[keyName]['awal'];
              newJamPilihan[key][keyName]['akhir'] = jadwal[keyName]['akhir'];

              newJamPilihan[key][keyName]['active'] = jadwal[keyName]['active'] === '1' ? true : false;

              setJamPilihan(newJamPilihan);
            })
          })
        })
      })
    }
  }

  async function handleChangeJadwal(e, name, shift) {
    //let checked = e ? '1' : '0';

    if(shift === 'pagi') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: jamPilihan[name].pagi.awal, akhir: jamPilihan[name].pagi.akhir, active: e},
                                        sore: {awal: jamPilihan[name].sore.awal, akhir: jamPilihan[name].sore.akhir, active: jamPilihan[name].sore.active}
                              }
                            };
      await setJamPilihan(newJamPilihan);
    }else if(shift === 'sore') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: jamPilihan[name].pagi.awal, akhir: jamPilihan[name].pagi.akhir, active: jamPilihan[name].pagi.active},
                                        sore: {awal: jamPilihan[name].sore.awal, akhir: jamPilihan[name].sore.akhir, active: e}
                              }
                            };
      await setJamPilihan(newJamPilihan);
    }
    //alert(JSON.stringify(newJamPilihan));
  }

  async function handleChangeJamAwal(id, name, e) {
    //alert(e);
    let value = e;
    if(id === 'pagi') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: value, akhir: '', active: jamPilihan[name].pagi.active},
                                        sore: {awal: jamPilihan[name].sore.awal, akhir: jamPilihan[name].sore.akhir, active: jamPilihan[name].sore.active}
                                      }
                            }
      await setJamPilihan(newJamPilihan);
    }else if(id === 'sore') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: jamPilihan[name].pagi.awal, akhir: jamPilihan[name].pagi.akhir, active: jamPilihan[name].pagi.active},
                                        sore: {awal: value, akhir: '', active: jamPilihan[name].sore.active}
                                      }
                            }
      await setJamPilihan(newJamPilihan);
    }
    //alert(JSON.stringify(jamPilihan));
  }

  async function handleChangeJamAkhir(id, name, e) {
    let value = e;
    if(id === 'pagi') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: jamPilihan[name].pagi.awal, akhir: value, active: jamPilihan[name].pagi.active},
                                        sore: {awal: jamPilihan[name].sore.awal, akhir: jamPilihan[name].sore.akhir, active: jamPilihan[name].sore.active}
                                      }
                            }
      await setJamPilihan(newJamPilihan);
    }else if(id === 'sore') {
      const newJamPilihan = { ...jamPilihan,
                              [name]: {
                                        pagi: {awal: jamPilihan[name].pagi.awal, akhir: jamPilihan[name].pagi.akhir, active: jamPilihan[name].pagi.active},
                                        sore: {awal: jamPilihan[name].sore.awal, akhir: value, active: jamPilihan[name].sore.active}
                                      }
                            }
      await setJamPilihan(newJamPilihan);
    }
  }

  const handleValidSubmit = () => {
    let isValid = true;
    let errorMsg = {};

    const waktu = jamPilihan;

    Object.keys(jamPilihan).map((keyHari, i) => { //keyHari = senin, selasa dst
      let jamPagiAwal = (jamPilihan[keyHari]['pagi']['awal']);
      let jamPagiAkhir = (jamPilihan[keyHari]['pagi']['akhir']);
      let jamSoreAwal = (jamPilihan[keyHari]['sore']['awal']);
      let jamSoreAkhir = (jamPilihan[keyHari]['sore']['akhir']);

      if(((jamPagiAwal !== '' && jamPagiAkhir === '') || (jamPagiAwal === '' && jamPagiAkhir !== '')) || ((jamSoreAwal !== '' && jamSoreAkhir === '') || (jamSoreAwal === '' && jamSoreAkhir !== ''))) {
        isValid = false;
      }
    })
    return isValid;
  }

  const onCancel = async () => {
    await setUpdateData(!updateData);
    onRefresh();
  }

  const onSubmit = async () => {
    if(handleValidSubmit()) {
      setLoadingSave(true);

      const formData = new FormData();
      formData.append("id_nakes", dataLogin.id_nakes);
      formData.append("jamPilihan", JSON.stringify(jamPilihan));
      formData.append("token", dataLogin.token);

      axios
      .post(props.route.params.base_url + "nakes/saveJadwalNakes/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then((res => {
        //alert(JSON.stringify(res)); return;
        if(res.data.responseCode !== '000') {
          showError((res.data.messages[0] !== undefined && res.data.messages[0].length > 1) ? res.data.messages[0] : res.data.messages);
        }else {
          setUpdateData(false);
          showError('Data berhasil disimpan...');
          //onRefresh();
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
        setLoadingSave(false);
      }))
      .catch(error => {
        setLoadingSave(false);
        //alert((error)); return;
        if(error.response != undefined && error.response.status == 404) {
          showError('Terjadi kesalahan...');
        }else if(error.response.data.status == 401 && error.response.data.messages.error == 'Expired token'){
          showError(error.response.data.messages.error);
        }else {
          showError(error);
        }
      })
    }else {
      showError('Gagal menyimpan jadwal, silahkan periksa kembali jadwal yang ingin disimpan.');
    }
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
                <View style={styles.scrollAreaStack}>
                  <View style={[styles.scrollArea, styles.inner]}>
                      <CompJadwal
                        name="senin"
                        label="Senin"
                        handleChangeJadwal={handleChangeJadwal}
                        handleChangeJamAwal={handleChangeJamAwal}
                        handleChangeJamAkhir={handleChangeJamAkhir}
                        jadwalExist={jadwalExist}
                        jamPilihan={jamPilihan}
                        updateData={updateData}
                      />
                      <CompJadwal
                        name="selasa"
                        label="Selasa"
                        handleChangeJadwal={handleChangeJadwal}
                        handleChangeJamAwal={handleChangeJamAwal}
                        handleChangeJamAkhir={handleChangeJamAkhir}
                        jadwalExist={jadwalExist}
                        jamPilihan={jamPilihan}
                        updateData={updateData}
                      />
                      <CompJadwal
                        name="rabu"
                        label="Rabu"
                        handleChangeJadwal={handleChangeJadwal}
                        handleChangeJamAwal={handleChangeJamAwal}
                        handleChangeJamAkhir={handleChangeJamAkhir}
                        jadwalExist={jadwalExist}
                        jamPilihan={jamPilihan}
                        updateData={updateData}
                      />
                      <CompJadwal
                        name="kamis"
                        label="Kamis"
                        handleChangeJadwal={handleChangeJadwal}
                        handleChangeJamAwal={handleChangeJamAwal}
                        handleChangeJamAkhir={handleChangeJamAkhir}
                        jadwalExist={jadwalExist}
                        jamPilihan={jamPilihan}
                        updateData={updateData}
                      />
                      <CompJadwal
                        name="jumat"
                        label="Jumat"
                        handleChangeJadwal={handleChangeJadwal}
                        handleChangeJamAwal={handleChangeJamAwal}
                        handleChangeJamAkhir={handleChangeJamAkhir}
                        jadwalExist={jadwalExist}
                        jamPilihan={jamPilihan}
                        updateData={updateData}
                      />
                      <CompJadwal
                        name="sabtu"
                        label="Sabtu"
                        handleChangeJadwal={handleChangeJadwal}
                        handleChangeJamAwal={handleChangeJamAwal}
                        handleChangeJamAkhir={handleChangeJamAkhir}
                        jadwalExist={jadwalExist}
                        jamPilihan={jamPilihan}
                        updateData={updateData}
                      />
                      <CompJadwal
                        name="minggu"
                        label="Minggu"
                        handleChangeJadwal={handleChangeJadwal}
                        handleChangeJamAwal={handleChangeJamAwal}
                        handleChangeJamAkhir={handleChangeJamAkhir}
                        jadwalExist={jadwalExist}
                        jamPilihan={jamPilihan}
                        updateData={updateData}
                      />

                      <CupertinoButtonInfo
                        style={styles.btnsimpan1}
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
  header1: {

  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0,
  },
  scrollArea_contentContainerStyle: {
    height: 'auto',
  },
  btnsimpan1: {
    height: 40,
    marginTop: 30
  },
  scrollAreaStack: {
    height: 'auto',
    marginTop: 0,
    flex: 1,
    padding: 20,
  },
  btncancel: {
    marginTop: 10,
    height: 40,
    width: 'auto',
  },
});

export default Aturjadwalresv;
