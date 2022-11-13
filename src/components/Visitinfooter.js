import React, { Component } from "react";
import { StyleSheet, View, TouchableOpacity, Text } from "react-native";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import SimpleLineIconsIcon from "react-native-vector-icons/SimpleLineIcons";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import FeatherIcon from "react-native-vector-icons/Feather";
import Svg, { Ellipse } from "react-native-svg";
import MaterialCommunityIconsIcon from "react-native-vector-icons/MaterialCommunityIcons";

function Visitinfooter(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.group4}>
        <View style={styles.rectStack}>
          <View style={styles.rect}>
            <View style={styles.group3Row}>
              <TouchableOpacity style={styles.group3}>
                <View style={styles.rect6}>
                  <IoniconsIcon
                    name="md-paper"
                    style={styles.icon5}
                  ></IoniconsIcon>
                  <Text style={styles.transaksi}>Transaksi</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.group2}>
                <View style={styles.rect5}>
                  <SimpleLineIconsIcon
                    name="notebook"
                    style={styles.icon4}
                  ></SimpleLineIconsIcon>
                  <Text style={styles.laporan}>Laporan</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <View style={styles.rect2}>
                  <FontAwesomeIcon
                    name="calendar-check-o"
                    style={styles.icon}
                  ></FontAwesomeIcon>
                  <Text style={styles.jadwal}>Jadwal</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.settingbtn}>
                <View style={styles.rect3}>
                  <FeatherIcon
                    name="settings"
                    style={styles.icon2}
                  ></FeatherIcon>
                  <Text style={styles.setting}>Setting</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.button2}>
            <View style={styles.ellipseStack}>
              <Svg viewBox="0 0 95.08 95.08" style={styles.ellipse}>
                <Ellipse
                  strokeWidth={0}
                  fill="rgba(74,74,74,1)"
                  cx={48}
                  cy={48}
                  rx={48}
                  ry={48}
                ></Ellipse>
              </Svg>
              <TouchableOpacity style={styles.group}>
                <View style={styles.rect4}>
                  <View style={styles.pesanStack}>
                    <Text style={styles.pesan}>Pesan</Text>
                    <MaterialCommunityIconsIcon
                      name="message-text-outline"
                      style={styles.icon3}
                    ></MaterialCommunityIconsIcon>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,255,255,1)",
    flexDirection: "row",
    width: "100%"
  },
  group4: {
    height: 105,
    flex: 1,
    marginTop: -15
  },
  rect: {
    top: 15,
    left: 0,
    width: 414,
    height: 90,
    position: "absolute",
    backgroundColor: "rgba(74,74,74,1)",
    flex: 0.06,
    flexDirection: "row"
  },
  group3: {
    width: 83,
    height: 90
  },
  rect6: {
    width: 82,
    height: 90,
    marginLeft: 1
  },
  icon5: {
    color: "rgba(255,255,255,1)",
    fontSize: 22,
    height: 24,
    width: 19,
    marginTop: 29,
    marginLeft: 32
  },
  transaksi: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16
  },
  group2: {
    width: 83,
    height: 90
  },
  rect5: {
    width: 83,
    height: 90
  },
  icon4: {
    color: "rgba(255,255,255,1)",
    fontSize: 22,
    height: 25,
    width: 22,
    marginTop: 29,
    marginLeft: 31
  },
  laporan: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    marginTop: 3,
    marginLeft: 20
  },
  button: {
    width: 83,
    height: 90,
    marginLeft: 82
  },
  rect2: {
    width: 83,
    height: 90
  },
  icon: {
    color: "rgba(255,255,255,1)",
    fontSize: 22,
    height: 22,
    width: 22,
    marginTop: 29,
    marginLeft: 30
  },
  jadwal: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 22
  },
  settingbtn: {
    width: 83,
    height: 90
  },
  rect3: {
    width: 83,
    height: 90
  },
  icon2: {
    color: "rgba(255,255,255,1)",
    fontSize: 22,
    height: 22,
    width: 22,
    marginTop: 29,
    marginLeft: 30
  },
  setting: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    marginTop: 6,
    marginLeft: 22
  },
  group3Row: {
    height: 90,
    flexDirection: "row",
    flex: 1
  },
  button2: {
    top: 0,
    width: 105,
    height: 105,
    position: "absolute",
    left: 155
  },
  ellipse: {
    top: 0,
    width: 95,
    height: 95,
    position: "absolute",
    left: 0
  },
  group: {
    top: 15,
    width: 74,
    height: 90,
    position: "absolute",
    left: 10
  },
  rect4: {
    width: 72,
    height: 100
  },
  pesan: {
    top: 47,
    left: 6,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12
  },
  icon3: {
    top: 0,
    position: "absolute",
    color: "rgba(65,170,223,1)",
    fontSize: 45,
    left: 0,
    height: 49,
    width: 45
  },
  pesanStack: {
    width: 45,
    height: 61,
    marginTop: 10,
    marginLeft: 13
  },
  ellipseStack: {
    width: 95,
    height: 105,
    marginLeft: 5
  },
  rectStack: {
    width: 414,
    height: 105
  }
});

export default Visitinfooter;
