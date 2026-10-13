import { filterFalslyValues } from "@/utils/common";
import apiReq from "./utils/nerasikaAxios";

export const getPlatformMerchants = async (filter: any = {}) =>  {
  const res = await apiReq.get(
    "/platform/merchants",
    { params: filterFalslyValues(filter) }
  );

  return { data: res.data.data, meta: res.data.meta };
};

export const createMerchant = async (data: object = {}) =>  {
  const res = await apiReq.post("/platform/merchants", data);

  return res.data.data;
};

export const updateMerchantConfig = async (configId: string, config: object = {}) =>  {
  const res = await apiReq.put("/platform/merchantconfigs/" + configId, config);

  return res.data.data;
};

export const updateMerchantStatus = async (merchantId: string, active: boolean) =>  {
  const res = await apiReq.put("/platform/merchants/" + merchantId, { active });

  return res.data.data;
};
