import { Spell, SpellItem } from '../../../types/characterSheetBuilderAPI';
import {
	accessTokenKey,
	refreshTokenKey,
	tokenExpired
} from '../../../constants/generalConstants';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import GET_SPELL from '../../../graphql/queries/CharacterSheetBuilder/spells/getSpell';
import GET_SPELLS from '../../../graphql/queries/CharacterSheetBuilder/spells/getSpells';
import GET_TOKEN from '../../../graphql/mutations/user/token';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import Preview from '../../../components/MyStuff/Preview/Preview';
import SpellItemDisplay from '../../../components/MyStuff/SpellItem/SpellItemDisplay';
import SpellMoreInformationModal from '../../../components/Spells/SpellMoreInfoModal/SpellMoreInformationModal';
import classes from './MyStuffIndex.module.css';
import useLogout from '../../../hooks/useLogout';

type MyStuffIndexProps = {
	loading: boolean;
};

const MyStuffIndex = ({ loading }: MyStuffIndexProps) => {
	const [spellId, setSpellId] = useState<string>();
	const [selectedSpell, setSelectedSpell] = useState<Spell>();

	const [spellsResult, refetechSpells] = useQuery<{
		spells: { spells: Spell[]; count: number };
	}>({
		query: GET_SPELLS,
		variables: { limit: 5 }
	});
	const [spellResult, refetechSpell] = useQuery<{
		spell: Spell;
	}>({
		query: GET_SPELL,
		variables: { id: spellId },
		pause: !spellId
	});
	const [_, getToken] = useMutation<{ token: string }>(GET_TOKEN);
	const logout = useLogout();

	useEffect(() => {
		if (spellId && !(spellResult.fetching || spellResult.error)) {
			setSelectedSpell(spellResult.data?.spell);
		}
	}, [spellId, spellResult.fetching, spellResult.error, spellResult.data]);

	useEffect(() => {
		if (spellsResult.error) {
			const refreshToken = localStorage.getItem(refreshTokenKey);
			if (refreshToken && spellsResult.error.message == tokenExpired) {
				getToken({ refreshToken }).then(result => {
					if (result.error || !result.data) {
						logout();
						return;
					}

					localStorage.setItem(accessTokenKey, result.data.token);

					if (spellsResult.error) {
						refetechSpells();
					}
				});
			}
		}
	}, [getToken, logout, refetechSpells, spellsResult.error]);

	const isLoading = loading || spellsResult.fetching;

	const handleSpellMoreInfoClick = useCallback(({ id }: SpellItem) => {
		console.log(id);
		setSpellId(id);
	}, []);

	const handleSpellMoreInfoClose = useCallback(() => {
		setSelectedSpell(undefined);
		setSpellId(undefined);
	}, []);

	return (
		<>
			{isLoading && <LoadingPageContent />}
			{!isLoading && (
				<>
					<MainContent testId="my-stuff-index">
						<h1>My Stuff</h1>
						{(!spellsResult.data ||
							spellsResult.data.spells.spells.length === 0) && (
							<div className={classes['no-items-container']}>
								<p>
									You haven&apos;t created anything yet. Whenever you create
									anything, it will show up here.
								</p>
								<ArrowLink href="/create" text="Create Something" />
							</div>
						)}
						<div className={classes.previews}>
							{spellsResult.data &&
								spellsResult.data.spells.spells.length > 0 && (
									<Preview
										path="spells"
										title="Spells"
										items={
											spellsResult.data?.spells.spells.map(spell => (
												<SpellItemDisplay
													spell={spell}
													key={spell.id}
													onMoreInfoClick={handleSpellMoreInfoClick}
												/>
											)) ?? []
										}
									/>
								)}
						</div>
					</MainContent>
					<SpellMoreInformationModal
						show={!!spellId}
						spell={selectedSpell}
						error={spellResult.error?.message}
						loading={spellResult.fetching}
						onClose={handleSpellMoreInfoClose}
						shouldShowEditAndClasses
					/>
				</>
			)}
		</>
	);
};

export default MyStuffIndex;
