import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";

function Btncheckin(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} onPress={(props.order_state === "CONFIRM" || props.order_state === "REQCHECKIN") ? () => props.handleCheckIn(props.id) : () => props.handleOnsite(props.id)}>
      <Text style={styles.checkIn}>{(props.order_state === "CONFIRM" || props.order_state === "REQCHECKIN") ? "Check-In" : props.order_state}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "rgba(255,9,43,1)",
    borderRadius: 5,
    justifyContent: "center",
  },
  checkIn: {
    fontFamily: "roboto-regular",
    color: "rgba(255,255,255,1)",
    fontSize: 10,
    width: '100%',
    textAlign: "center",
  }
});

export default Btncheckin;
