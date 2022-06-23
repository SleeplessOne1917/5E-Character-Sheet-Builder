import { A, Box, Email, Item, Span } from 'react-html-email';

import { CSSProperties } from 'react';

const emailHeadCSS = `
  body {
    background-color: #fffebd;
  }
`.trim();

type ForgotUsernameOrPasswordProps = {
	subject: string;
	type: 'username' | 'password';
	link: string;
};

const backgroundStyle: CSSProperties = {
	WebkitBoxShadow: '6px 6px 40px 3px rgba(140, 152, 164, 0.2)',
	backgroundColor: '#fffee9',
	borderRadius: 7,
	boxShadow: '6px 6px 40px 3px rgba(140, 152, 164, 0.2)',
	margin: '0 auto',
	width: '100%',
	padding: '0 32px'
};

const buttonStyle: CSSProperties = {
	backgroundColor: '#930c10',
	borderRadius: 4,
	cursor: 'pointer',
	height: 48,
	textAlign: 'center',
	textDecoration: 'none'
};

const linkStyle: CSSProperties = {
	color: '#fffee9',
	textDecoration: 'none',
	display: 'block'
};

const ForgotUsernameOrPassword = ({
	subject,
	type,
	link
}: ForgotUsernameOrPasswordProps) => (
	<Box align="center" style={{ width: '100%' }}>
		<Email headCSS={emailHeadCSS} title={subject}>
			<Item style={{ height: 40 }} />
			<Box style={backgroundStyle}>
				<Item style={{ height: 40 }} />
				<Item>
					<Span fontSize={22} color="#290000" fontWeight="bold">
						{subject}
					</Span>
				</Item>
				<Item style={{ height: 20 }} />
				<Item style={{ color: '#290000', fontSize: 16 }}>
					Everyone forgets things sometimes. Click the link to{' '}
					{type === 'username' ? 'get your username' : 'reset your password'}.
					Your link will expire in an hour.
				</Item>
				<Item style={{ height: 20 }} />
				<Item style={buttonStyle}>
					<A href={link} style={linkStyle}>
						{type === 'password' ? 'Reset your password' : 'Get username'}
					</A>
				</Item>
				<Item style={{ height: 40 }} />
			</Box>
		</Email>
	</Box>
);

export default ForgotUsernameOrPassword;
