import { filterFalslyValues } from "@/utils/common";
import apiReq from "./utils/nerasikaAxios";

export const getTransactions = async (filter: any = {}) =>  {
  const res = await apiReq.get(
    "/platform/transactions",
    { params: filterFalslyValues(filter) }
  );

  return { data: res.data.data, meta: res.data.meta };
};

export const exportTransactions = async (filter: any = {}, setLoading: Function) =>  {
  try {
    setLoading(true);

    // Make a GET request to the backend endpoint
    const response = await apiReq.get("/platform/transactions/export", {
      responseType: "blob",
      headers: { "Content-Type": "text/csv" },
      params: filter,
    });

    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: "text/csv" });

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv");
    document.body.appendChild(link);
    link.click();

    // Clean up
    if(link.parentNode) link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading CSV:", error);
    alert("Failed to download transactions. Please try again.");
  }finally{
    setLoading(false)
  }
};


