import React, { Component, useState, useEffect, useRef, useContext, useCallback } from "react";
import { StyleSheet, View, Text, ScrollView, TextInput,
  TouchableOpacity, RefreshControl, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from "react-native";
import useChat from "../useChat";
import moment from 'moment-timezone';
import { form_validation } from "../../form_validation";
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import IconPanah from 'react-native-vector-icons/Ionicons';

const ChatRoomUser = (props) => {
  const formValidation = useContext(form_validation);

  const roomId = props.params.id_chat;
  const { messages, sendMessage } = useChat(roomId);
  const [newMessage, setNewMessage] = useState("");
  const { prevChat } = props;
  const id_pasien = props.id_pasien;
  const sendChat = props.sendChat;
  const [id_msg, setId_msg] = useState('');
  const saveMsgRef = props.saveMsgRef;
  //const [refMsg, setRefMsg] = useState('');
  //const terkirim = props.terkirim;
  const messagesEndRef = useRef();
  const [loading, setLoading] = useState(false);
  //const messagesPrev = useRef(null);
  //let id_msg = '';

  //console.log(prevChat);

  const scrollToBottom = () => {
    messagesEndRef.current.scrollToEnd({ animated: false })
    //messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const scrollToBottomPrev = () => {
    //messagesPrev.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom();
    (messages.length > 0) ? updateRefMsg(messages[messages.length -1].senderId):'';

    return () => {
      setLoading(false);
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
    //scrollToBottomPrev()
  }, [prevChat]);

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleSendMessage = (msg) => {
    sendMessage(msg);
    //setNewMessage("");
  };

  const handleSendChat = async () => {
    const msg = newMessage;
    setNewMessage("");
    setLoading(true);
    if(msg !== '') {
      scrollToBottom();
      let success = await sendChat(msg);
      if(success !== null) {
        await setId_msg(success);
        handleSendMessage(msg);
      }else {
        formValidation.showError('Tidak dapat mengirim pesan, coba kembali beberapa saat lagi...');
      }
    }
    setLoading(false);
  }

  function updateRefMsg(refMsg) {
    //alert(id_msg + '|' + ref);
    saveMsgRef(id_msg, refMsg);
  }

  // untuk icon
  const Icons = ({label, name, color}) => {
    if (label === 'Panah') {
      return (
        <IconPanah
          style={{
            backgroundColor: 'transparent',
            color: color ? color : 'rgba(0,0,0,1)',
            fontSize: 18,
            opacity: 0.8,
            fontWeight: 'bold',
          }}
          name={name}
        />
      );
    }
  };

  const [layout, setLayout] = useState({
    width: 0,
    height: 0,
  });

  return (
    <View style={styles.containerKey}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <>
            <View style={styles.container} onLayout={event => setLayout(event.nativeEvent.layout)}>
              <ScrollView
                horizontal={false}
                contentContainerStyle={styles.scrollArea_contentContainerStyle(layout)}
                /*refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                  />
                }*/
                ref={messagesEndRef}
              >
                
                <View style={styles.scrollArea}>
                  <View>
                    {prevChat[0] !== undefined && prevChat[0].id_msg !== null ? Object.keys(prevChat).map((message, i) => (
                      <View key={i} style={prevChat[i]['id_sender'] !== id_pasien ? [styles.bubleChat, {alignSelf: 'flex-end'}] : styles.bubleChat}>
                        <View style={prevChat[i]['id_sender'] !== id_pasien ? [styles.rectChat, {backgroundColor: "rgba(0,32,51,1)"}] : styles.rectChat}>
                          <Text style={prevChat[i]['id_sender'] !== id_pasien ? [styles.contentChat, {color: "rgba(250,250,250,1)"}] : styles.contentChat}>
                            {prevChat[i]['messages']}
                          </Text>
                          <Text style={prevChat[i]['id_sender'] !== id_pasien ? [styles.timeChat, {color: "rgba(250,250,250,1)"}] : styles.timeChat}>{prevChat[i]['timestamp']}</Text>
                          
                        </View>
                      </View>
                    )) : <></>}
                  </View>

                  <View>
                    {messages.map((message, i) => (
                      <View key={i} style={message.ownedByCurrentUser ? [styles.bubleChat, {alignSelf: 'flex-end'}] : styles.bubleChat}>
                        <View style={message.ownedByCurrentUser ? [styles.rectChat, {backgroundColor: "rgba(0,32,51,1)"}] : styles.rectChat}>
                            <Text style={message.ownedByCurrentUser ? [styles.contentChat, {color: "rgba(250,250,250,1)"}] : styles.contentChat}>
                              {message.body}
                            </Text>
                          <Text style={message.ownedByCurrentUser ? [styles.timeChat, {color: "rgba(250,250,250,1)"}] : styles.timeChat}>{message.timestamp}</Text>
                          
                        </View>
                      </View>
                    ))}
                  </View>
                  {loading ?
                    <View>
                        <View style={[styles.bubleChat, {alignSelf: 'flex-end'}]}>
                          <View style={[styles.rectChat, {backgroundColor: "rgba(0,32,51,1)"}]}>
                              <Text style={[styles.contentChat, {color: "rgba(250,250,250,1)"}]}>
                                Mengirim...
                              </Text>
                          </View>
                        </View>
                    </View>
                    :
                    <></>
                  }
                  
                </View>
              </ScrollView>
            </View>
          </>
        </TouchableWithoutFeedback>
        {/*<View style={styles.chatform}>
          <View style={styles.rect2Filler}></View>
          <View style={Platform.OS === 'ios' ? styles.rect2 : styles.rect2Android}>
            <View style={Platform.OS === 'ios' ? styles.group2 : styles.group2Android}>
              <View style={Platform.OS === 'ios' ? styles.mulaichat : styles.mulaichatAndroid}>
                <View style={ Platform.OS === 'ios' ? styles.rect4 : styles.rect4Android}>
                  <TextInput
                    placeholder="Ketik pesan..."
                    maxLength={500}
                    multiline={true}
                    style={Platform.OS === 'ios' ? styles.textInput : styles.textInputAndroid}
                    onChangeText={(e) => setNewMessage(e)}
                    value={newMessage}
                    //onEndEditing={(e) => setNewMessage(e.nativeEvent.text)}
                  />
                </View>
              </View>
              <View style={Platform.OS === 'ios' ? styles.send : styles.sendAndroid}>
                <TouchableOpacity style={Platform.OS === 'ios' ? styles.ellipseStack : styles.ellipseStackAndroid} disabled={loading} onPress={handleSendChat}>
                  <FontAwesomeIcon name="send" style={Platform.OS === 'ios' ? styles.icon2 : styles.icon2Android} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>*/}
        <View style={styles.Chat_input}>
          <View style={styles.Box}>
            <TextInput
              placeholder="Ketik Pesan..."
              multiline={true}
              maxLength={500}
              style={Platform.OS === 'ios' ? styles.InputIOS : styles.InputAndroid}
              onChangeText={(e) => setNewMessage(e)}
              value={newMessage}
            />
            <TouchableOpacity onPress={handleSendChat} disabled={loading}>
              <Icons label="Panah" name="paper-plane" />
            </TouchableOpacity>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingBottom: '25%',
    backgroundColor: 'rgba(255, 255, 255, 1)',
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20
  },
  containerKey: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
  },
  inner: {
    padding: 0,
    flex: 1,
    justifyContent: "space-around"
  },
  spinnerTextStyle: {
    color: '#FFF'
  },
  scrollArea: {
    flex: 1,
    top: 0,
    left: 0,
    padding: '2%'
  },
  scrollArea_contentContainerStyle: layout => ({
    height: 'auto',
    paddingBottom: '15%',
    minHeight: layout.height,
  }),
  bubleChat: {
    alignSelf: 'flex-start',
    marginTop: '4%',
    width: 'auto',
    minWidth: '40%',
    maxWidth: '70%'
  },
  rectChat: {
    paddingLeft: '2%',
    paddingRight: '2%',
    backgroundColor: "rgba(155,155,155,0.2)",
    borderRadius: 10,
    borderColor: "#000000",
    alignItems: 'flex-end',
  },
  contentChat: {
    width: '100%',
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 14,
    padding: '2%',
    marginBottom: '2%',
    marginTop: '2%'
  },
  timeChat: {
    fontFamily: "roboto-regular",
    color: "#121212",
    fontSize: 10,
    paddingRight: '2%',
    paddingLeft: '1%'
  },
  chatform: {
  },
  rect2Filler: {
    flex: 1,
  },
  rect2: {
    minHeight: 80,
    maxHeight: 150,
    height: 'auto',
    backgroundColor: "#4a4a4a",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: '4%'
  },
  group2: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-around"
  },
  mulaichat: {
    flex: 1
  },
  rect4: {
    padding: '2%',
    paddingLeft: '4%',
    paddingRight: '4%',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 20
  },
  textInput: {
    height: 'auto',
    fontFamily: "roboto-regular",
    color: "#121212",
  },
  send: {
    flex: 0.2,
    alignSelf: 'center',
    marginLeft: '1%',
  },
  ellipseStack: {
    height: 32,
    backgroundColor: '#41aadf',
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 20,
    padding: '2%'
  },
  icon2: {
    fontSize: 25,
    alignSelf: "center",
    color: "rgba(255,255,255,1)",
  },
  rect2Android: {
    minHeight: 80,
    maxHeight: 150,
    height: 'auto',
    backgroundColor: "#4a4a4a",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: '4%'
  },
  group2Android: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-around"
  },
  mulaichatAndroid: {
    flex: 1
  },
  rect4Android: {
    //padding: '2%',
    paddingLeft: '4%',
    paddingRight: '4%',
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 20
  },
  textInputAndroid: {
    height: 'auto',
    fontFamily: "roboto-regular",
    color: "#121212"
  },
  sendAndroid: {
    flex: 0.2,
    alignSelf: 'center',
    marginLeft: '1%',
    height: '100%'
  },
  ellipseStackAndroid: {
    height: 48,
    backgroundColor: '#41aadf',
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 20,
    padding: '2%'
  },
  icon2Android: {
    fontSize: 25,
    alignSelf: "center",
    color: "rgba(255,255,255,1)",
  },

  Chat_input: {
    // padding: 3,
    // backgroundColor: 'rgba(0,66,105,0.28)',
    backgroundColor: '#43A9DD',
    paddingVertical: Platform.OS === 'ios' ? '2%' : '2%',
    paddingHorizontal: '2%',
    borderTopLeftRadius: Platform.OS === 'ios' ? 10 : 20,
    borderTopRightRadius: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: Platform.OS === 'ios' ? '2%' : '8%',
  },

  Box: {
    // display: 'flex',
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignItems: 'center',
    // paddingHorizontal: 20,
    // borderRadius: 10,
    // backgroundColor: 'rgba(255, 255, 255, 1)',
    // borderWidth: 0.1,
    // borderColor: 'rgba(0,66,105,0.28)',

    maxHeight: 100,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 10 : 0,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderWidth: 0.1,
    borderColor: 'rgba(0,66,105,0.28)',
  },
  InputIOS: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(0,32,51,1)',
  },
  InputAndroid: {
    flex: 1,
    fontSize: 12,
    fontWeight: '400',
    //borderWidth: 1,
    color: 'rgba(0,32,51,1)',
  },
});

export default ChatRoomUser;