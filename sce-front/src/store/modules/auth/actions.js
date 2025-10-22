import axios from "@/misc/axios.js";

export default {

	async logout(context) {
		context.commit("destroySession");
		
		try {
			await axios.delete("/session");
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.error
			)
				console.error(error.response.data.error);
			else console.error(error.message);
		}			
	},

	async loginGoogle(context) {
		let response = null;
		try {
			response = await axios.post("/session");
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.error
			)
				console.error(error.response.data.error);
			else console.error(error.message);
		}

		if (response.data.url) {
			context.commit("setGoogleLoginUrl", {
				googleLoginUrl: response.data.url,
			});
		}
	},

	async loginAdmin(_context, payload) {
		let response = null;
		try {
			response = await axios.post("/admin/session", payload);
		} catch (error) {
			if (
				error.response &&
				error.response.data &&
				error.response.data.error
			)
				console.error(error.response.data.error);
			else console.error(error.message);
		}

		if (response.status === 200)
			await this.dispatch('startSession');
	},

	async startSession(context) {

		let userInfoResponse = null;
		
		try {
			userInfoResponse = await axios.get("/usuario/info");
		} catch (error) {
			if (
				error.userInfoResponse &&
				error.userInfoResponse.data &&
				error.userInfoResponse.data.error
			)
				console.error(error.userInfoResponse.data.error);
			else console.error(error.message);
		}

		if (userInfoResponse && userInfoResponse.data) {
			
			const { uid, email, nome, tipo, campus } = userInfoResponse.data;
			context.commit("setSession", {
				uid,
				email,
				nome,
				tipo,
				campus,
			});
		}
	},

};
