import { ComponentMeta, ComponentStory } from '@storybook/react';
import Race, { mockRaces, mockSubraces } from './Race';

import { Operation } from 'urql';
import { getQueryName } from '../../../graphql/utils/queryUtils';

export default {
	title: 'Views/Race',
	component: Race,
	args: {
		races: mockRaces,
		subraces: mockSubraces
	}
} as ComponentMeta<typeof Race>;

const Template: ComponentStory<typeof Race> = args => <Race {...args} />;

export const Default = Template.bind({});
// Default.parameters = {
// 	urql: (op: Operation) => {
// 		if (getQueryName(op.query) === 'GetRace') {
// 			const { index }: { index: string } = op.variables.filter;
// 			const [first, ...rest] = index.replace('-', ' ');
// 			const name = first.toUpperCase() + rest.join('').toLowerCase();

// 			return {
// 				data: {
// 					index,
// 					name,
// 					size: 'Medium',
// 					age: 'This race matures around x years and can live for y years',
// 					size_description: 'This race is x feet tall and weighs y pounds',
// 					alignment: 'This race usually has x alignment',
// 					language_desc: 'This race speaks and writes x language(s)',
// 					ability_bonuses: [{ ability_score: { index: 'str' }, bonus: 2 }],
// 					traits: [
// 						{
// 							index: 'trait1',
// 							name: 'Trait 1',
// 							description: ['blah blah blah blah']
// 						},
// 						{
// 							index: 'trait2',
// 							name: 'Trait 2',
// 							description: ['blah blah blah blah']
// 						},
// 						{
// 							index: 'trait3',
// 							name: 'Trait 3',
// 							description: ['blah blah blah blah']
// 						}
// 					]
// 				}
// 			};
// 		} else if (getQueryName(op.query) === 'GetSubrace') {
// 			const { index }: { index: string } = op.variables.filter;
// 			const [first, ...rest] = index.replace('-', ' ');
// 			const name = first.toUpperCase() + rest.join('').toLowerCase();

// 			return {
// 				data: {
// 					index,
// 					name,
// 					desc: 'blah blah blah'
// 				}
// 			};
// 		} else {
// 			return { data: {} };
// 		}
// 	}
// };
