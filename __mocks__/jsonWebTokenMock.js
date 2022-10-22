const jwt = {
	decode: () => {
		exp: Date.now() + 1000 * 60 * 60;
	}
};

export default jwt;
