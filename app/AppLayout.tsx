'use client';

import {
	PropsWithChildren,
	useCallback,
	useEffect,
	useMemo,
	useState
} from 'react';
import { SessionProvider, useSession } from 'next-auth/react';
import { getStoreAndCleanup, getTestStore } from '../src/redux/store';

import Header from '../src/components/Header/Header';
import MobileNav from '../src/components/MobileNav/MobileNav';
import { Provider as ReduxProvider } from 'react-redux';
import SectionBar from '../src/components/Create/Character/SectionBar/SectionBar';
import { Session } from 'next-auth';
import ToastContainer from '../src/components/Toast/ToastContainer';
import { Provider as UrqlProvider } from 'urql';
import client from '../src/graphql/client';
import { trpc } from '../src/common/trpc';
import { useAppSelector } from '../src/hooks/reduxHooks';
import useMediaQuery from '../src/hooks/useMediaQuery';
import { usePathname } from 'next/navigation';

const AppLayout = ({
	children
}: PropsWithChildren<Record<string, unknown>>): JSX.Element => {
	const { data: session } = useSession();

	const pathname = usePathname();
	const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
	const isLargeOrLarger = useMediaQuery('(min-width: 1024px)');
	const currentLevel = useAppSelector(
		state => state.editingCharacter.classInfo.level
	);
	const spellcasting = useAppSelector(
		state => state.editingCharacter.classInfo.class?.spellcasting
	);

	const hasSpellcasting = useMemo(
		() => !!spellcasting && currentLevel >= spellcasting.level,
		[spellcasting, currentLevel]
	);

	const closeMobileNav = useCallback(
		() => setIsMobileNavOpen(false),
		[setIsMobileNavOpen]
	);

	const toggleMobileNav = useCallback(
		() => setIsMobileNavOpen(prevState => !prevState),
		[setIsMobileNavOpen]
	);

	useEffect(() => {
		if (isLargeOrLarger) {
			closeMobileNav();
		}
	}, [isLargeOrLarger, closeMobileNav]);

	useEffect(() => {
		let resizeTimer: NodeJS.Timeout;
		const resizeListener = () => {
			document.body.classList.add('resize-animation-stopper');
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(
				() => document.body.classList.remove('resize-animation-stopper'),
				400
			);
		};

		window.addEventListener('resize', resizeListener);

		return () => {
			if (resizeTimer) {
				clearTimeout(resizeTimer);
			}
			window.removeEventListener('resize', resizeListener);
		};
	}, []);

	return (
		<>
			<Header
				onMenuIconClick={toggleMobileNav}
				onLogoIconClick={closeMobileNav}
				username={session?.user?.name ?? undefined}
			/>
			<div id="app">
				{pathname?.includes('create/character') && (
					<SectionBar hasSpellcasting={hasSpellcasting} />
				)}
				<MobileNav
					isOpen={isMobileNavOpen}
					onClickLink={closeMobileNav}
					username={session?.user?.name ?? undefined}
				/>
				{children}
				<ToastContainer />
			</div>
		</>
	);
};

type AppLayouWrapperProps = PropsWithChildren<{
	session: Session | null;
	pageProps: Record<string, unknown>;
}>;

const AppLayoutWrapper = ({ children, session }: AppLayouWrapperProps) => {
	const [store, setStore] = useState(getTestStore());

	useEffect(() => {
		let cleanup = () => {};
		getStoreAndCleanup().then(([theStore, clnupFn]) => {
			setStore(theStore);
			cleanup = clnupFn;
		});
		return () => {
			cleanup();
		};
	}, []);

	return (
		<SessionProvider session={session}>
			<ReduxProvider store={store}>
				<UrqlProvider value={client}>
					<AppLayout>{children}</AppLayout>
				</UrqlProvider>
			</ReduxProvider>
		</SessionProvider>
	);
};

export default trpc.withTRPC(AppLayoutWrapper) as (
	props: AppLayouWrapperProps
) => JSX.Element;
