import { ComponentMeta, ComponentStory } from '@storybook/react';

import Footer from './Footer';

const FooterSb = {
	title: 'Components/Footer',
	component: Footer
} as ComponentMeta<typeof Footer>;

export default FooterSb;

export const Default: ComponentStory<typeof Footer> = () => <Footer />;
