import React, { Component } from "react";
import { StyleSheet, View, Switch, Text } from "react-native";

function CupertinoSwitch1(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Switch
        value={props.value ? true : false}
        thumbColor="rgba(65,170,223,1)"
        trackColor={{ true: "rgba(0,0,0,1)", false: "rgba(155,155,155,1)" }}
        style={styles.switch1}
      ></Switch>
      <Text style={styles.neuromuskular}>Neuromuskular</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center"
  },
  switch1: {
    width: 45,
    height: 22,
    alignSelf: "flex-start"
  },
  neuromuskular: {
    top: 4,
    left: 48,
    position: "absolute",
    fontFamily: "roboto-regular",
    color: "#121212"
  }
});

export default CupertinoSwitch1;
