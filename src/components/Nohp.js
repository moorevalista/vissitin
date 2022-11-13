import React, { Component, useEffect, useState, useContext } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { form_validation } from "../form_validation";

function Nohp(props) {
  const formValidation = useContext(form_validation);

  const [nohp, setNohp] = useState(props.nohp);

  useEffect(() => {
    props.setData('setNohp', nohp)
  }, [nohp]);

  const onChangeHp = (e) => {
    val = formValidation.onChangeHp(nohp, e);
    setNohp(val);
  }

  return (
    <View style={[styles.container, props.style]}>
      <View style={Platform.OS === 'ios' ? styles.rectIOS : styles.rectAndroid}>
        <TextInput
          placeholder="No. Handphone"
          placeholderTextColor="#999"
          value={nohp}
          style={Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid}
          onChangeText={onChangeHp}
          keyboardType="numeric"
        ></TextInput>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  rectIOS: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(74,74,74,1)",
    padding: '4%'
  },
  rectAndroid: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(74,74,74,1)",
  },
  inputIOS: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    padding: 0
  },
  inputAndroid: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 18,
    paddingLeft: '4%',
    paddingRight: '4%'
  }
});

export default Nohp;
