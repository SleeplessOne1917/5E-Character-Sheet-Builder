'use client';

import { EditingSubraceState } from '../../../../redux/features/editingSubrace';
import IncludeOmitItem from './IncludeOmitItem/IncludeOmitItem';
import { Race } from '../../../../types/characterSheetBuilderAPI';
import classes from './IncludeOmitTraits.module.css';
import { useFormikContext } from 'formik';
import { useMemo } from 'react';

type IncludeOmitTraitsProps = {
	shouldUseReduxStore: boolean;
	race: Pick<Race, 'traits' | 'name'>;
};

const IncludeOmitTraits = ({
	shouldUseReduxStore,
	race
}: IncludeOmitTraitsProps) => {
	const { values } = useFormikContext<EditingSubraceState>();

	const [includedTraits, omittedTraits] = useMemo(() => {
		const included = [];
		const omitted = [];

		for (const trait of race.traits ?? []) {
			if (values.omittedRaceTraits?.includes(trait.uuid)) {
				omitted.push(trait);
			} else {
				included.push(trait);
			}
		}

		return [included, omitted];
	}, [race.traits, values.omittedRaceTraits]);

	return (
		<div className={classes.container}>
			<div className={classes.title}>{race.name} Traits</div>
			<p>
				If you want to omit any traits from {race.name}, you can do that here.
			</p>
			<div className={classes['include-omit-container']}>
				<div className={classes.include}>
					<div className={classes['include-omit-title']}>Included</div>
					{includedTraits.map(trait => (
						<IncludeOmitItem
							key={trait.uuid}
							mode="omit"
							shouldUseReduxStore={shouldUseReduxStore}
							trait={trait}
						/>
					))}
				</div>
				<div className={classes.omit}>
					<div className={classes['include-omit-title']}>Omitted</div>
					{omittedTraits.map(trait => (
						<IncludeOmitItem
							key={trait.uuid}
							mode="include"
							shouldUseReduxStore={shouldUseReduxStore}
							trait={trait}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default IncludeOmitTraits;
