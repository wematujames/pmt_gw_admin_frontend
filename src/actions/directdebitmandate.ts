import { filterFalslyValues } from "@/utils/common";
import apiReq from "./utils/nerasikaAxios";

export const getDirectDebitMandates = async (filter: any = {}) =>  {
  const res = await apiReq.get(
    "/platform/directdebit/mandates",
    { params: filterFalslyValues(filter) }
  );

  return { data: res.data.data, meta: res.data.meta };
};
