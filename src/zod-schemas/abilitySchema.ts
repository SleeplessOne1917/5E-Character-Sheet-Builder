import { z } from 'zod';
import makeObjectLiteralSchema from './utils/makeObjectLiteralSchema';

export default z.union(
	[
		makeObjectLiteralSchema('str', 'Strength'),
		makeObjectLiteralSchema('dex', 'Dexterity'),
		makeObjectLiteralSchema('con', 'Constitution'),
		makeObjectLiteralSchema('int', 'Intelligence'),
		makeObjectLiteralSchema('wis', 'Wisdom'),
		makeObjectLiteralSchema('cha', 'Charisma')
	],
	{ required_error: 'Ability score is required' }
);
