import {
	accessTokenKey,
	refreshTokenKey,
	tokenExpired
} from '../../../constants/generalConstants';
import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery } from 'urql';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import GET_SPELLS from '../../../graphql/queries/CharacterSheetBuilder/spells/getSpells';
import GET_TOKEN from '../../../graphql/mutations/user/token';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import Preview from '../../../components/MyStuff/Preview/Preview';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import SpellItem from '../../../components/MyStuff/SpellItem/SpellItem';
import SpellMoreInformationModal from '../../../components/SpellMoreInfoModal/SpellMoreInformationModal';
import classes from './MyStuffIndex.module.css';
import useLogout from '../../../hooks/useLogout';

type MyStuffIndexProps = {
	loading: boolean;
};

const MyStuffIndex = ({ loading }: MyStuffIndexProps) => {
	const [spellsResult, refetechSpells] = useQuery<{
		spells: { spells: Spell[]; count: number };
	}>({
		query: GET_SPELLS,
		variables: { limit: 5 }
	});
	const [_, getToken] = useMutation<{ token: string }>(GET_TOKEN);
	const logout = useLogout();

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

	const [selectedSpell, setSelectedSpell] = useState<Spell>();

	const isLoading = loading || spellsResult.fetching;

	const handleSpellMoreInfoClick = useCallback((spell: Spell) => {
		setSelectedSpell(spell);
	}, []);

	const handleSpellMoreInfoClose = useCallback(() => {
		setSelectedSpell(undefined);
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
												<SpellItem
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
						show={!!selectedSpell}
						spell={selectedSpell}
						onClose={handleSpellMoreInfoClose}
					/>
				</>
			)}
		</>
	);
};

export default MyStuffIndex;
