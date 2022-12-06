import { ComponentMeta, ComponentStory } from '@storybook/react';
import {
	deleteSummon,
	setSummonProperties
} from '../../../../redux/features/editingSpell';

import { AbilityItem } from '../../../../types/srd';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import Summon from './Summon';
import { getTestStore } from '../../../../redux/store';

const abilities: AbilityItem[] = [
	{ index: 'str', full_name: 'Strength' },
	{ index: 'dex', full_name: 'Dexterity' },
	{ index: 'con', full_name: 'Constitution' },
	{ index: 'cha', full_name: 'Charisma' },
	{ index: 'int', full_name: 'Intelligence' },
	{ index: 'wis', full_name: 'Wisdom' }
];

export default {
	title: 'Components/Forms/Summons/Summon',
	component: Summon,
	args: {
		abilities,
		index: 0,
		reduxDelete: deleteSummon,
		reduxSet: setSummonProperties
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof Summon>;

const Template: ComponentStory<typeof Summon> = args => (
	<Formik
		initialValues={{ summons: [{ actions: [{ name: '', description: '' }] }] }}
		onSubmit={() => {}}
	>
		{({ values }) => <Summon {...args} summon={values.summons[0]} />}
	</Formik>
);

export const Default = Template.bind({});
