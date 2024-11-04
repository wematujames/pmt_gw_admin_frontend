import axios from "axios";
import setAuthTokenHeader from "./utils/setAuthToken";

export const getPlatformMerchants = async (_filter: any = {}) =>  {
  setAuthTokenHeader()

  const filter = {} as any;

  Object.keys(_filter).forEach((key: any) => {
    if (_filter[key]) filter[key] = _filter[key]
  });

  const res = await axios(
    "/platform/merchants",
    { method: "GET", params: filter }
  );

  return res.data.data;
};

export const createMerchant = async (data: object = {}) =>  {
  setAuthTokenHeader()

  const res = await axios(
    "/platform/merchants",
    { method: "POST", data }
  );

  return res.data.data;
};

export const updateMerchantConfig = async (configId: string, config: object = {}) =>  {
  setAuthTokenHeader()

  const res = await axios(
    "/platform/merchantconfigs/" + configId,
    { method: "PUT", data: config }
  );

  return res.data.data;
};

export const updateMerchantStatus = async (merchantId: string, active: boolean) =>  {
  setAuthTokenHeader()

  const res = await axios(
    "/platform/merchants/" + merchantId,
    { method: "PUT", data: { active } }
  );

  return res.data.data;
};
