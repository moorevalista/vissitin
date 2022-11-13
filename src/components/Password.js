import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

function Password(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.rect10}>
        <Text style={styles.text}>Password</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  rect10: {
    width: 304,
    height: 52,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#41aadf"
  },
  text: {
    fontFamily: "roboto-regular",
    color: "#121212",
    height: 23,
    width: 275,
    marginTop: 17,
    marginLeft: 18
  }
});

export default Password;
