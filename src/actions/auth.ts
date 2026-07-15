"use client"

import apiReq from "./utils/nerasikaAxios";

export const login = async (email: string, pwd: string) =>  {
    const res = await apiReq.post(
      "/platform/auth/login",
       { email, password: pwd }, 
    );

    if (res.data.data.token){
      localStorage.setItem(process.env.NEXT_PUBLIC_API_AUTH_TOKEN!, res.data.data.token);
    }

    return res.data.data;
};

export const login2fa = async (vCode: string, tkn: string) =>  {
    const res = await apiReq.post(
      "/platform/auth/login2fa",
      {  verificationCode: vCode, loginToken: tkn }
    );

    localStorage && localStorage.setItem(process.env.NEXT_PUBLIC_API_AUTH_TOKEN!, res.data.data.token);
    
    return res.data.data;
};

export const loadUser = async () =>  {
    const res = await apiReq.get( "/platform/auth/user");

    return res.data.data;
};

export const forgotPassword = async (email: string,) =>  {
   return apiReq.post( "/platform/auth/forgotpassword",  { email });
};

export const resetPassword = async (tkn: string, pwd: string) =>  {
   return apiReq.post(
    "/platform/auth/resetpassword", 
    { resetToken: tkn, newPassword: pwd }
   );
};

export const updateUser = async ( updates: Object) =>  {

  return apiReq.put( "/platform/auth/user/updatedetails", updates );
};

export const updateUserEmail = async ( updates: Object) =>  {

  return apiReq.put("/platform/auth/user/updateemail", updates );
};

export const verifyUserEmail = async ( token: string) =>  {

  return apiReq.put("/platform/auth/user/verifyemail", { token });
};

export const resendEmailVeriLink = async ( token: string) =>  {

  return apiReq.put( "/platform/auth/user/updateemail",{ token } );
};

export const updateUserMobile = async ( updates: Object) =>  {

  return apiReq.put("/platform/auth/user/updatemobile",  updates );
};

export const updatePassword = async ( 
  currentPassword: string, 
  newPassword: string, 
  confirmNewPassword: string) =>  {

  return apiReq.put(
    "/platform/auth/user/updatepassword",
    { currentPassword, newPassword, confirmNewPassword }
  );
};

export const getQrCode = async () =>  {


  const qrCode = await apiReq.get("/platform/auth/genqrcode");

  return qrCode.data.data?.qrImage;
};

export const enable2Fa = async ( verficationCode: string) =>  {

  return apiReq.post( "/platform/auth/enablemultifa", { verficationCode });
};

export const logoutUser = async () =>  {
  const res = await apiReq.get("/platform/auth/logout");
  
  return res.data;
};

