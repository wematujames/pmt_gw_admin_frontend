import apiReq from "./utils/nerasikaAxios";

export const getTransactionsOverall = async (_filter: any = {}) =>  {
  const res = await apiReq.get("/platform/summary/transactionsoverall");

  return res.data.data;
};

export const getCollectionStatics = async (_filter: any = {}) =>  {
  const res = await apiReq.get("/platform/summary/collectiontransactionstats");

  return res.data.data;
};

export const getDibursementStatics = async (_filter: any = {}) =>  {
  const res = await apiReq.get("/platform/summary/disbursementtransactionstats");

  return res.data.data;
};
