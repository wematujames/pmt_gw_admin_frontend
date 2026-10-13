import apiReq from "./utils/nerasikaAxios";

export const getTransactionsOverall = async (_filter: any = {}) =>  {
  const res = await apiReq.get("/platform/summary/transactionsoverall");

  return res.data.data;
};
