import { ComponentMeta, ComponentStory } from '@storybook/react';

import { Formik } from 'formik';
import { Provider } from 'react-redux';
import SummonActions from './SummonActions';
import { createSpellSlice } from '../../../../redux/features/editingSpell';
import { getTestStore } from '../../../../redux/store';

export default {
	title: 'Components/Forms/Summons/SummonActions',
	component: SummonActions,
	args: {
		parentBaseStr: 'summons.0',
		onSetSummonProperties: () => {}
	},
	decorators: [
		Story => (
			<Provider
				store={getTestStore({
					editingSpell: createSpellSlice({
						summons: [{ actions: [{ name: '', description: '' }] }]
					}).reducer
				})}
			>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof SummonActions>;

const Template: ComponentStory<typeof SummonActions> = args => (
	<Formik
		initialValues={{
			summons: [{ actions: [{ name: '', description: '' }] }]
		}}
		onSubmit={() => {}}
	>
		{({ values }) => <SummonActions {...args} summon={values.summons[0]} />}
	</Formik>
);

export const Actions = Template.bind({});
Actions.args = {
	id: 'actions',
	labelPlural: 'Actions',
	labelSingular: 'Action'
};

export const SpecialAbilities = Template.bind({});
SpecialAbilities.args = {
	id: 'specialAbilities',
	labelPlural: 'Special Abilities',
	labelSingular: 'Special Ability'
};

export const BonusActions = Template.bind({});
BonusActions.args = {
	id: 'bonusActions',
	labelPlural: 'Bonus Actions',
	labelSingular: 'Bonus Action'
};

export const Reactions = Template.bind({});
Reactions.args = {
	id: 'reactions',
	labelPlural: 'Reactions',
	labelSingular: 'Reactions'
};
