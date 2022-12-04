import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DeepError, DeepPartial, DeepTouched } from '../../../../types/helpers';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';

import { Formik } from 'formik';
import { Provider } from 'react-redux';
import { Summon } from '../../../../types/summon';
import SummonActions from './SummonActions';
import getEditingSpellMock from '../../../../mock/editingSpellMock';
import { getTestStore } from '../../../../redux/store';
import { setSummonProperties } from '../../../../redux/features/editingSpell';
import spellSchema from '../../../../yup-schemas/spellSchema';
import { useCallback } from 'react';

export default {
	title: 'Components/Create/Summon/SummonActions',
	component: SummonActions,
	args: {
		index: 0
	},
	decorators: [
		Story => (
			<Provider
				store={getTestStore({
					editingSpell: getEditingSpellMock({
						summons: [{ actions: [{ name: '', description: '' }] }]
					})
				})}
			>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof SummonActions>;

const Template: ComponentStory<typeof SummonActions> = args => {
	const editingSpell = useAppSelector(state => state.editingSpell);
	const dispatch = useAppDispatch();
	const handleSetSummonProperties = useCallback(
		(index: number, overrideProps: DeepPartial<Summon>) => {
			dispatch(setSummonProperties({ index, overrideProps }));
		},
		[dispatch]
	);

	return (
		<Formik
			validationSchema={spellSchema}
			initialValues={editingSpell}
			onSubmit={() => {}}
		>
			{({ touched, errors, setFieldValue, setFieldTouched, values }) => (
				<SummonActions
					{...args}
					touched={touched.summons as never as DeepTouched<Summon>[]}
					errors={errors.summons as never as DeepError<Summon>[]}
					setFieldTouched={setFieldTouched}
					setFieldValue={setFieldValue}
					handleSetSummonProperties={(index, overrideProps) =>
						handleSetSummonProperties(
							index,
							overrideProps as DeepPartial<Summon>
						)
					}
					summon={(values.summons as DeepPartial<Summon>[])[0]}
				/>
			)}
		</Formik>
	);
};

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
