import { z } from 'zod';
import makeObjectLiteralSchema from './utils/makeObjectLiteralSchema';

export default z.union([
	makeObjectLiteralSchema('infernal', 'Infernal'),
	makeObjectLiteralSchema('goblin', 'Goblin'),
	makeObjectLiteralSchema('primordial', 'Primordial'),
	makeObjectLiteralSchema('sylvan', 'Sylvan'),
	makeObjectLiteralSchema('common', 'Common'),
	makeObjectLiteralSchema('halfling', 'Halfling'),
	makeObjectLiteralSchema('celestial', 'Celestial'),
	makeObjectLiteralSchema('draconic', 'Draconic'),
	makeObjectLiteralSchema('dwarvish', 'Dwarvish'),
	makeObjectLiteralSchema('elvish', 'Elvish'),
	makeObjectLiteralSchema('gnomish', 'Gnomish'),
	makeObjectLiteralSchema('orc', 'Orc'),
	makeObjectLiteralSchema('abyssal', 'Abyssal'),
	makeObjectLiteralSchema('deep-speech', 'Deep Speech'),
	makeObjectLiteralSchema('giant', 'Giant'),
	makeObjectLiteralSchema('undercommon', 'Undercommon')
]);
