import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

function Form(props) {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.rect10}>
        <Text style={styles.noHandphone}>No. Handphone</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  rect10: {
    width: 304,
    height: 49,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#41aadf"
  },
  noHandphone: {
    fontFamily: "roboto-regular",
    color: "#121212",
    marginTop: 17,
    marginLeft: 18
  }
});

export default Form;
