import React, { Component, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function CupertinoButtonGrey(props) {
  const [styleButton, setStyleButton] = useState(props.otpRequested);

  useEffect(() => {
    (props.otpVerified || !props.otpRequested || props.nohp === '') ? setStyleButton(styles.containerDisabled) : setStyleButton(styles.container);
  }, [props.otpRequested]);

  useEffect(() => {
    (props.otpVerified || !props.otpRequested || props.nohp === '') ? setStyleButton(styles.containerDisabled) : setStyleButton(styles.container);
  }, [props.otpVerified]);

  useEffect(() => {
    (props.otpVerified || !props.otpRequested || props.nohp === '') ? setStyleButton(styles.containerDisabled) : setStyleButton(styles.container);
  }, [props.nohp]);

  return (
    <TouchableOpacity disabled={(props.otpVerified || !props.otpRequested || props.nohp === '') ? true : false} style={[styleButton, props.style]} onPress={props.requestOTP}>
      <Text style={styles.requestOtp}>{props.seconds > 0 ? '(' + props.seconds + ' detik)': 'Request OTP'}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,105,0,1)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  containerDisabled: {
    backgroundColor: "rgba(255,105,0,0.50)",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  requestOtp: {
    color: "#fff",
    fontSize: 17
  }
});

export default CupertinoButtonGrey;
