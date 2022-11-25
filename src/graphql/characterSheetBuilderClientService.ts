import { Spell, SpellItem } from '../types/characterSheetBuilderAPI';
import { TypedDocumentNode, createClient } from 'urql/core';

import { DocumentNode } from 'graphql';
import GET_SPELL from './queries/CharacterSheetBuilder/spells/getSpell';
import GET_SPELLS from './queries/CharacterSheetBuilder/spells/getSpells';

const client = createClient({
	url: `/api/graphql`
});

const query = async <
	TResponse,
	TVariables extends { [prop: string]: any } = Record<string, unknown>
>(
	queryString: string | DocumentNode | TypedDocumentNode,
	variables?: TVariables
) => await client.query<TResponse>(queryString, variables).toPromise();

export const getSpells = async () =>
	await query<{ spells: SpellItem[] }>(GET_SPELLS);

export const getSpellsByClass = async (klass: string) =>
	await query<{ spells: SpellItem[] }, { class: string }>(GET_SPELLS, {
		class: klass
	});

export const getLimitedSpells = async (limit: number) =>
	await query<{ spells: SpellItem[] }, { limit: number }>(GET_SPELLS, {
		limit
	});

export const getSpell = async (id: string) =>
	await query<{ spell: Spell }, { id: string }>(GET_SPELL, { id });

export const getViewer = async () =>
	(await query<{ viewer: string }>(GET_SPELL)).data?.viewer;
