import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";

function Btnbooking(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Text style={styles.booking}>Booking</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(65,170,223,1)",
    borderRadius: 10
  },
  booking: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 12,
    textAlign: "center",
    height: 'auto',
    width: '100%',
    padding: '1%',
  }
});

export default Btnbooking;
