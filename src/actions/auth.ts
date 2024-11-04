"use client"

import axios from "axios";
import setAuthTokenHeader from "./utils/setAuthToken";

export const login = async (email: string, pwd: string) =>  {
    const res = await axios.post(
      "/platform/auth/login",
       { email, password: pwd }, 
    );

    if (res.data.data.token){
      localStorage.setItem("nerasol-token", res.data.data.token);
    }

    return res.data.data;
};

export const login2fa = async (vCode: string, tkn: string) =>  {
    const res = await axios.post(
      "/platform/auth/login2fa",
      {  verificationCode: vCode, loginToken: tkn }
    );

    localStorage && localStorage.setItem("nerasol-token", res.data.data.token);
    
    return res.data.data;
};

export const loadUser = async () =>  {
    setAuthTokenHeader()

    const res = await axios.get( "/platform/auth/user");

    return res.data.data;
};

export const forgotPassword = async (email: string,) =>  {
   return axios.post( "/platform/auth/forgotpassword",  { email });
};

export const resetPassword = async (tkn: string, pwd: string) =>  {
   return axios.post(
    "/platform/auth/resetpassword", 
    { resetToken: tkn, newPassword: pwd }
   );
};

export const updateUser = async ( updates: Object) =>  {

  setAuthTokenHeader()

  return axios.put( "/platform/auth/user/updatedetails", updates );
};

export const updateUserEmail = async ( updates: Object) =>  {
  setAuthTokenHeader()

  return axios.put("/platform/auth/user/updateemail", updates );
};

export const verifyUserEmail = async ( token: string) =>  {
  setAuthTokenHeader()

  return axios.put("/platform/auth/user/verifyemail", { token });
};

export const resendEmailVeriLink = async ( token: string) =>  {
  setAuthTokenHeader()

  return axios.put( "/platform/auth/user/updateemail",{ token } );
};

export const updateUserMobile = async ( updates: Object) =>  {
  setAuthTokenHeader()

  return axios.put("/platform/auth/user/updatemobile",  updates );
};

export const updatePassword = async ( 
  currentPassword: string, 
  newPassword: string, 
  confirmNewPassword: string) =>  {
  setAuthTokenHeader();

  return axios.put(
    "/platform/auth/user/updatepassword",
    { currentPassword, newPassword, confirmNewPassword }
  );
};

export const getQrCode = async () =>  {
  setAuthTokenHeader();

  const qrCode = await axios.get("/platform/auth/genqrcode");

  return qrCode.data.data?.qrImage;
};

export const enable2Fa = async ( verficationCode: string) =>  {
  setAuthTokenHeader();

  return axios.post( "/platform/auth/enablemultifa", { verficationCode });
};

export const logoutUser = async () =>  {

  setAuthTokenHeader();

  const res = await axios.get("/platform/auth/logout");

  localStorage.removeItem(`nerasol-token`);
  
  return res.data;
};

