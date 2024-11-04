import axios from "axios";
import setAuthTokenHeader from "./utils/setAuthToken";

export const getPlatformPermissions = async (_filter: any = {}) =>  {
  setAuthTokenHeader()
  
  const filter = {} as any;

  Object.keys(_filter).forEach((key: any) => {
    if (_filter[key]) filter[key] = _filter[key]
  });

  const res = await axios(
    "/platform/permissions",
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


export const updateUserPermissions = async (userId: string, permissions: string[]) =>  {
  setAuthTokenHeader()

  const res = await axios(
    "/platform/permissions/grant",
    {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: {user: userId, permissions}
    }
  );

  return res.data.data;
};
