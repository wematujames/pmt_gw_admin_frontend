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

export const exportTransactions = async (_filter: any = {}) =>  {
  setAuthTokenHeader()
  
  try {
    // Make a GET request to the backend endpoint
    const response = await axios.get("/platform/transactions/export", {
      responseType: "blob", // Important: ensures the response is treated as binary data (Blob)
      headers: { "Content-Type": "text/csv" },
      params: _filter
    });

    // Create a Blob from the response data
    const blob = new Blob([response.data], { type: "text/csv" });

    // Create a download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "transactions.csv"); // Filename
    document.body.appendChild(link);
    link.click();

    // Clean up
    if(link.parentNode) link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.log(error)
    console.error("Error downloading CSV:", error);
    alert("Failed to download transactions. Please try again.");
  }
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
