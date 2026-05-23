"use client";

// import { useRouter, Link } from 'next-intl' // 👈 both from next-intl
import { useRouter, Link } from "@/i18n/navigation";
import { usePageTransition } from "@/providers/TransitionProvider";

type Props = React.ComponentProps<typeof Link>;

export function TransitionLink({ href, onClick, children, ...props }: Props) {
	const router = useRouter();
	const { navigate } = usePageTransition();

	return (
		<Link
			style={{
				display: "flex",
				alignItems: "center",
			}}
			href={href}
			prefetch={true}
			onClick={(e) => {
				e.preventDefault();
				onClick?.(e as any);
				navigate(typeof href === "string" ? href : (href.pathname ?? "/"));
			}}
			{...props}
		>
			{children}
		</Link>
	);
}
