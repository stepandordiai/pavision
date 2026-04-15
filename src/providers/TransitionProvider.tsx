"use client";

import {
	createContext,
	useContext,
	useCallback,
	useRef,
	useEffect,
} from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { motion, useAnimation } from "framer-motion";

type TransitionContextType = {
	navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextType>({
	navigate: () => {},
});

export function usePageTransition() {
	return useContext(TransitionContext);
}

export function TransitionProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const router = useRouter();
	const pathname = usePathname();
	const controls = useAnimation();
	const resolveRef = useRef<(() => void) | null>(null);

	// fires when Next.js finishes navigating to the new page
	useEffect(() => {
		if (resolveRef.current) {
			resolveRef.current();
			resolveRef.current = null;
		}
	}, [pathname]);

	const navigate = useCallback(
		async (href: string) => {
			if (href === pathname) return;

			// fade to black
			await controls.start({
				opacity: 1,
				pointerEvents: "auto",
				transition: { duration: 0.5, ease: "easeInOut" },
			});

			// wait for page to actually load
			const pageLoaded = new Promise<void>((resolve) => {
				resolveRef.current = resolve;
			});

			router.push(href);
			await pageLoaded; // holds black until pathname changes

			// fade out
			await controls.start({
				opacity: 0,
				pointerEvents: "none",
				transition: { duration: 0.5, ease: "easeInOut" },
			});
		},
		[router, controls],
	);

	return (
		<TransitionContext.Provider value={{ navigate }}>
			{children}

			<motion.div
				initial={{ opacity: 0, pointerEvents: "none" }}
				animate={controls}
				style={{
					position: "fixed",
					inset: 0,
					background: "#000",
					zIndex: 9999,
				}}
			/>
		</TransitionContext.Provider>
	);
}
