import { Session } from 'next-auth';
import { headers } from 'next/headers';

export async function getSession(): Promise<Session | null> {
	const response = await fetch(`${process.env.ORIGIN}/api/auth/session`, {
		headers: { cookie: headers().get('cookie') ?? '' }
	});

	if (!response?.ok) {
		return null;
	}

	const session = await response.json();
	return Object.keys(session).length > 0 ? session : null;
}
