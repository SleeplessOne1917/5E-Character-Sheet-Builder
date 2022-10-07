import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import GET_SPELLS from '../../../graphql/queries/CharacterSheetBuilder/spells/getSpells';
import LoadingPageContent from '../../../components/LoadingPageContent/LoadingPageContent';
import MainContent from '../../../components/MainContent/MainContent';
import Preview from '../../../components/MyStuff/Preview/Preview';
import { Spell } from '../../../types/characterSheetBuilderAPI';
import classes from './MyStuffIndex.module.css';
import { useQuery } from 'urql';

type MyStuffIndexProps = {
	loading: boolean;
};

const MyStuffIndex = ({ loading }: MyStuffIndexProps) => {
	const [spellsResult, _] = useQuery<{ spells: Spell[] }>({
		query: GET_SPELLS,
		variables: { limit: 5 }
	});

	const isLoading = loading || spellsResult.fetching;

	return (
		<>
			{isLoading && <LoadingPageContent />}
			{!isLoading && (
				<MainContent testId="my-stuff-index">
					<h1>My Stuff</h1>
					{(!spellsResult.data || spellsResult.data.spells.length === 0) && (
						<div className={classes['no-items-container']}>
							<p>
								You haven&apos;t created anything yet. Whenever you create
								anything, it will show up here.
							</p>
							<ArrowLink href="/create" text="Create Something" />
						</div>
					)}
					<div className={classes.previews}>
						<Preview
							path="spells"
							title="Spells"
							items={
								spellsResult.data?.spells.map(spell => (
									<div key={spell.id} className={classes.item}>
										<div className={classes['spell-info']}>
											<svg className={classes['school-icon']}>
												<use xlinkHref={`/Icons.svg#${spell.school.id}`} />
											</svg>
											{spell.name}
										</div>
									</div>
								)) ?? []
							}
						/>
					</div>
				</MainContent>
			)}
		</>
	);
};

export default MyStuffIndex;
