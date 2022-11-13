import React, { Component } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView
} from "react-native";
import { Center } from "@builderx/utils";
import Svg, { Ellipse } from "react-native-svg";
import Icon from "react-native-vector-icons/FontAwesome";

function Suksesmsg(props) {
  return (
    <View style={styles.container}>
      <View style={styles.rect3}>
        <View style={styles.rect1Stack}>
          <View style={styles.rect1}>
            <TouchableOpacity style={styles.group2}>
              <View style={styles.rect2}>
                <Text style={styles.login}>Login</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.scrollArea}>
              <ScrollView
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle}
              >
                <Text style={styles.pendaftaranBerhasil6}>
                  PENDAFTARAN{"\n"}BERHASIL
                </Text>
                <Text style={styles.pendaftaranBerhasil2}>
                  Kami mengirimkan link aktivasi pada email anda, silahkan cek
                  dan aktivasi akun anda untuk dapat login pada platform
                  vissit.in
                </Text>
              </ScrollView>
            </View>
          </View>
          <Center horizontal>
            <View style={styles.group4}>
              <View style={styles.ellipse1Stack}>
                <Svg viewBox="0 0 112.73 112.73" style={styles.ellipse1}>
                  <Ellipse
                    stroke="rgba(255,255,255,1)"
                    strokeWidth={5}
                    fill="#3a3a3c"
                    cx={56}
                    cy={56}
                    rx={54}
                    ry={54}
                  ></Ellipse>
                </Svg>
                <Icon name="universal-access" style={styles.icon1}></Icon>
              </View>
            </View>
          </Center>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  rect3: {
    height: 786,
    marginTop: 110
  },
  rect1: {
    top: 55,
    height: 730,
    position: "absolute",
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: "#41aadf",
    flexDirection: "row",
    borderTopLeftRadius: 42,
    borderTopRightRadius: 42,
    left: 0,
    right: 0
  },
  group2: {
    height: 52,
    width: 304,
    marginLeft: 35,
    marginTop: 536
  },
  rect2: {
    height: 52,
    width: 304,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    borderBottomLeftRadius: 14,
    backgroundColor: "rgba(74,74,74,1)"
  },
  login: {
    color: "rgba(250,250,250,1)",
    lineHeight: 17,
    fontSize: 16,
    fontFamily: "roboto-700",
    marginTop: 17,
    marginLeft: 132
  },
  scrollArea: {
    height: 211,
    flex: 1,
    marginRight: 36,
    marginLeft: -302,
    marginTop: 98
  },
  scrollArea_contentContainerStyle: {
    height: 247
  },
  pendaftaranBerhasil6: {
    fontFamily: "roboto-700",
    color: "rgba(255,255,255,1)",
    fontSize: 30
  },
  pendaftaranBerhasil2: {
    backgroundColor: "transparent",
    color: "rgba(255,255,255,1)",
    fontSize: 25,
    marginTop: 21
  },
  group4: {
    top: 0,
    width: 113,
    height: 113,
    position: "absolute"
  },
  ellipse1: {
    top: 0,
    left: 0,
    width: 113,
    height: 113,
    position: "absolute"
  },
  icon1: {
    top: 26,
    left: 26,
    position: "absolute",
    color: "rgba(255,255,255,1)",
    fontSize: 60
  },
  ellipse1Stack: {
    width: 113,
    height: 113
  },
  rect1Stack: {
    height: 785,
    marginTop: 1
  }
});

export default Suksesmsg;
