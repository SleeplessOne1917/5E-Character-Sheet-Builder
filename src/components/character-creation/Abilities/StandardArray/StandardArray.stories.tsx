import { ComponentMeta, ComponentStory } from '@storybook/react';
import MockStore, { mockAbilities } from '../MockAbilitiesStore';
import StandardArray, { StandardArrayProps } from './StandardArray';

const StandardArraySb = {
	title: 'Components/StandardArray',
	component: StandardArray,
	args: {
		abilities: mockAbilities
	}
} as ComponentMeta<typeof StandardArray>;

export default StandardArraySb;

const Template: ComponentStory<typeof StandardArray> = (
	args: StandardArrayProps
) => <StandardArray {...args} />;

const defaultOverride = {
	str: {},
	dex: {},
	con: {},
	int: {},
	cha: {},
	wis: {}
};

export const NoneSelected = Template.bind({});
NoneSelected.decorators = [
	story => <MockStore overrideValues={defaultOverride}>{story()}</MockStore>
];

export const HalfSelected = Template.bind({});
HalfSelected.decorators = [
	story => (
		<MockStore
			overrideValues={{
				...defaultOverride,
				str: { base: 8 },
				int: { base: 15 },
				con: { base: 14 }
			}}
		>
			{story()}
		</MockStore>
	)
];

export const AllSelected = Template.bind({});
AllSelected.decorators = [
	story => (
		<MockStore
			overrideValues={{
				str: { base: 8 },
				dex: { base: 10 },
				con: { base: 12 },
				int: { base: 13 },
				cha: { base: 14 },
				wis: { base: 15 }
			}}
		>
			{story()}
		</MockStore>
	)
];
