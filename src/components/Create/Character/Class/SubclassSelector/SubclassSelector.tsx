'use client';

import Button from '../../../../Button/Button';
import Descriptor from '../../Descriptor/Descriptor';
import { ReactNode } from 'react';
import { SpellItem } from '../../../../../types/characterSheetBuilderAPI';
import { SrdSubclassItem } from '../../../../../types/srd';
import { getOrdinal } from '../../../../../services/ordinalService';
import { mapSpellItem } from '../../../../../services/spellsService';
import styles from './SubclassSelector.module.css';

type SubclassSelectorProps = {
	subclass: SrdSubclassItem;
	onSelect: () => void;
	onDeselect: () => void;
	selected?: boolean;
	klassName: string;
};

const SubclassSelector = ({
	subclass,
	onSelect,
	onDeselect,
	selected = false,
	klassName
}: SubclassSelectorProps) => {
	let spellsComponent: ReactNode;

	if (subclass.spells) {
		if (
			subclass.spells.some(spell =>
				spell.prerequisites.some(prereq => prereq.name)
			)
		) {
			const spellsByFeature = subclass.spells.reduce<
				Map<string, Map<number, SpellItem[]>>
			>((acc, cur) => {
				const featureName = cur.prerequisites.find(p => p.name)?.name as string;
				const level = cur.prerequisites.find(p => p.level)?.level as number;

				if (!acc.get(featureName)) {
					acc.set(featureName, new Map<number, SpellItem[]>());
				}

				if (!acc.get(featureName)?.get(level)) {
					acc.get(featureName)?.set(level, []);
				}

				acc.get(featureName)?.get(level)?.push(mapSpellItem(cur.spell));

				return acc;
			}, new Map<string, Map<number, SpellItem[]>>());

			const tables: ReactNode[] = [];

			for (const [featureName, spellsByLevel] of spellsByFeature) {
				const rows: ReactNode[] = [];

				for (const [i, level] of Array.from(spellsByLevel.keys())
					.sort((a, b) => a - b)
					.entries()) {
					rows.push(
						<tr
							key={level}
							className={i % 2 !== 0 ? styles['even-row'] : styles['odd-row']}
						>
							<td>{getOrdinal(level)}</td>
							<td className={styles.italic}>
								{spellsByLevel
									.get(level)
									?.map(({ name }) => name)
									?.join(', ')}
							</td>
						</tr>
					);
				}

				tables.push(
					<>
						<h4>{featureName.replace(/.*:\s*/, '')}</h4>
						<table>
							<thead>
								<tr>
									<th>{klassName} Level</th>
									<th>Spells</th>
								</tr>
							</thead>
							<tbody>{rows}</tbody>
						</table>
					</>
				);
			}

			spellsComponent = <>{tables}</>;
		} else {
			const spellsByLevel = subclass.spells.reduce<Map<number, SpellItem[]>>(
				(acc, cur) => {
					const level = cur.prerequisites.find(p => p.level)?.level as number;

					if (!acc.get(level)) {
						acc.set(level, []);
					}

					acc.get(level)?.push(mapSpellItem(cur.spell));

					return acc;
				},
				new Map<number, SpellItem[]>()
			);

			const rows: ReactNode[] = [];

			for (const [i, level] of Array.from(spellsByLevel.keys())
				.sort((a, b) => a - b)
				.entries()) {
				rows.push(
					<tr
						key={level}
						className={i % 2 !== 0 ? styles['even-row'] : styles['odd-row']}
					>
						<td>{getOrdinal(level)}</td>
						<td className={styles.italic}>
							{spellsByLevel
								.get(level)
								?.map(({ name }) => name)
								.join(', ')}
						</td>
					</tr>
				);
			}

			spellsComponent = (
				<table>
					<thead>
						<tr>
							<th>{klassName} Level</th>
							<th>Spells</th>
						</tr>
					</thead>
					<tbody>{rows}</tbody>
				</table>
			);
		}
	}

	return (
		<div
			key={subclass.index}
			className={`${styles.subclass}${selected ? ` ${styles.selected}` : ''}`}
			data-testid="subclass-selector"
		>
			<h3 className={styles['subclass-heading']}>{subclass.name}</h3>
			{subclass.desc.map((desc, i) => (
				<p key={i} className={styles['subclass-description']}>
					{desc}
				</p>
			))}
			{spellsComponent}
			{[...subclass.subclass_levels]
				.sort((a, b) => a.level - b.level)
				.flatMap(level => level.features)
				.map(feature => (
					<Descriptor
						key={feature.index}
						title={feature.name}
						description={feature.desc}
					/>
				))}
			{selected ? (
				<Button onClick={onDeselect}>Deselect</Button>
			) : (
				<Button positive onClick={onSelect}>
					Select
				</Button>
			)}
		</div>
	);
};

export default SubclassSelector;
