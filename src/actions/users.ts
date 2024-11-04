import axios from "axios";
import setAuthTokenHeader from "./utils/setAuthToken";

export const getPlatformUsers = async (_filter: any = {}) =>  {
  setAuthTokenHeader()
  
  const filter = {} as any;

  Object.keys(_filter).forEach((key: any) => {
    if (_filter[key]) filter[key] = _filter[key]
  });

  const res = await axios(
    "/platform/users",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      params: filter
    }
  );

  return res.data.data;
};

export const getPlatformUser = async (userId: string) =>  {
  setAuthTokenHeader()
  
  const res = await axios(
    "/platform/users/" + userId,
    { method: "GET" }
  );

  return res.data.data;
};

export const createUser = async (data: object = {}) =>  {
  setAuthTokenHeader()

  const res = await axios(
    "/platform/users",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data
    }
  );

  return res.data.data;
};

export const updateUserStatus = async (userId: string, active: boolean) =>  {
  setAuthTokenHeader()

  const res = await axios(
    "/platform/users/" + userId,
    { method: "PUT", data: { active } }
  );

  return res.data.data;
};
