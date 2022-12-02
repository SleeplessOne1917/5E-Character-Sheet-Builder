'use client';

import ArrowLink from '../../../components/ArrowLink/ArrowLink';
import Button from '../../../components/Button/Button';
import MainContent from '../../../components/MainContent/MainContent';
import classes from './MyStuffGeneric.module.css';

type MyStuffGenericType = {
	currentPage: number;
	numberOfPages: number;
	handleNextClick: () => void;
	handlePreviousClick: () => void;
	title: string;
	items?: JSX.Element[];
};

const MyStuffGeneric = ({
	currentPage,
	numberOfPages,
	handleNextClick,
	handlePreviousClick,
	title,
	items
}: MyStuffGenericType) => (
	<MainContent>
		<h1>My {title}</h1>
		{(!items || items.length === 0) && (
			<div className={classes['no-items-container']}>
				<p>
					You haven&apos;t created anything yet. Whenever you create anything,
					it will show up here.
				</p>
				<ArrowLink href="/create/spell" text="Create Spell" />
			</div>
		)}
		{items && items.length > 0 && (
			<div className={classes.content}>
				{numberOfPages > 1 && (
					<div className={classes['page-count']}>
						Page {currentPage}/{numberOfPages}
					</div>
				)}
				{items}
				<div className={classes['next-prev-buttons']}>
					{currentPage > 1 && (
						<Button
							style={{ alignSelf: 'flex-start' }}
							onClick={handlePreviousClick}
						>
							Previous Page
						</Button>
					)}
					{currentPage < numberOfPages && (
						<Button style={{ alignSelf: 'flex-end' }} onClick={handleNextClick}>
							Next Page
						</Button>
					)}
				</div>
			</div>
		)}
	</MainContent>
);

export default MyStuffGeneric;
