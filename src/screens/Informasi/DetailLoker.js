import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import {
  StyleSheet,
  Image,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ToastAndroid,
  ImageBackground,
  KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, RefreshControl, ActivityIndicator
} from 'react-native';

import { form_validation } from "../../form_validation";
import Spinner from 'react-native-loading-spinner-overlay';
import moment from 'moment-timezone';
import 'moment/locale/id';
import Loader from '../../components/Loader';
import {Header} from '../../components';
import Apply from "../../components/Apply";

export default function DetailLoker(props) {
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
        <View style={styles.Frame20}>
          <View style={styles.Frame19}>
            <View style={styles.boxImage}>
              <Image
                  source={{uri: thumbLogo}}
                  resizeMode="cover"
                  style={styles.logo}
                />
              <Text style={styles.Txt032}>{item.company_name.toUpperCase()}</Text>
            </View>
          </View>

          <View style={styles.Frame18}>
            <View style={styles.Frame17}>
              <View style={styles.Status}>
                <View style={styles.Text1}>
                  <View style={styles.boxImage}>
                    <Image
                      source={{uri: thumbImage}}
                      resizeMode="cover"
                      style={styles.image}
                    />
                  </View>
                  
                </View>
              </View>
              <View style={styles.Status}>
                <View style={styles.Text1}>
                  <Image
                    style={styles.Iconlock}
                    source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/w80k3yucnc-344%3A5694?alt=media&token=48571d88-397d-4bba-be28-1d566c397409",
                    }}
                  />
                  <Text style={styles.Txt488}>Status Pekerjaan</Text>
                </View>
                <Text style={styles.Txt779}>{item.status_pekerjaan.toUpperCase()}</Text>
              </View>
              <View style={styles.Status}>
                <View style={styles.Text1}>
                  <Image
                    style={styles.Iconlock}
                    source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/w80k3yucnc-344%3A5701?alt=media&token=c22be6b3-8953-40ea-9206-351e76b49c2e",
                    }}
                  />
                  <Text style={styles.Txt488}>Bidang/Posisi Pekerjaan</Text>
                </View>
                <Text style={styles.Txt779}>{item.bidang_pekerjaan.toUpperCase()}</Text>
              </View>
              <View style={styles.Status}>
                <View style={styles.Text1}>
                  <Image
                    style={styles.Iconlock}
                    source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/w80k3yucnc-344%3A5708?alt=media&token=d833c10e-6db9-469e-8da6-fee1c39d5a01",
                    }}
                  />
                  <Text style={styles.Txt488}>Batas Waktu Pendaftaran</Text>
                </View>
                <Text style={styles.Txt779}>{item.batas_waktu_pendaftaran}</Text>
              </View>
              <View style={styles.Status}>
                <View style={styles.Text1}>
                  <Image
                    style={styles.Iconlock}
                    source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/w80k3yucnc-344%3A5715?alt=media&token=bca83bdf-384b-4418-bf0a-fc23cc0d953e",
                    }}
                  />
                  <Text style={styles.Txt488}>Deskripsi Pekerjaan</Text>
                </View>
                <Text style={styles.Txt779}>
                  {item.deskripsi_pekerjaan}
                </Text>
              </View>
              <View style={styles.Status}>
                <View style={styles.Text1}>
                  <Image
                    style={styles.Iconlock}
                    source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/w80k3yucnc-344%3A5729?alt=media&token=70af8970-936c-4780-8b33-34a9de84d712",
                    }}
                  />
                  <Text style={styles.Txt488}>Persyaratan</Text>
                </View>
                <Text style={styles.Txt779}>
                  {item.persyaratan}
                </Text>
              </View>
              <View style={styles.Status}>
                <View style={styles.Text1}>
                  <Image
                    style={styles.Iconlock}
                    source={{
                      uri: "https://firebasestorage.googleapis.com/v0/b/unify-bc2ad.appspot.com/o/w80k3yucnc-344%3A5729?alt=media&token=70af8970-936c-4780-8b33-34a9de84d712",
                    }}
                  />
                  <Text style={styles.Txt488}>Estimasi Gaji</Text>
                </View>
                <Text style={styles.Txt779}>{item.range_gaji}</Text>
              </View>
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

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 18,
            opacity: 0.8,
            fontWeight: 'bold',
          }}
          name={name}
        />
      );
    }
  };

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
          <SafeAreaView style={styles.container}>
            <View
              style={styles.Detil_loker}
              onLayout={event => setLayout(event.nativeEvent.layout)}>
              
              {/*<View style={styles.User}>
                <View style={styles.subUser}>
                  {dataLogin ?
                  <Header name="setting" props={props} dataLogin={dataLogin} thumbProfile={dataLogin.thumbProfile}/>
                  :
                  <View style={styles.User} />
                }
                </View>
              </View>*/}

                <ScrollView
                  showsVerticalScrollIndicator={false}
                  horizontal={false}
                  contentContainerStyle={styles.scrollArea_contentContainerStyle}
                >

                {!loadingFetch ?
                  <RenderInfo />:<></>
                }
              </ScrollView>    
            </View>
          </SafeAreaView>
        </>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
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
    height: 'auto',
  },
  Detil_loker: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 25,
  },
  User: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
    marginBottom: 10,
  },
  subUser: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
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
    borderColor: "#000000",
    borderWidth: 1
  },

  Frame20: {
    marginTop: '5%',
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
  },
  Frame18: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: '5%',
    marginBottom: '5%',
  },
  Frame17: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  Status: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  Text1: {
    display: "flex",
    flexDirection: "row",
  },
  Iconlock: {
    width: 16,
    height: 20,
    marginRight: 4,
  },

  Status: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  Text1: {
    display: "flex",
    flexDirection: "row",
  },
  Iconlock: {
    width: 16,
    height: 20,
    marginRight: 4,
  },
  Txt488: {
    fontSize: 12,
    //fontFamily: "Poppins, sans-serif",
    fontWeight: "600",
    lineHeight: 14,
    color: "rgba(79,92,99,1)",
    width: 301,
    height: 21,
  },

  Txt779: {
    fontSize: 12,
    //fontFamily: "Poppins, sans-serif",
    fontWeight: "400",
    color: "rgba(79,92,99,1)",
    width: 301,
    height: 'auto',
  },

  Frame19: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  Txt032: {
    marginTop: '5%',
    fontSize: 14,
    //fontFamily: "Poppins, sans-serif",
    fontWeight: "600",
    lineHeight: 17,
    color: "rgba(0,0,0,1)",
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
})
