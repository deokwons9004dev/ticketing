import axios from "axios";

export default ({ req }) => {
	
	if (typeof window === 'undefined') {
		// we are in server.
		return axios.create({
			baseURL: 'http://qlvm.xyz/',
			headers: req.headers
		});
	}
	else {
		// we are in the browser.
		return axios.create({
			baseURL: '/'
		});
	}
	
};