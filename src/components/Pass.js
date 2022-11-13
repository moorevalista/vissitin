import React, { Component, useEffect, useState, useContext } from "react";
import { StyleSheet, View, TextInput } from "react-native";
import { form_validation } from "../form_validation";

function Pass(props) {
  const formValidation = useContext(form_validation);

  const [password, setPassword] = useState('');

  useEffect(() => {
    props.setData('setPassword', password)
  }, [password]);

  const onChangeInput = (e) => {
    val = formValidation.onChangeInput(e);
    setPassword(val);
  }

  return (
    <View style={[styles.container, props.style]}>
      <View style={Platform.OS === 'ios' ? styles.rectIOS : styles.rectAndroid}>
        <TextInput
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          secureTextEntry={true}
          editable={true}
          style={Platform.OS === 'ios' ? styles.inputIOS : styles.inputAndroid}
          onChangeText={onChangeInput}
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

export default Pass;
