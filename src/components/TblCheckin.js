import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

function TblCheckin(props) {
  return (
    <TouchableOpacity style={[styles.container, props.style]} disabled={props.reqCheckin || props.order_state === 'REQCHECKIN' ? true : false} onPress={props.handleCheckIn}>
      <Text style={styles.checkIn}>
        {props.order_state === 'CONFIRM' || props.order_state === 'REQCHECKIN' && props.currentState !== 'ONSITE' ?
          props.reqCheckin || props.order_state === 'REQCHECKIN' ?
            'Menunggu Konfirmasi dari Klien'
            :
            'CHECK-IN'
          :
          ''
        }
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 5,
    paddingLeft: 16,
    paddingRight: 16
  },
  checkIn: {
    color: "#fff",
    fontSize: 17
  }
});

export default TblCheckin;
