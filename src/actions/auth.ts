"use client"

import axios from "axios";
export const login = async (email: string, password: string) =>  {
    const res = await axios(
      process.env.NEXT_PUBLIC_API_BASE_URL + "/platform/auth/login",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        data: { email, password },
      }
    );

    localStorage.setItem("token", res.data.data.token);

    return res.data.data;
};

export const loadUser = async () =>  {
    const res = await axios(
      "/platform/auth/user",
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        }
      }
    );

    return res.data.data;
};

export const forgotPassword = async (email: string,) =>  {
   return axios(
      "/platform/auth/forgotpassword",
      {
        method: "POST",
        headers: {  Accept: "application/json","Content-Type": "application/json", },
        data: { email },
      }
    );
};

export const resetPassword = async (resetToken: string, newPassword: string) =>  {
   return axios(
      "/platform/auth/resetpassword",
      {
        method: "POST",
        headers: {  Accept: "application/json","Content-Type": "application/json", },
        data: { resetToken, newPassword },
      }
    );
};
