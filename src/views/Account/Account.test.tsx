import { render, screen } from '@testing-library/react';

import Account from './Account';
import { Provider } from 'react-redux';
import { getTestStore } from '../../redux/store';

it('renders correctly', () => {
	render(
		<Provider store={getTestStore()}>
			<Account />
		</Provider>
	);

	expect(screen.getByTestId('account')).toMatchSnapshot();
});
