import { Client, TypedDocumentNode, createClient } from 'urql/core';
import { Spell, SpellItem } from '../types/characterSheetBuilderAPI';

import { DocumentNode } from 'graphql';
import GET_SPELL from './queries/CharacterSheetBuilder/spells/getSpell';
import GET_SPELLS from './queries/CharacterSheetBuilder/spells/getSpells';

const serverClient = createClient({
	url: `/api/graphql`
});

const query = async <
	TResponse,
	TVariables extends { [prop: string]: any } = Record<string, unknown>
>(
	queryString: string | DocumentNode | TypedDocumentNode,
	variables?: TVariables,
	client?: Client
) =>
	await (client ?? serverClient)
		.query<TResponse>(queryString, variables)
		.toPromise();

export const getSpells = async (client?: Client) =>
	await query<{ spells: SpellItem[] }>(GET_SPELLS, undefined, client);

export const getSpellsByClass = async (klass: string, client?: Client) =>
	await query<{ spells: SpellItem[] }, { class: string }>(
		GET_SPELLS,
		{
			class: klass
		},
		client
	);

export const getLimitedSpells = async (limit: number, client?: Client) =>
	await query<{ spells: SpellItem[] }, { limit: number }>(
		GET_SPELLS,
		{
			limit
		},
		client
	);

export const getSpell = async (id: string, client?: Client) =>
	await query<{ spell: Spell }, { id: string }>(GET_SPELL, { id }, client);
