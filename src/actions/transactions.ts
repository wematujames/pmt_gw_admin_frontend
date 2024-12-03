import axios from "axios";
import setAuthTokenHeader from "./utils/setAuthToken";

export const getTransactions = async (_filter: any = {}) =>  {
  setAuthTokenHeader()
  
  // await new Promise((res) => setTimeout(() => {
  //   res("");
  // }, 2000))
  
  const filter = {} as any;

  Object.keys(_filter.filter).forEach((key: any) => {
    if (_filter.filter[key]) filter[key] = _filter.filter[key]
  });

  const res = await axios(
    "/platform/transactions",
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      params: Object.assign(_filter.filter, {_page: _filter.pageParam})
    }
  );

  return { data: res.data.data, meta: res.data.meta };
};

export const getTransaction = async (txnId: string) =>  {
  setAuthTokenHeader()
  
  const res = await axios(
    `/platform/transactions/${txnId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return res.data.data ;
};
