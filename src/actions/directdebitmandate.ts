import apiReq from "./utils/nerasikaAxios";

export const getDirectDebitMandates = async (_filter: any = {}) =>  {
  const filter = {} as any;

  Object.keys(_filter).forEach((key: any) => {
    if (_filter[key]) filter[key] = _filter[key]
  });

  const res = await apiReq.get(
    "/platform/directdebit/mandates",
    { params: filter }
  );

  return res.data.data;
};
