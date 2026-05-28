"use client";

import { useInView } from "@/hooks/useInView";
import { div } from "framer-motion/client";

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
	delay?: number; // stagger if multiple images in a row
};

export function AnimatedImage({ delay = 0, style, ...props }: Props) {
	const { ref, inView } = useInView();

	return (
		<div
			style={{
				overflow: "hidden",
				borderRadius: 10,
				background: inView ? "rgba(0, 0, 0, 0)" : "#000",
				transition: `background 0.7s ease`,
			}}
		>
			<img
				ref={ref}
				{...props}
				style={{
					...style,
					transform: inView ? "scale(1)" : "scale(1.2)",
					filter: `brightness(${inView ? 1 : 0})`,
					transition: `transform 0.7s ease ${delay}s, filter 0.7s ease ${delay}s`,
				}}
			/>
		</div>
	);
}
