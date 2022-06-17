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

const ForgotUsernameOrPassword = ({
	subject,
	type
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
				<Item style={{ height: 40 }} />
				<Item style={buttonStyle}>
					<A href="#">
						{type === 'password'
							? 'Reset your password'
							: 'Get username reminder'}
					</A>
				</Item>
				<Item style={{ height: 40 }} />
			</Box>
		</Email>
	</Box>
);

export default ForgotUsernameOrPassword;
