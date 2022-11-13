import React, { Component } from "react";
import { StyleSheet, View, Image } from "react-native";

function Fotoprofile(props) {
  return (
    <View style={[styles.container, props.style]}>
      <Image
        source={props.thumbProfile ? {uri: props.thumbProfile} : require("../assets/images/profile-01.png")}
        resizeMode="cover"
        style={styles.image}
      ></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  }
});

export default Fotoprofile;
