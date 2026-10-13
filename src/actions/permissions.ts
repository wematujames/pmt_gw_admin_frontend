import { filterFalslyValues } from "@/utils/common";
import apiReq from "./utils/nerasikaAxios";

export const getPlatformPermissions = async (filter: any = {}) =>  {
  const res = await apiReq.get(
    "/platform/permissions",
    { params: filterFalslyValues(filter) }
  );

  return res.data.data;
};

export const updateUserPermissions = async (userId: string, permissions: string[]) =>  {
  const res = await apiReq.put(
    "/platform/permissions/grant",
    { user: userId, permissions }
  );

  return res.data.data;
};
