const Query = {
	viewer: async (parent, args, { email }) => email
};

export default Query;
