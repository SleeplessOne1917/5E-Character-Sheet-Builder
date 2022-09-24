import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Formik } from 'formik';
import { Provider } from 'react-redux';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import {
	addSummon,
	deleteSummon,
	setSummonProperties
} from '../../../../redux/features/editingSpell';
import { getTestStore } from '../../../../redux/store';
import { DeepError, DeepTouched } from '../../../../types/helpers';
import { Summon } from '../../../../types/summon';
import spellSchema from '../../../../yup-schemas/spellSchema';
import SummonFormFields from './SummonFormFields';

export default {
	title: 'Components/Create/Summon/SummonFormFields',
	component: SummonFormFields,
	args: {
		actions: {
			add: addSummon,
			set: setSummonProperties,
			delete: deleteSummon
		}
	},
	decorators: [
		Story => (
			<Provider store={getTestStore()}>
				<Story />
			</Provider>
		)
	]
} as ComponentMeta<typeof SummonFormFields>;

const Template: ComponentStory<typeof SummonFormFields> = args => {
	const editingSpell = useAppSelector(state => state.editingSpell);

	return (
		<Formik
			validationSchema={spellSchema}
			initialValues={editingSpell}
			onSubmit={() => {}}
		>
			{({
				values,
				touched,
				errors,
				setFieldError,
				setFieldTouched,
				setFieldValue
			}) => (
				<SummonFormFields
					{...args}
					summons={values.summons}
					touched={touched.summons as never as DeepTouched<Summon>[]}
					errors={errors.summons as never as DeepError<Summon>[]}
					setFieldError={setFieldError}
					setFieldTouched={setFieldTouched}
					setFieldValue={setFieldValue}
				/>
			)}
		</Formik>
	);
};

export const Default = Template.bind({});
