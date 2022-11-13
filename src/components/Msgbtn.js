import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import Icon from "react-native-vector-icons/FontAwesome";

function Msgbtn(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.ellipseStack}>
        <Svg viewBox="0 0 112.19 112.19" style={styles.ellipse}>
          <Ellipse
            strokeWidth={0}
            fill="rgba(74,74,74,1)"
            cx={56}
            cy={56}
            rx={56}
            ry={56}
          ></Ellipse>
        </Svg>
        <Icon name="commenting-o" style={styles.icon1}></Icon>
        <Text style={styles.pesan}>Pesan</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  ellipse: {
    width: 112,
    height: 112,
    position: "absolute",
    left: 0,
    top: 0
  },
  icon1: {
    top: 17,
    position: "absolute",
    color: "rgba(255,255,255,1)",
    fontSize: 50,
    left: 31
  },
  pesan: {
    top: 74,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    textAlign: "center",
    left: 37
  },
  ellipseStack: {
    width: 112,
    height: 112
  }
});

export default Msgbtn;
