"use client";
import axios from "axios";

const setAuthTokenHeader = () => {
	axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL
	axios.defaults.headers.common["Content-Type"] = "application/json";
	axios.defaults.headers.common.Accept = "application/json";

	if (localStorage.getItem(process.env.NEXT_PUBLIC_API_AUTH_TOKEN!)) {
		axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(
			process.env.NEXT_PUBLIC_API_AUTH_TOKEN!
		)}`;	
	} else localStorage.removeItem(process.env.NEXT_PUBLIC_API_AUTH_TOKEN!);
};

export default setAuthTokenHeader;
