import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import styles from "./SmartHomeHub.module.scss";

export type SmartHomeNodeId =
	| "wifi"
	| "lock"
	| "key"
	| "power"
	| "camera"
	| "film"
	| "bulb"
	| "cctv";

const VIEWBOX = 600;
const CENTER = VIEWBOX / 2;
const HUB_RING = 92; // ring around the central house
const RING = 215; // distance of node centers from center
const NODE = 34; // node circle radius

/** Point on a circle. 0° = top, increasing clockwise. */
const point = (deg: number, r: number) => {
	const rad = ((deg - 90) * Math.PI) / 180;
	return { x: CENTER + r * Math.cos(rad), y: CENTER + r * Math.sin(rad) };
};

const NODES: { id: SmartHomeNodeId; angle: number }[] = [
	{ id: "wifi", angle: 0 }, // top
	{ id: "lock", angle: 45 }, // top-right
	{ id: "key", angle: 90 }, // right
	{ id: "power", angle: 135 }, // bottom-right
	{ id: "camera", angle: 180 }, // bottom
	{ id: "film", angle: 225 }, // bottom-left
	{ id: "bulb", angle: 270 }, // left
	{ id: "cctv", angle: 315 }, // top-left
];

/** Inner SVG paths (drawn on a 24×24 viewBox, stroke = currentColor). */
const ICONS: Record<SmartHomeNodeId | "house", ReactNode> = {
	house: (
		<>
			<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" />
			<path d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
		</>
	),
	wifi: (
		<>
			<path d="M12 20h.01" />
			<path d="M2 8.82a15 15 0 0 1 20 0" />
			<path d="M5 12.86a10 10 0 0 1 14 0" />
			<path d="M8.5 16.43a5 5 0 0 1 7 0" />
		</>
	),
	lock: (
		<>
			<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
		</>
	),
	key: (
		<>
			<circle cx="7.5" cy="15.5" r="5.5" />
			<path d="m21 2-9.6 9.6" />
			<path d="m15.5 7.5 3 3L22 7l-3-3" />
		</>
	),
	power: (
		<>
			<path d="M12 2v10" />
			<path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
		</>
	),
	camera: (
		<>
			<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
			<circle cx="12" cy="13" r="3" />
		</>
	),
	film: (
		<>
			<rect width="18" height="18" x="3" y="3" rx="2" />
			<path d="M7 3v18" />
			<path d="M3 7.5h4" />
			<path d="M3 12h18" />
			<path d="M3 16.5h4" />
			<path d="M17 3v18" />
			<path d="M17 7.5h4" />
			<path d="M17 16.5h4" />
		</>
	),
	bulb: (
		<>
			<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
			<path d="M9 18h6" />
			<path d="M10 22h4" />
		</>
	),
	cctv: (
		<>
			<path d="m22 8-6 4 6 4V8Z" />
			<rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
		</>
	),
};

export interface SmartHomeHubProps {
	/** Override one or more labels (e.g. from next-intl). */
	labels?: Partial<Record<SmartHomeNodeId, string>>;
	/** Show text labels under each node. Default: true. */
	showLabels?: boolean;
	/** Accessible label for the whole graphic. */
	ariaLabel?: string;
	className?: string;
}

export default async function SmartHomeHub({
	labels,
	showLabels = true,
	ariaLabel = "Smart home system overview",
	className,
}: SmartHomeHubProps) {
	const t = await getTranslations();

	const DEFAULT_LABELS: Record<SmartHomeNodeId, string> = {
		wifi: "Connectivity",
		lock: t("security.heading"),
		key: t("homeAccess.heading"),
		power: "Energy",
		camera: t("audio.heading"),
		film: t("video.heading"),
		bulb: t("lighting.heading"),
		cctv: "Surveillance",
	};

	const merged = { ...DEFAULT_LABELS, ...labels };
	const rootClass = [styles.root, className].filter(Boolean).join(" ");

	return (
		<div className={rootClass}>
			<svg
				className={styles.svg}
				viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
				role="img"
				aria-label={ariaLabel}
			>
				{/* Connectors (base line + travelling pulse) */}
				<g>
					{NODES.map((n, i) => {
						const a = point(n.angle, HUB_RING);
						const b = point(n.angle, RING - NODE);
						return (
							<g key={`line-${n.id}`}>
								<line
									className={styles.line}
									x1={a.x}
									y1={a.y}
									x2={b.x}
									y2={b.y}
								/>
								<line
									className={styles.pulse}
									x1={a.x}
									y1={a.y}
									x2={b.x}
									y2={b.y}
									style={{ "--delay": `${i * 0.35}s` } as React.CSSProperties}
								/>
							</g>
						);
					})}
				</g>

				{/* Central hub */}
				<g className={styles.hub}>
					<circle
						className={styles.hubRing}
						cx={CENTER}
						cy={CENTER}
						r={HUB_RING}
					/>
					<svg
						x={CENTER - 36}
						y={CENTER - 36}
						width={72}
						height={72}
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={1.6}
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						{ICONS.house}
					</svg>
				</g>

				{/* Outer nodes */}
				{NODES.map((n) => {
					const c = point(n.angle, RING);
					return (
						<g key={n.id} className={styles.node}>
							<circle
								className={styles.nodeCircle}
								cx={c.x}
								cy={c.y}
								r={NODE}
							/>
							<svg
								className={styles.nodeIcon}
								x={c.x - 15}
								y={c.y - 15}
								width={30}
								height={30}
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth={1.7}
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								{ICONS[n.id]}
							</svg>
							{showLabels && (
								<text
									className={styles.label}
									x={c.x}
									y={c.y + NODE + 22}
									textAnchor="middle"
								>
									{merged[n.id]}
								</text>
							)}
						</g>
					);
				})}
			</svg>
		</div>
	);
}
