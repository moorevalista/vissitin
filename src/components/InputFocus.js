import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

function InputFocus(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.noHandphone2}>No. Handphone</Text>
      <View style={styles.field}>
        <View style={styles.input}>
          <Text style={styles.noHandphoneAktif}>No Handphone Aktif</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  noHandphone2: {
    backgroundColor: "transparent",
    color: "rgba(73,73,73,1)",
    fontSize: 14,
    fontFamily: "lato-regular"
  },
  field: {
    flex: 1,
    marginTop: 3
  },
  input: {
    height: 32,
    width: 250,
    borderWidth: 1,
    borderColor: "rgba(51,202,255,1)",
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,1)"
  },
  noHandphoneAktif: {
    backgroundColor: "transparent",
    color: "rgba(73,73,73,1)",
    fontSize: 14,
    fontFamily: "lato-regular",
    marginTop: 7,
    marginLeft: 9
  }
});

export default InputFocus;
