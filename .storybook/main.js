module.exports = {
	stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'@storybook/addon-a11y',
		'storybook-addon-next-router'
	],
	framework: '@storybook/react',
	core: {
		builder: '@storybook/builder-webpack5'
	},
	typescript: {
		check: false,
		checkOptions: {},
		reactDocgen: 'react-docgen-typescript',
		reactDocgenTypescriptOptions: {
			shouldExtractLiteralValuesFromEnum: true,
			propFilter: prop =>
				prop.parent ? !/node_modules/.test(prop.parent.fileName) : true
		}
	},
	// This is needed avoid an error with webpack. See https://issuehunt.io/r/storybookjs/storybook/issues/13795
	managerWebpack: (config, options) => {
		options.cache.set = () => Promise.resolve();
		return config;
	},
	webpackFinal: async config => {
		config.resolve.alias['jsonwebtoken'] = require.resolve(
			'../__mocks__/jsonWebTokenMock.js'
		);
		return config;
	}
};
