'use client';

import styles from './Subclass.module.css';

type SubclassProps = {
	shouldUseReduxStore: boolean;
	clickedSubmit: boolean;
};

const Subclass = ({ shouldUseReduxStore, clickedSubmit }: SubclassProps) => {
	return (
		<section className={styles.container}>
			<h2>Subclass Info</h2>
		</section>
	);
};

export default Subclass;
