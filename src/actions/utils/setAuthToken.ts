import axios from "axios";

const setAuthTokenHeader = () => {
	axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
	axios.defaults.headers.common["Content-Type"] = "application/json";
	axios.defaults.headers.common.Accept = "application/json";

	if (localStorage.getItem("nerasol-token")) {
		axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
			"nerasol-token"
		)}`;	
	} else localStorage.removeItem("nerasol-token");
};
export default setAuthTokenHeader;
