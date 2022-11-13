import React, { Component, useContext } from "react";
import { StyleSheet, TouchableOpacity, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';
import { form_validation } from "../form_validation";

function Logout({ props, dataLogin, setLoadingFetch }) {
  const formValidation = useContext(form_validation);

  const logout = async() => {
    //alert(JSON.stringify(props));
    setLoadingFetch(true);
    let params = [];
    params.push({ base_url: props.route.params.base_url, id_nakes: dataLogin.id_nakes, token: dataLogin.token });

    success = await formValidation.logout(params);
    
    if(success.status === true) {
      await AsyncStorage.clear();
      try {
        const value = await AsyncStorage.getItem('loginStateNakes')
        if(!value) {
          props.navigation.dispatch(
              CommonActions.reset({
                index: 1,
                routes: [
                  {
                    name: 'loginScreen',
                    //params: { base_url: base_url },
                  }
                ],
              })
            )
        }
      } catch(e) {
        // error reading value
        alert(e);
      }
    }
    
    //props.navigation.navigate('loginScreen');
  }

  return (
    <TouchableOpacity style={[styles.container, styles.logout]} onPress={logout}>
      <Text style={styles.text}>Log Out</Text>
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
  text: {
    color: "#fff",
    fontSize: 17
  },
  logout: {
    height: 33,
    width: 100,
    marginTop: 14,
    marginLeft: 29
  }
});

export default Logout;
