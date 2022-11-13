import React, { Component, useState, useEffect, useContext } from "react";

import Event from './Event';
import RemotePushController from './RemotePushController';
import { form_validation } from "./form_validation";

function FooterListener({ props, paramsCheck = null }) {
  //alert(JSON.stringify(paramsCheck));
  const formValidation = useContext(form_validation);
  const [currentScreen, setCurrentScreen] = useState(props.route.name);
  const [unreadMsg, setUnreadMsg] = useState(formValidation.unreadMsg);
  //alert(props.route.name);

  return (
    <>
      <Event props={props} paramsCheck={paramsCheck} setUnreadMsg={setUnreadMsg} />
      <RemotePushController props={props} />
    </>
  );
}

export default FooterListener;
