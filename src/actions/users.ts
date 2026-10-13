import { filterFalslyValues } from "@/utils/common";
import apiReq from "./utils/nerasikaAxios";

export const getPlatformUsers = async (filter: any = {}) =>  {
  const res = await apiReq.get(
    "/platform/users",
    { params: filterFalslyValues(filter) }
  );

  return { data: res.data.data, meta: res.data.meta };
};

export const createUser = async (data: object = {}) =>  {
  const res = await apiReq.post("/platform/users", data);

  return res.data.data;
};

export const updateUserStatus = async (userId: string, active: boolean) =>  {
  const res = await apiReq.put("/platform/users/" + userId, { active });

  return res.data.data;
};
