import React, { Component, useState, useEffect, useContext } from "react";
import { TouchableOpacity, StyleSheet, View, Text } from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
import Svg, { Ellipse } from "react-native-svg";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import FeatherIcon from "react-native-vector-icons/Feather";
import { CommonActions } from '@react-navigation/native';

import Event from '../Event';
import RemotePushController from '../RemotePushController';
import { form_validation } from "../form_validation";

function Footer({ props, paramsCheck = null, dataLogin = null }) {
  const formValidation = useContext(form_validation);
  const [currentScreen, setCurrentScreen] = useState(props.route.name);
  const [unreadMsg, setUnreadMsg] = useState(formValidation.unreadMsg);

  //for realtime message check
  //const [getMessage, setGetMessage] = useState(formValidation.getMsg);

  //console.log(JSON.stringify(paramsCheck));
  //console.log(currentScreen);

  /*useEffect(() => {
    //alert('getMessage : ' + getMessage);
  },[getMessage]);

  const getPesan = (val) => {
    console.log('val ' + val);
    setGetMessage(val);
  }*/

  const openSetting = async() => {
    //alert(currentScreen);
    //props.navigation.navigate('settingScreen', { base_url: props.route.params.base_url } );
    if(currentScreen !== 'settingScreen') {
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
              params: { base_url: props.route.params.base_url, dataLogin: dataLogin },
            }
          ],
        })
      )
    }
  }

  const openJadwal = async() => {
    //alert(currentScreen);
    //props.navigation.navigate('allJadwalScreen', { base_url: props.route.params.base_url } );
    if(currentScreen !== 'allJadwalScreen') {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'mainMenuScreen',
              params: { base_url: props.route.params.base_url },
            },
            {
              name: 'allJadwalScreen',
              params: { base_url: props.route.params.base_url, dataLogin: dataLogin },
            }
          ],
        })
      )
    }
  }

  const openTransaksi = async() => {
    //props.navigation.navigate('transaksiScreen', { base_url: props.route.params.base_url } );
    if(currentScreen !== 'transaksiScreen') {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'mainMenuScreen',
              params: { base_url: props.route.params.base_url },
            },
            {
              name: 'transaksiScreen',
              params: { base_url: props.route.params.base_url, dataLogin: dataLogin },
            }
          ],
        })
      )
    }
  }

  const openLaporan = async() => {
    //props.navigation.navigate('transaksiScreen', { base_url: props.route.params.base_url } );
    if(currentScreen !== 'laporanScreen') {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 1,
          routes: [
            {
              name: 'mainMenuScreen',
              params: { base_url: props.route.params.base_url },
            },
            {
              name: 'laporanScreen',
              params: { base_url: props.route.params.base_url, dataLogin: dataLogin },
            }
          ],
        })
      )
    }
  }

  const openPesan = async () => {
    //props.navigation.navigate('listChat', { base_url: props.route.params.base_url });
    props.navigation.dispatch(
      CommonActions.reset({
        index: 1,
        routes: [
          {
            name: 'mainMenuScreen',
            params: { base_url: props.route.params.base_url },
          },
          {
            name: 'listChat',
            params: { base_url: props.route.params.base_url, dataLogin: dataLogin },
          }
        ],
      })
    )
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.shapefooter}>
        <View style={styles.rect2}>
          <View style={styles.group6}>
            <View></View>
            <TouchableOpacity onPress={openTransaksi}>
              <View style={styles.group}>
                <IoniconsIcon
                  name="md-paper-plane"
                  style={styles.icon}
                ></IoniconsIcon>
                <Text name="transaksi" style={styles.labelMenu}>Transaksi</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={openLaporan}>
              <View style={styles.group}>
                <SimpleLineIconsIcon
                  name="notebook"
                  style={styles.icon}
                ></SimpleLineIconsIcon>
                <Text style={styles.labelMenu}>Laporan</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={openPesan}>
              <View style={styles.group}>
                <View style={styles.ellipseStack}>
                  <IoniconsIcon
                    name="ios-chatbubbles"
                    style={styles.icon4}
                  />

                  {!unreadMsg ? 
                    <Svg viewBox="0 0 9.54 9.54" style={styles.ellipse2}>
                      <Ellipse
                        strokeWidth={0}
                        fill="rgba(255,0,0,1)"
                        cx={5}
                        cy={5}
                        rx={5}
                        ry={5}
                      ></Ellipse>
                    </Svg>
                    :
                    <></>
                  }
                </View>
                <Text style={styles.labelMenu}>Pesan</Text>
              </View>
            </TouchableOpacity>

            {/*<TouchableOpacity onPress={openPesan}>
            <View style={styles.rect3}>
              <View style={styles.rect4}>
                <View style={styles.ellipseStack}>
                  <Svg viewBox="0 0 92.96 92.96" style={styles.ellipse}>
                    <Ellipse
                      strokeWidth={0}
                      fill="#4a4a4a"
                      cx={46}
                      cy={46}
                      rx={46}
                      ry={46}
                    ></Ellipse>
                  </Svg>
                  
                    <IoniconsIcon
                      name="ios-chatbubbles"
                      style={styles.icon4}
                    ></IoniconsIcon>
                    <Text style={styles.pesan}>Pesan</Text>
                  
                  {!unreadMsg ? 
                    <Svg viewBox="0 0 9.54 9.54" style={styles.ellipse2}>
                      <Ellipse
                        strokeWidth={0}
                        fill="rgba(255,0,0,1)"
                        cx={5}
                        cy={5}
                        rx={5}
                        ry={5}
                      ></Ellipse>
                    </Svg>
                    :
                    <></>
                  }
                </View>
              </View>
            </View>
            </TouchableOpacity>*/}

            <TouchableOpacity onPress={openJadwal}>
              <View style={styles.group}>
                <FontAwesomeIcon
                  name="calendar-check-o"
                  style={styles.icon}
                ></FontAwesomeIcon>
                <Text style={styles.labelMenu}>Jadwal</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={openSetting}>
              <View style={styles.group}>
                <FeatherIcon name="settings" style={styles.icon}></FeatherIcon>
                <Text style={styles.labelMenu}>Setting</Text>
              </View>
            </TouchableOpacity>
            <Event props={props} paramsCheck={paramsCheck} setUnreadMsg={setUnreadMsg} />
          </View>
        </View>
      </View>
      {currentScreen !== 'listChat' ?
        <RemotePushController props={props} />:<></>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  shapefooter: {
    //height: 100,
    //marginTop: -16,
  },
  rect2: {
    //height: 91,
    backgroundColor: "#4a4a4a",
    paddingBottom: '2%'
  },
  group6: {
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
    //marginLeft: 9,
    //marginRight: 10,
  },
  group: {
    width: 60,
    height: 60
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 20,
    alignSelf: "center",
    marginTop: 19
  },
  labelMenu: {
    fontSize: 10,
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    marginTop: 3,
    alignSelf: 'center'
  },
  rect3: {
    //width: 61,
    //height: 60,
    alignSelf: "center"
  },
  rect4: {
    //width: 93,
    //height: 93,
    marginTop: -16,
    //marginLeft: -16
  },
  ellipse: {
    //top: 0,
    //width: 93,
    //height: 93,
    //position: "absolute",
    //left: 0
  },
  icon4: {
    //top: 6,
    left: 3,
    //position: "absolute",
    //marginTop: -16,
    color: "rgba(65,170,223,1)",
    fontSize: 50
  },
  pesan: {
    fontSize: 8,
    //top: 60,
    //position: "absolute",
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    //left: 20
  },
  ellipse2: {
    top: 10,
    left: 35,
    width: 10,
    height: 10,
    position: "absolute"
  },
  ellipseStack: {
    marginTop: -13,
    backgroundColor: "#4a4a4a",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  }
});

export default Footer;
