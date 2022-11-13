import React, { Component, useState, useEffect, useRef, useContext } from "react";
import { StyleSheet, View, ScrollView, Image, Text, TouchableWithoutFeedback, KeyboardAvoidingView, Keyboard, RefreshControl } from "react-native";
import HeaderInformasi from "../components/HeaderInformasi";
import Apply from "../components/Apply";
import Footer from "../components/Footer";
import { form_validation } from "../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import 'moment/locale/id';
import Loader from '../components/Loader';

function InfoDetailPage(props) {
  const formValidation = useContext(form_validation);
  const [dataLogin, setDataLogin] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingFetch, setLoadingFetch] = useState(true);
  const [loadingSave, setLoadingSave] = useState(false);

  const [detailInfo, setDetailInfo] = useState('');

  useEffect(() => {
    //getLoginData();
    setDataLogin(props.route.params.dataLogin);

    return () => {
      setLoadingFetch(false);
    }
  },[]);

  useEffect(() => {
    if(dataLogin) {
      setCurrentData();
    }

    return () => {
      setLoadingFetch(false);
    }
  },[dataLogin]);

  const setCurrentData = async () => {
    await setDetailInfo(props.route.params.detailInfo);
    setLoadingFetch(false);
  }

  function RenderInfo() {
    const item = detailInfo[0];
    if(item) {
      let thumbLogo = props.route.params.base_url + 'data_assets/imageInfo/' + item.logo;
      let thumbImage = props.route.params.base_url + 'data_assets/imageInfo/' + item.image;
      return (
        <View style={styles.group}>
          <View style={styles.boxImage}>
            <Image
              source={{uri: thumbLogo}}
              resizeMode="cover"
              style={styles.logo}
            />
          </View>
          <View style={styles.back_title}>
            <Text style={styles.title}>{item.company_name.toUpperCase()}</Text>
          </View>
          <View style={styles.boxImage}>
            <Image
              source={{uri: thumbImage}}
              resizeMode="cover"
              style={styles.image}
            />
          </View>
          <View style={styles.boxEvent}>
            <View style={styles.itemEvent}>
              <Text style={styles.labelTitle}>STATUS PEKERJAAN</Text>
              <Text style={styles.labelEvent}>{item.status_pekerjaan.toUpperCase()}</Text>
            </View>
            <View style={styles.itemEvent}>
              <Text style={styles.labelTitle}>BIDANG PEKERJAAN/PROFESI</Text>
              <Text style={styles.labelEvent}>{item.bidang_pekerjaan.toUpperCase()}</Text>
            </View>
            <View style={styles.itemEvent}>
              <Text style={styles.labelTitle}>BATAS WAKTU PENDAFTARAN</Text>
              <Text style={styles.labelEvent}>{item.batas_waktu_pendaftaran}</Text>
            </View>
            <View style={styles.itemEvent}>
              <Text style={styles.labelTitle}>DESKRIPSI PEKERJAAN</Text>
              <Text style={styles.labelEvent}>{item.deskripsi_pekerjaan}</Text>
            </View>
            <View style={styles.itemEvent}>
              <Text style={styles.labelTitle}>PERSYARATAN</Text>
              <Text style={styles.labelEvent}>{item.persyaratan}</Text>
            </View>
            <View style={styles.itemEvent}>
              <Text style={styles.labelTitle}>BENEFIT PEKERJAAN</Text>
              <Text style={styles.labelEvent}>{item.benefit}</Text>
            </View>
            <View style={styles.itemEvent}>
              <Text style={styles.labelTitle}>EKSPEKTASI GAJI</Text>
              <Text style={styles.labelEvent}>{item.range_gaji}</Text>
            </View>
            <Apply style={styles.materialButtonPrimary} label="DAFTAR" link={item.link} />
          </View>
        </View>
      )
    }else {
      return (
        <View style={styles.group}>
          <Text style={styles.title2}>Tidak ada data</Text>
        </View>
      )
    }
  }

  return (
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

        <HeaderInformasi style={styles.headerInformasi} props={props} />
          <ScrollView
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
              >
              <View style={styles.container}>
                <View style={styles.scrollAreaStack}>
                  <View style={[styles.scrollArea, styles.inner]}>
                    {!loadingFetch ?
                      <RenderInfo />:<></>
                    }
                  </View>
                </View>
              </View>
          </ScrollView>
          <View>
            <Footer props={props} dataLogin={dataLogin} />
          </View>

        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
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
    flex: 1,
    justifyContent: "space-around"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  headerInformasi: {
    height: 75
  },
  scrollArea: {
    flex: 1
  },
  scrollArea_contentContainerStyle: {
    height: 'auto'
  },
  group: {
    height: 'auto',
    justifyContent: "space-between",
    alignItems: 'center',
    padding: '5%'
  },
  boxImage: {
    flex: 1,
    alignItems: 'center',
  },
  image: {
    width: 320,
    height: 320,
    borderRadius: 15,
    borderColor: "#000000",
  },
  logo: {
    width: 119,
    height: 119,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: "#000000",
  },
  back_title: {
    height: 'auto',
    padding: '2%',
    alignItems: 'center',
    marginTop: '5%'
  },
  title: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    textAlign: "center",
    fontSize: 16,
    fontWeight: 'bold'
  },
  title2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 12,
    fontWeight: "bold",
    alignSelf: 'center',
    height: 'auto',
    padding: '1%',
  },
  boxEvent: {
    padding: '4%',
  },
  itemEvent: {
    marginTop: '2%',
    alignItems: 'center'
  },
  labelEvent: {
    fontFamily: "roboto-regular",
    color: "rgba(0,0,0,1)",
    fontSize: 12
  },
  labelTitle: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    fontSize: 12,
    fontWeight: 'bold'
  },


  statusPekerjaan: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    fontSize: 12,
    marginTop: 24
  },
  fullTime: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 16
  },
  text: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    fontSize: 12,
    marginTop: 18
  },
  fisioterapis: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 16
  },
  kategoriKegiatan: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    fontSize: 12,
    marginTop: 19
  },
  gratis: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 16
  },
  deskripsiPekerjaan: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    marginTop: 16
  },
  isialasan1: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
    marginLeft: 21
  },
  gambaranJobdesc: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    marginTop: 21
  },
  text2: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
    marginLeft: 21
  },
  persyaratan: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    marginTop: 21
  },
  text3: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "left",
    fontSize: 14,
    marginTop: 7,
    marginLeft: 21
  },
  benefitPekerjaan: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    marginTop: 25
  },
  text4: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 14,
    marginTop: 7,
    marginLeft: 21
  },
  ekspektasiGaji: {
    fontFamily: "roboto-regular",
    color: "rgba(65,170,223,1)",
    textAlign: "center",
    marginTop: 26
  },
  text5: {
    fontFamily: "roboto-regular",
    color: "#121212",
    textAlign: "center",
    fontSize: 14,
    marginTop: 8,
    marginLeft: 21
  },
  materialButtonPrimary: {
    height: 36,
    width: 208,
    shadowColor: "rgba(0,0,0,1)",
    shadowOffset: {
      width: 3,
      height: 3
    },
    elevation: 5,
    shadowOpacity: 0.01,
    shadowRadius: 0,
    borderRadius: 20,
    marginTop: 39,
    alignSelf: "center"
  },
  
  scrollAreaStack: {
    height: 'auto',
    flex: 1
  }
});

export default InfoDetailPage;
