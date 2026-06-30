"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./RoomAutomation.module.scss";
import TvIcon from "../icons/TvIcon";
import LightbulbIcon from "../icons/LightbulbIcon";

type Scene = "relax" | "bright" | "cinema";

interface SceneConfig {
	wT: string;
	wB: string;
	fT: string;
	fB: string;
	cT: string;
	skyT: string;
	skyB: string;
	sun: number;
	aR: number;
	aG: number;
	aB: number;
	br: number;
}

const SCENES: Record<Scene, SceneConfig> = {
	relax: {
		// warm, cozy, dimmed — golden-hour amber evening
		wT: "#e4c9a8",
		wB: "#caa97e",
		fT: "#bb8f56",
		fB: "#8f6a3e",
		cT: "#e8cda6",
		skyT: "#e3a865",
		skyB: "#f0c98e",
		sun: 0.55,
		aR: 255,
		aG: 178,
		aB: 104,
		br: 0.5,
	},
	bright: {
		// natural daytime light — soft, warm-neutral, not cold or clinical
		wT: "#ece6da",
		wB: "#dcd2c2",
		fT: "#d8bf92",
		fB: "#bb9d6c",
		cT: "#f2ece0",
		skyT: "#9cc8ec",
		skyB: "#dcebf4",
		sun: 0.85,
		aR: 252,
		aG: 240,
		aB: 218,
		br: 0.82,
	},
	cinema: {
		wT: "#1c1822",
		wB: "#120f18",
		fT: "#241d27",
		fB: "#15101a",
		cT: "#211b2a",
		skyT: "#0a0a16",
		skyB: "#13111f",
		sun: 0,
		aR: 120,
		aG: 90,
		aB: 210,
		br: 0.1,
	},
};

const SCENE_META: Record<
	Scene,
	{ label: string; color: string; dot: string; bg: string }
> = {
	relax: { label: "Relax", color: "#854f0b", dot: "#ba7517", bg: "#faeeda" },
	bright: { label: "Bright", color: "#0c447c", dot: "#185fa5", bg: "#e6f1fb" },
	cinema: { label: "Cinema", color: "#3c3489", dot: "#534ab7", bg: "#eeedfe" },
};

const W = 480,
	H = 360,
	DUR = 750;

function ease(t: number) {
	return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function ln(a: number, b: number, t: number) {
	return a + (b - a) * t;
}
function lc(a: string, b: string, t: number): string {
	const p = (s: string) => parseInt(s.slice(1, 3), 16);
	const q = (s: string) => parseInt(s.slice(3, 5), 16);
	const r = (s: string) => parseInt(s.slice(5, 7), 16);
	return `rgb(${Math.round(ln(p(a), p(b), t))},${Math.round(
		ln(q(a), q(b), t),
	)},${Math.round(ln(r(a), r(b), t))})`;
}

// ── TIME-OF-DAY OUTDOOR SKY ───────────────────────────────────
// Maps the visitor's real local hour (0–24, fractional ok) to the
// outdoor sky/sun so the garden matches their actual time of day.
// This is independent of the room Lighting Scenes.
interface SkyOfDay {
	skyT: string;
	skyB: string;
	sun: number; // 0..1 sun bloom + warm transmit
	stars: number; // 0..1 star visibility
	ground: string; // lawn/garden tint
	daylight: number; // 0..1 overall outdoor brightness (for window glow)
}
// keyframes across 24h; values interpolate between the nearest two
const SKY_KEYS: { h: number; v: SkyOfDay }[] = [
	{
		h: 0,
		v: {
			skyT: "#070a18",
			skyB: "#0d1430",
			sun: 0,
			stars: 1,
			ground: "#10160f",
			daylight: 0.06,
		},
	}, // deep night
	{
		h: 5,
		v: {
			skyT: "#1b2440",
			skyB: "#3a3550",
			sun: 0.05,
			stars: 0.5,
			ground: "#1c2616",
			daylight: 0.16,
		},
	}, // pre-dawn
	{
		h: 7,
		v: {
			skyT: "#9fb6d8",
			skyB: "#f0c9a0",
			sun: 0.55,
			stars: 0,
			ground: "#5e7a44",
			daylight: 0.6,
		},
	}, // sunrise / morning
	{
		h: 9,
		v: {
			skyT: "#8fc0ea",
			skyB: "#d6ecf6",
			sun: 0.7,
			stars: 0,
			ground: "#6f8f4e",
			daylight: 0.82,
		},
	}, // bright morning
	{
		h: 13,
		v: {
			skyT: "#5fa8e8",
			skyB: "#cfe9fb",
			sun: 1,
			stars: 0,
			ground: "#7da055",
			daylight: 1,
		},
	}, // warm sunny midday
	{
		h: 17,
		v: {
			skyT: "#79b0e0",
			skyB: "#ffe3b0",
			sun: 0.8,
			stars: 0,
			ground: "#6f8f4e",
			daylight: 0.78,
		},
	}, // afternoon
	{
		h: 19,
		v: {
			skyT: "#3a3f6e",
			skyB: "#e88a4e",
			sun: 0.5,
			stars: 0.1,
			ground: "#3e4a2c",
			daylight: 0.4,
		},
	}, // sunset / dusk
	{
		h: 20.5,
		v: {
			skyT: "#161a38",
			skyB: "#3a2f4a",
			sun: 0.1,
			stars: 0.5,
			ground: "#1e2616",
			daylight: 0.16,
		},
	}, // nightfall
	{
		h: 23,
		v: {
			skyT: "#080b1c",
			skyB: "#0f1734",
			sun: 0,
			stars: 1,
			ground: "#121810",
			daylight: 0.07,
		},
	}, // starry night
	{
		h: 24,
		v: {
			skyT: "#070a18",
			skyB: "#0d1430",
			sun: 0,
			stars: 1,
			ground: "#10160f",
			daylight: 0.06,
		},
	}, // wrap to midnight
];
function skyForHour(hour: number): SkyOfDay {
	const h = ((hour % 24) + 24) % 24;
	let lo = SKY_KEYS[0],
		hi = SKY_KEYS[SKY_KEYS.length - 1];
	for (let i = 0; i < SKY_KEYS.length - 1; i++) {
		if (h >= SKY_KEYS[i].h && h <= SKY_KEYS[i + 1].h) {
			lo = SKY_KEYS[i];
			hi = SKY_KEYS[i + 1];
			break;
		}
	}
	const span = hi.h - lo.h || 1;
	const t = (h - lo.h) / span;
	return {
		skyT: lc(lo.v.skyT, hi.v.skyT, t),
		skyB: lc(lo.v.skyB, hi.v.skyB, t),
		sun: ln(lo.v.sun, hi.v.sun, t),
		stars: ln(lo.v.stars, hi.v.stars, t),
		ground: lc(lo.v.ground, hi.v.ground, t),
		daylight: ln(lo.v.daylight, hi.v.daylight, t),
	};
}

interface DrawState extends SceneConfig {
	shade: number; // 0 = open, 100 = closed (both windows)
	ceil: number; // 0..1 ceiling LED cove
	shelf: number; // 0..1 bookshelf backlight
}

function blend(f: DrawState, t: DrawState, e: number): DrawState {
	return {
		wT: lc(f.wT, t.wT, e),
		wB: lc(f.wB, t.wB, e),
		fT: lc(f.fT, t.fT, e),
		fB: lc(f.fB, t.fB, e),
		cT: lc(f.cT, t.cT, e),
		skyT: lc(f.skyT, t.skyT, e),
		skyB: lc(f.skyB, t.skyB, e),
		sun: ln(f.sun, t.sun, e),
		aR: ln(f.aR, t.aR, e),
		aG: ln(f.aG, t.aG, e),
		aB: ln(f.aB, t.aB, e),
		br: ln(f.br, t.br, e),
		shade: ln(f.shade, t.shade, e),
		ceil: ln(f.ceil, t.ceil, e),
		shelf: ln(f.shelf, t.shelf, e),
	};
}

function drawRoom(
	cx: CanvasRenderingContext2D,
	s: DrawState,
	tvOn: boolean,
	video: HTMLVideoElement | null,
	time: number,
	hour: number,
) {
	const M = 150;
	const fY = H * 0.6; // floor line — raised wall / deeper foreground for the sofas
	const ceilY = H * 0.18; // ceiling soffit line
	const rr = (
		x: number,
		y: number,
		w: number,
		h: number,
		r: number | object,
	) => {
		cx.beginPath();
		cx.roundRect(x, y, w, h, r as number);
	};
	const rnd = (i: number) => {
		const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
		return x - Math.floor(x);
	};
	const darkF = Math.max(0, Math.min(1, (0.5 - s.br) / 0.42));
	const hx = (h: string) => [
		parseInt(h.slice(1, 3), 16),
		parseInt(h.slice(3, 5), 16),
		parseInt(h.slice(5, 7), 16),
	];
	const mix = (lightHex: string, darkHex: string, amt = darkF) => {
		const a = hx(lightHex),
			b = hx(darkHex);
		return `rgb(${Math.round(a[0] + (b[0] - a[0]) * amt)},${Math.round(
			a[1] + (b[1] - a[1]) * amt,
		)},${Math.round(a[2] + (b[2] - a[2]) * amt)})`;
	};

	// ─────────────────────────────────────────────────────────
	// CEILING (tray) + perimeter LED cove
	// ─────────────────────────────────────────────────────────
	const cg = cx.createLinearGradient(0, -M, 0, ceilY + 20);
	cg.addColorStop(0, s.cT);
	cg.addColorStop(1, s.wT);
	cx.fillStyle = cg;
	cx.fillRect(-M, -M, W + 2 * M, ceilY + M);

	// recessed soffit step
	cx.fillStyle = mix("#e7ddcc", "#191421");
	cx.fillRect(-M, ceilY - 12, W + 2 * M, 12);
	cx.fillStyle = "rgba(0,0,0,0.18)";
	cx.fillRect(-M, ceilY, W + 2 * M, 2);

	// warm white 3000K LED cove — thin, bright, edge-to-edge rectangular tray.
	// The whole cove is CLIPPED to the ceiling band (above the window frames) so
	// toggling it can never light the windows, their frames, or the outdoors.
	if (s.ceil > 0.01) {
		const a = s.ceil;
		cx.save();
		cx.beginPath();
		cx.rect(-M, -M, W + 2 * M, ceilY - 6 + M); // ceiling only: top of canvas down to just above the soffit
		cx.clip();
		// tray spans almost the full room width, in mild perspective
		const trayTop = ceilY * 0.3; // far edge (higher up, slightly inset)
		const trayBot = ceilY - 6; // near edge (just above the soffit)
		const innerTopL = W * 0.14,
			innerTopR = W * 0.86; // far edge — reaches toward the corners
		const outerBotL = -M * 0.2,
			outerBotR = W + M * 0.2; // near edge — runs off to the room corners
		// recessed dark tray channel
		cx.fillStyle = mix("#d9cdba", "#15111b");
		cx.beginPath();
		cx.moveTo(innerTopL - 6, trayTop);
		cx.lineTo(innerTopR + 6, trayTop);
		cx.lineTo(outerBotR + 6, trayBot);
		cx.lineTo(outerBotL - 6, trayBot);
		cx.closePath();
		cx.fill();
		// inner ceiling panel inside the tray
		cx.fillStyle = mix("#efe6d6", "#1d1726");
		cx.beginPath();
		cx.moveTo(innerTopL, trayTop + 3);
		cx.lineTo(innerTopR, trayTop + 3);
		cx.lineTo(outerBotR, trayBot - 3);
		cx.lineTo(outerBotL, trayBot - 3);
		cx.closePath();
		cx.fill();

		// thin, bright LED edge — minimal bloom, hot core, fine diodes
		const led = (
			x1: number,
			y1: number,
			x2: number,
			y2: number,
			near = false,
		) => {
			const k = near ? 1 : 0.85;
			// tight bloom (thin, not wide)
			cx.strokeStyle = `rgba(255,212,156,${0.3 * a * k})`;
			cx.lineWidth = 6;
			cx.lineCap = "round";
			cx.beginPath();
			cx.moveTo(x1, y1);
			cx.lineTo(x2, y2);
			cx.stroke();
			// bright thin core
			cx.strokeStyle = `rgba(255,248,228,${a * k})`;
			cx.lineWidth = 1.4;
			cx.beginPath();
			cx.moveTo(x1, y1);
			cx.lineTo(x2, y2);
			cx.stroke();
			// fine diode beads
			const len = Math.hypot(x2 - x1, y2 - y1);
			const n = Math.max(2, Math.round(len / 6));
			for (let i = 0; i <= n; i++) {
				const t = i / n;
				cx.fillStyle = `rgba(255,252,238,${0.95 * a * k})`;
				cx.beginPath();
				cx.arc(ln(x1, x2, t), ln(y1, y2, t), 0.55, 0, Math.PI * 2);
				cx.fill();
			}
			cx.lineCap = "butt";
		};
		led(innerTopL, trayTop, innerTopR, trayTop);
		led(innerTopL, trayTop, outerBotL, trayBot);
		led(innerTopR, trayTop, outerBotR, trayBot);
		led(outerBotL, trayBot, outerBotR, trayBot, true);

		// indirect bounce UP onto the ceiling slab (stays above the soffit)
		const up = cx.createLinearGradient(0, trayBot, 0, trayTop - 30);
		up.addColorStop(0, `rgba(255,224,176,${0.5 * a})`);
		up.addColorStop(1, "rgba(255,224,176,0)");
		cx.fillStyle = up;
		cx.fillRect(-M, trayTop - 30, W + 2 * M, trayBot - trayTop + 30);
		// short downward wash — capped ABOVE the windows so glass stays clean
		const washBot = Math.min(ceilY + 4, ceilY); // stop at the soffit line
		const cov = cx.createLinearGradient(0, trayBot, 0, washBot);
		cov.addColorStop(0, `rgba(255,220,166,${0.6 * a})`);
		cov.addColorStop(1, "rgba(255,214,158,0)");
		cx.fillStyle = cov;
		cx.fillRect(-M, trayBot, W + 2 * M, Math.max(0, washBot - trayBot));
		cx.restore(); // end ceiling-only clip
	}

	// recessed downlights across the ceiling (speakers moved to floor towers)
	const ceilItems = [
		{ x: W * 0.16 },
		{ x: W * 0.3 },
		{ x: W * 0.44 },
		{ x: W * 0.56 },
		{ x: W * 0.7 },
		{ x: W * 0.84 },
	];
	ceilItems.forEach(({ x }) => {
		const y = ceilY * 0.5;
		{
			cx.fillStyle = "rgba(0,0,0,0.12)";
			cx.beginPath();
			cx.ellipse(x, y, 3.4, 2, 0, 0, Math.PI * 2);
			cx.fill();
			cx.fillStyle =
				s.br > 0.2
					? `rgba(255,242,212,${Math.min(1, 0.55 + s.br * 0.45)})`
					: "rgba(90,90,112,0.5)";
			cx.beginPath();
			cx.ellipse(x, y, 1.7, 1, 0, 0, Math.PI * 2);
			cx.fill();
			if (s.br > 0.15) {
				const dl = cx.createRadialGradient(x, y, 0, x, y, 50 * s.br);
				dl.addColorStop(0, `rgba(${s.aR},${s.aG},${s.aB},${s.br * 0.1})`);
				dl.addColorStop(1, "rgba(0,0,0,0)");
				cx.fillStyle = dl;
				cx.beginPath();
				cx.moveTo(x, y);
				cx.lineTo(x + 30 * s.br, fY);
				cx.lineTo(x - 30 * s.br, fY);
				cx.closePath();
				cx.fill();
			}
		}
	});

	// ─────────────────────────────────────────────────────────
	// BACK WALL plane
	// ─────────────────────────────────────────────────────────
	const wg = cx.createLinearGradient(0, ceilY, 0, fY);
	wg.addColorStop(0, s.wT);
	wg.addColorStop(1, s.wB);
	cx.fillStyle = wg;
	cx.fillRect(-M, ceilY, W + 2 * M, fY - ceilY);

	// ─────────────────────────────────────────────────────────
	// TWO PANORAMIC WINDOWS flanking the central feature
	// ─────────────────────────────────────────────────────────
	const featX = W * 0.5;
	const featW = 118; // central marble feature width
	const winTop = ceilY + 6;
	const winBot = fY - 4;
	const winH = winBot - winTop;
	const leftWin = { x: 30, w: featX - featW / 2 - 30 - 6 };
	const rightWin = {
		x: featX + featW / 2 + 6,
		w: W - 44 - (featX + featW / 2 + 6), // a little narrower → wider right wall for the switch
	};

	const drawWindow = (wx: number, ww: number, flip: boolean) => {
		// frame
		cx.fillStyle = mix("#2c2823", "#0e0d10");
		rr(wx - 4, winTop - 4, ww + 8, winH + 8, 2);
		cx.fill();

		// ── EVERYTHING OUTDOORS IS CLIPPED TO THE GLASS ──
		// (this is the fix: trees/sky/sun can never paint into the room)
		cx.save();
		cx.beginPath();
		cx.rect(wx, winTop, ww, winH);
		cx.clip();

		// ── TIME-OF-DAY outdoor scene (driven by the visitor's local hour) ──
		const tod = skyForHour(hour);
		const night = tod.daylight < 0.3; // dim foliage + show stars at night

		// sky gradient for this hour
		const sky = cx.createLinearGradient(wx, winTop, wx, winBot);
		sky.addColorStop(0, tod.skyT);
		sky.addColorStop(1, tod.skyB);
		cx.fillStyle = sky;
		cx.fillRect(wx, winTop, ww, winH);

		// stars at night (deterministic per window, twinkle via time)
		if (tod.stars > 0.05) {
			for (let i = 0; i < 46; i++) {
				const sxp = wx + rnd(i + (flip ? 200 : 0)) * ww;
				const syp = winTop + rnd(i + 50) * winH * 0.6;
				const tw2 = 0.6 + 0.4 * Math.sin(time * 0.003 + i * 1.3);
				cx.fillStyle = `rgba(255,255,255,${tod.stars * (0.4 + rnd(i) * 0.5) * tw2})`;
				cx.beginPath();
				cx.arc(sxp, syp, rnd(i + 9) > 0.85 ? 1.1 : 0.6, 0, Math.PI * 2);
				cx.fill();
			}
			// soft moon
			const mx = flip ? wx + ww * 0.7 : wx + ww * 0.3;
			const my = winTop + winH * 0.16;
			const moon = cx.createRadialGradient(mx, my, 1, mx, my, 18);
			moon.addColorStop(0, `rgba(245,248,255,${tod.stars * 0.95})`);
			moon.addColorStop(0.25, `rgba(220,230,250,${tod.stars * 0.5})`);
			moon.addColorStop(1, "rgba(200,215,245,0)");
			cx.fillStyle = moon;
			cx.beginPath();
			cx.arc(mx, my, 18, 0, Math.PI * 2);
			cx.fill();
		}

		// soft sun bloom (daytime), warm low sun near sunrise/sunset
		if (tod.sun > 0.05) {
			const bx = flip ? wx + ww * 0.25 : wx + ww * 0.75;
			// sun sits lower in the sky at dawn/dusk
			const lowSun = hour < 9 || hour > 17;
			const by = winTop + winH * (lowSun ? 0.5 : 0.26);
			const warm = lowSun ? "255,196,120" : "255,248,214";
			const bl = cx.createRadialGradient(bx, by, 4, bx, by, ww * 0.75);
			bl.addColorStop(0, `rgba(${warm},${0.6 * tod.sun})`);
			bl.addColorStop(1, `rgba(${warm},0)`);
			cx.fillStyle = bl;
			cx.fillRect(wx, winTop, ww, winH);
		}

		// distant treeline / lawn
		const horizon = winTop + winH * 0.78;
		// far hedge band (tinted by time of day)
		cx.fillStyle = night ? "rgba(20,30,22,0.78)" : "rgba(96,128,78,0.55)";
		cx.fillRect(wx, horizon - winH * 0.06, ww, winH * 0.1);
		// manicured lawn
		const lawn = cx.createLinearGradient(0, horizon, 0, winBot);
		const gB = tod.ground;
		lawn.addColorStop(0, gB);
		lawn.addColorStop(1, night ? "rgba(8,16,8,0.92)" : "rgba(70,104,52,0.9)");
		cx.fillStyle = lawn;
		cx.fillRect(wx, horizon, ww, winBot - horizon);

		// detailed trees — layered foliage clumps, trunk, branches
		const nTrees = Math.max(2, Math.round(ww / 24));
		for (let i = 0; i < nTrees; i++) {
			const seed = i + (flip ? 40 : 0);
			const tx = wx + ((i + 0.5) / nTrees) * ww + (rnd(seed) - 0.5) * 8;
			// trees stay short relative to the window so they read as a garden
			// band behind the glass (sky fills the space above them)
			const th = winH * (0.18 + rnd(seed + 5) * 0.14);
			const tw = th * (0.55 + rnd(seed + 9) * 0.22);
			const rootY = horizon + winH * 0.02;
			const topY = rootY - th;
			// trunk
			cx.strokeStyle = night ? "rgba(18,16,12,0.85)" : "rgba(74,54,36,0.7)";
			cx.lineWidth = 1.8;
			cx.beginPath();
			cx.moveTo(tx, rootY);
			cx.lineTo(tx + (rnd(seed + 2) - 0.5) * 4, topY + th * 0.45);
			cx.stroke();
			// a couple of branches
			cx.lineWidth = 1;
			for (let b = 0; b < 2; b++) {
				const by = rootY - th * (0.45 + b * 0.18);
				const dir = b % 2 === 0 ? -1 : 1;
				cx.beginPath();
				cx.moveTo(tx, by);
				cx.lineTo(tx + dir * tw * 0.4, by - th * 0.12);
				cx.stroke();
			}
			// layered canopy clumps — lit by daylight, silhouetted at night
			const clumps = 3 + Math.floor(rnd(seed + 3) * 3);
			for (let k = 0; k < clumps; k++) {
				const ka = rnd(seed * 5 + k) * Math.PI * 2;
				const kr = rnd(seed * 5 + k + 1) * tw * 0.7;
				const ccx = tx + Math.cos(ka) * kr;
				const ccy = topY + th * 0.32 + Math.sin(ka) * kr * 0.6;
				const cr = tw * (0.4 + rnd(seed + k + 7) * 0.4);
				const g2 = cx.createRadialGradient(
					ccx - cr * 0.3,
					ccy - cr * 0.3,
					1,
					ccx,
					ccy,
					cr,
				);
				if (night) {
					g2.addColorStop(0, "rgba(26,40,28,0.95)");
					g2.addColorStop(1, "rgba(12,22,14,0.6)");
				} else {
					// daytime greens scaled by how much daylight there is
					const dl = tod.daylight;
					const lit = rnd(seed + k) > 0.5;
					const base = lit
						? [120 * dl + 30, 165 * dl + 30, 92 * dl + 22]
						: [74 * dl + 24, 118 * dl + 24, 62 * dl + 18];
					g2.addColorStop(
						0,
						`rgba(${Math.round(base[0] + rnd(k) * 30)},${Math.round(base[1] + rnd(k + 1) * 25)},${Math.round(base[2] + rnd(k + 2) * 18)},0.95)`,
					);
					g2.addColorStop(
						1,
						`rgba(${Math.round(40 * dl)},${Math.round(80 * dl)},${Math.round(40 * dl)},0.4)`,
					);
				}
				cx.fillStyle = g2;
				cx.beginPath();
				cx.ellipse(ccx, ccy, cr, cr * 0.9, rnd(seed + k) * 1.2, 0, Math.PI * 2);
				cx.fill();
			}
		}
		// low shrubs along the base
		for (let i = 0; i < Math.round(ww / 14); i++) {
			const sxp = wx + (i + 0.5) * 14 + (rnd(i + 80) - 0.5) * 6;
			cx.fillStyle = night ? "rgba(18,30,20,0.85)" : "rgba(78,120,64,0.75)";
			cx.beginPath();
			cx.ellipse(sxp, winBot - winH * 0.04, 7, 4, 0, 0, Math.PI * 2);
			cx.fill();
		}

		// glass sheen (still inside clip so it reads as reflection on the pane)
		const sheen = cx.createLinearGradient(wx, winTop, wx + ww, winBot);
		sheen.addColorStop(0, "rgba(255,255,255,0.10)");
		sheen.addColorStop(0.4, "rgba(255,255,255,0.02)");
		sheen.addColorStop(1, "rgba(255,255,255,0)");
		cx.fillStyle = sheen;
		cx.fillRect(wx, winTop, ww, winH);

		cx.restore(); // ── end outdoor clip ──

		// ── motorized roller shade (s.shade) ──
		const shPx = Math.round(winH * (s.shade / 100));
		if (shPx > 0) {
			cx.save();
			cx.beginPath();
			cx.rect(wx, winTop, ww, shPx);
			cx.clip();
			const fab = cx.createLinearGradient(wx, winTop, wx + ww, winTop);
			fab.addColorStop(0, "#e6dcc8");
			fab.addColorStop(0.5, "#dccfb5");
			fab.addColorStop(1, "#d0c2a4");
			cx.fillStyle = fab;
			cx.fillRect(wx, winTop, ww, shPx);
			if (s.sun > 0.05) {
				const tr = cx.createLinearGradient(wx, winTop, wx, winTop + shPx);
				tr.addColorStop(0, `rgba(255,244,210,${0.22 * s.sun})`);
				tr.addColorStop(1, "rgba(255,244,210,0)");
				cx.fillStyle = tr;
				cx.fillRect(wx, winTop, ww, shPx);
			}
			cx.strokeStyle = "rgba(150,132,98,0.12)";
			cx.lineWidth = 0.5;
			for (let y = winTop + 3; y < winTop + shPx; y += 4) {
				cx.beginPath();
				cx.moveTo(wx, y);
				cx.lineTo(wx + ww, y);
				cx.stroke();
			}
			cx.restore();
			// weighted hem bar
			const hemY = winTop + shPx - 3;
			cx.fillStyle = "#b7a780";
			cx.fillRect(wx, hemY, ww, 3);
		}
		// recessed shade housing in soffit
		cx.fillStyle = mix("#2c2823", "#100f12");
		cx.fillRect(wx - 4, winTop - 8, ww + 8, 7);

		// frame outline + thin mullions (mullion always full height, on top of the shade)
		cx.strokeStyle = mix("rgba(40,36,32,0.7)", "rgba(8,8,7,0.9)");
		cx.lineWidth = 2.5;
		cx.strokeRect(wx, winTop, ww, winH);
		// vertical center mullion — drawn last so it stays visible even when shades are closed
		cx.strokeStyle = mix("rgba(48,42,36,0.85)", "rgba(18,16,14,0.85)");
		cx.lineWidth = 2;
		cx.beginPath();
		cx.moveTo(wx + ww / 2, winTop);
		cx.lineTo(wx + ww / 2, winTop + winH);
		cx.stroke();
	};
	drawWindow(leftWin.x, leftWin.w, false);
	drawWindow(rightWin.x, rightWin.w, true);

	// ─────────────────────────────────────────────────────────
	// LOXONE TOUCH PURE switch on the right-hand wall.
	// The warm courtesy under-light glows ONLY in the Cinema scene
	// (darkest scene), and is off in Relax / Bright.
	// ─────────────────────────────────────────────────────────
	{
		const wallL = rightWin.x + rightWin.w; // inner edge of the right wall plaster
		const wallR = W - 4;
		const sw = 18; // switch size
		const swX = wallL + (wallR - wallL) * 0.5 - sw / 2 + 3; // centered in the wall, nudged right off the frame
		const swY = ceilY + (fY - ceilY) * 0.4 - sw / 2; // mounted at a natural height
		// cinema glow factor: 1 in cinema (br≈0.1), fades out toward relax/bright
		const cinemaGlow = Math.max(0, Math.min(1, (0.25 - s.br) / 0.18));

		// warm courtesy light spilling DOWN the wall from under the switch
		// (tight, realistic pool — small and soft, like a real LED courtesy light)
		if (cinemaGlow > 0.01) {
			const cxc = swX + sw / 2;
			const topY = swY + sw - 1;
			// soft narrow pool just below the plate
			const g = cx.createRadialGradient(cxc, topY + 2, 1, cxc, topY + 10, 15);
			g.addColorStop(0, `rgba(255,206,140,${0.5 * cinemaGlow})`);
			g.addColorStop(0.45, `rgba(255,184,112,${0.18 * cinemaGlow})`);
			g.addColorStop(1, "rgba(255,184,112,0)");
			cx.fillStyle = g;
			cx.beginPath();
			cx.moveTo(cxc - 7, topY);
			cx.lineTo(cxc + 7, topY);
			cx.lineTo(cxc + 11, topY + 22);
			cx.lineTo(cxc - 11, topY + 22);
			cx.closePath();
			cx.fill();
		}

		// soft drop shadow behind the plate
		cx.fillStyle = "rgba(0,0,0,0.18)";
		rr(swX + 1.5, swY + 2, sw, sw, 2);
		cx.fill();

		// the square glass switch plate — dark graphite (matches the photo's black unit)
		const plate = cx.createLinearGradient(swX, swY, swX + sw, swY + sw);
		plate.addColorStop(0, mix("#3a3d42", "#26282c"));
		plate.addColorStop(0.5, mix("#2a2c30", "#191a1d"));
		plate.addColorStop(1, mix("#1c1e21", "#0e0f11"));
		cx.fillStyle = plate;
		rr(swX, swY, sw, sw, 2);
		cx.fill();
		// subtle glass sheen on the plate
		cx.fillStyle = "rgba(255,255,255,0.06)";
		rr(swX + 1.5, swY + 1.5, sw - 3, sw * 0.4, 1.5);
		cx.fill();

		// engraved diamond outline (the Touch Pure signature), faintly lit
		const lineA = 0.22 + cinemaGlow * 0.4;
		cx.strokeStyle = `rgba(200,210,220,${lineA})`;
		cx.lineWidth = 0.6;
		cx.beginPath();
		cx.moveTo(swX + sw / 2, swY + 3);
		cx.lineTo(swX + sw - 3, swY + sw / 2);
		cx.lineTo(swX + sw / 2, swY + sw - 3);
		cx.lineTo(swX + 3, swY + sw / 2);
		cx.closePath();
		cx.stroke();

		// (LOXONE wordmark line removed)

		// the actual warm light bar under the bottom edge (the LED itself)
		if (cinemaGlow > 0.01) {
			const cxc = swX + sw / 2;
			// hot thin core
			cx.fillStyle = `rgba(255,224,170,${0.95 * cinemaGlow})`;
			cx.fillRect(cxc - 5, swY + sw - 0.3, 10, 0.9);
			// faint immediate halo around the bar
			cx.fillStyle = `rgba(255,196,120,${0.4 * cinemaGlow})`;
			cx.fillRect(cxc - 6, swY + sw - 0.6, 12, 0.5);
		}
	}

	// ─────────────────────────────────────────────────────────
	// CENTRAL MARBLE FIREPLACE FEATURE WALL
	// ─────────────────────────────────────────────────────────
	const mX = featX - featW / 2,
		mTop = ceilY - 6,
		mBot = fY,
		mH = mBot - mTop;
	// marble base
	const marbleBase = mix("#5a4a4a", "#241a1c"); // mocha / brown marble like the photo
	const marbleHi = mix("#766060", "#352629");
	const mg = cx.createLinearGradient(mX, mTop, mX + featW, mBot);
	mg.addColorStop(0, marbleHi);
	mg.addColorStop(0.5, marbleBase);
	mg.addColorStop(1, mix("#4a3b3b", "#1c1416"));
	cx.fillStyle = mg;
	cx.fillRect(mX, mTop, featW, mH);
	// marble veins (deterministic)
	cx.save();
	cx.beginPath();
	cx.rect(mX, mTop, featW, mH);
	cx.clip();
	for (let i = 0; i < 16; i++) {
		cx.strokeStyle = `rgba(${darkF > 0.5 ? "70,58,58" : "200,180,178"},${0.12 + rnd(i) * 0.16})`;
		cx.lineWidth = 0.5 + rnd(i + 3) * 1.2;
		const sx = mX + rnd(i) * featW;
		cx.beginPath();
		cx.moveTo(sx, mTop);
		cx.bezierCurveTo(
			sx + (rnd(i + 1) - 0.5) * 60,
			mTop + mH * 0.33,
			sx + (rnd(i + 2) - 0.5) * 60,
			mTop + mH * 0.66,
			sx + (rnd(i + 4) - 0.5) * 50,
			mBot,
		);
		cx.stroke();
	}
	cx.restore();
	// subtle marble sheen
	const msh = cx.createLinearGradient(mX, mTop, mX + featW, mTop);
	msh.addColorStop(0, "rgba(255,255,255,0.05)");
	msh.addColorStop(0.5, "rgba(255,255,255,0)");
	cx.fillStyle = msh;
	cx.fillRect(mX, mTop, featW, mH);
	// thin reveal shadows where marble meets windows
	cx.fillStyle = "rgba(0,0,0,0.25)";
	cx.fillRect(mX - 2, mTop, 2, mH);
	cx.fillRect(mX + featW, mTop, 2, mH);

	// ── FLUSH TV on the marble ──
	const tvW = 92,
		tvH = 56,
		tvX = featX - tvW / 2,
		tvY = mTop + 34;
	if (s.br < 0.5 || tvOn) {
		const biasA = tvOn ? 0.16 : 0.06 + darkF * 0.08;
		const bias = cx.createRadialGradient(
			featX,
			tvY + tvH / 2,
			tvH * 0.4,
			featX,
			tvY + tvH / 2,
			tvW * 0.9,
		);
		bias.addColorStop(0, `rgba(90,150,255,${biasA})`);
		bias.addColorStop(1, "rgba(90,150,255,0)");
		cx.fillStyle = bias;
		cx.fillRect(tvX - 30, tvY - 22, tvW + 60, tvH + 44);
	}
	cx.fillStyle = "rgba(0,0,0,0.3)";
	rr(tvX - 3, tvY - 2, tvW + 6, tvH + 6, 3);
	cx.fill();
	cx.fillStyle = "#0a0a0d";
	rr(tvX - 1.5, tvY - 1.5, tvW + 3, tvH + 3, 2.5);
	cx.fill();
	cx.fillStyle = "#040406";
	rr(tvX, tvY, tvW, tvH, 1.5);
	cx.fill();
	if (tvOn) {
		const innerX = tvX + 1.5,
			innerY = tvY + 1.5,
			innerW = tvW - 3,
			innerH = tvH - 3;
		if (video && video.readyState >= 2) {
			cx.save();
			cx.beginPath();
			cx.rect(innerX, innerY, innerW, innerH);
			cx.clip();
			const vw = video.videoWidth || 16,
				vh = video.videoHeight || 9;
			const sc = Math.max(innerW / vw, innerH / vh);
			const dw = vw * sc,
				dh = vh * sc;
			const dx = innerX + (innerW - dw) / 2,
				dy = innerY + (innerH - dh) / 2;
			cx.drawImage(video, dx, dy, dw, dh);
			cx.restore();
		} else {
			cx.fillStyle = "#0c0a12";
			cx.fillRect(innerX, innerY, innerW, innerH);
		}
		cx.fillStyle = "rgba(255,255,255,0.05)";
		cx.fillRect(innerX, innerY, innerW, innerH * 0.28);
	}
	// glass reflection on the panel
	cx.save();
	cx.beginPath();
	cx.rect(tvX, tvY, tvW, tvH);
	cx.clip();
	const refl = cx.createLinearGradient(tvX, tvY, tvX + tvW, tvY + tvH);
	refl.addColorStop(0, `rgba(255,255,255,${tvOn ? 0.05 : 0.08})`);
	refl.addColorStop(0.35, "rgba(255,255,255,0.01)");
	refl.addColorStop(1, "rgba(255,255,255,0)");
	cx.fillStyle = refl;
	cx.beginPath();
	cx.moveTo(tvX, tvY);
	cx.lineTo(tvX + tvW * 0.55, tvY);
	cx.lineTo(tvX, tvY + tvH * 0.85);
	cx.closePath();
	cx.fill();
	cx.restore();

	// ── LINEAR FIREPLACE (animated bonfire) below TV ──
	const fpX = mX + 12,
		fpY = fY - 54,
		fpW = featW - 24,
		fpH = 30;
	const baseY = fpY + fpH - 5;
	// firebox recess
	cx.fillStyle = "#0a0807";
	rr(fpX, fpY, fpW, fpH, 2);
	cx.fill();
	// flickering ember bed behind logs
	const emberFlick =
		0.82 + Math.sin(time * 0.006) * 0.1 + Math.sin(time * 0.013) * 0.06;
	const ember = cx.createLinearGradient(0, fpY + fpH, 0, fpY + 6);
	ember.addColorStop(0, `rgba(255,150,50,${emberFlick})`);
	ember.addColorStop(1, "rgba(120,30,0,0.18)");
	cx.fillStyle = ember;
	cx.fillRect(fpX + 2, fpY + 8, fpW - 4, fpH - 9);

	// animated flames — each tongue sways & breathes from a phase offset
	cx.save();
	cx.beginPath();
	cx.rect(fpX, fpY - 24, fpW, fpH + 24);
	cx.clip();
	const nFl = Math.max(6, Math.round(fpW / 8));
	for (let i = 0; i < nFl; i++) {
		const phase = i * 1.7;
		const flx = fpX + 6 + (i / (nFl - 1)) * (fpW - 12);
		// height & lateral sway driven by layered sines (looks organic)
		const breathe =
			0.7 +
			0.3 * Math.sin(time * 0.009 + phase) +
			0.15 * Math.sin(time * 0.021 + phase * 2.3);
		const flh = (10 + rnd(i + 20) * 12) * (0.7 + breathe * 0.6);
		const sway =
			Math.sin(time * 0.011 + phase) * 2.4 +
			Math.sin(time * 0.027 + phase) * 1.1;
		const tipX = flx + sway;
		const w = 3 + rnd(i + 4) * 1.6;
		// outer flame (orange)
		const fl = cx.createLinearGradient(flx, baseY, tipX, baseY - flh);
		fl.addColorStop(0, "rgba(255,205,90,0.95)");
		fl.addColorStop(0.45, "rgba(255,140,40,0.85)");
		fl.addColorStop(1, "rgba(255,80,20,0)");
		cx.fillStyle = fl;
		cx.beginPath();
		cx.moveTo(flx - w, baseY);
		cx.quadraticCurveTo(flx - w * 0.8, baseY - flh * 0.55, tipX, baseY - flh);
		cx.quadraticCurveTo(flx + w * 0.8, baseY - flh * 0.55, flx + w, baseY);
		cx.closePath();
		cx.fill();
		// inner core (hot yellow-white)
		const core = cx.createLinearGradient(flx, baseY, tipX, baseY - flh * 0.6);
		core.addColorStop(0, "rgba(255,240,180,0.95)");
		core.addColorStop(1, "rgba(255,180,60,0)");
		cx.fillStyle = core;
		cx.beginPath();
		cx.moveTo(flx - w * 0.45, baseY);
		cx.quadraticCurveTo(
			flx,
			baseY - flh * 0.4,
			flx + sway * 0.6,
			baseY - flh * 0.6,
		);
		cx.quadraticCurveTo(
			flx + w * 0.45,
			baseY - flh * 0.3,
			flx + w * 0.45,
			baseY,
		);
		cx.closePath();
		cx.fill();
	}
	cx.restore();

	// log bed (in front of flames)
	cx.fillStyle = "#2e2014";
	for (let i = 0; i < 5; i++) {
		const lx = fpX + 8 + i * ((fpW - 16) / 5);
		rr(lx, fpY + fpH - 7, (fpW - 16) / 5 - 3, 5, 2);
		cx.fill();
		// glowing underside
		cx.fillStyle = `rgba(255,120,40,${0.4 * emberFlick})`;
		cx.fillRect(lx, fpY + fpH - 3, (fpW - 16) / 5 - 3, 1.5);
		cx.fillStyle = "#2e2014";
	}

	// fire glow into the room — kept tight around the firebox so it never
	// bleeds up onto the TV (smaller radius, centered low on the fire)
	const glowPulse =
		0.78 + Math.sin(time * 0.009) * 0.16 + Math.sin(time * 0.019) * 0.08;
	const fglow = cx.createRadialGradient(
		featX,
		baseY + 4,
		4,
		featX,
		baseY + 4,
		78,
	);
	fglow.addColorStop(0, `rgba(255,150,60,${0.3 * glowPulse})`);
	fglow.addColorStop(0.5, `rgba(255,130,55,${0.1 * glowPulse})`);
	fglow.addColorStop(1, "rgba(255,150,60,0)");
	cx.fillStyle = fglow;
	cx.fillRect(featX - 84, fpY - 14, 168, 110);
	// very short warm uplight just on the marble lip above the firebox
	const upl = cx.createLinearGradient(0, fpY, 0, fpY - 16);
	upl.addColorStop(0, `rgba(255,150,70,${0.16 * glowPulse})`);
	upl.addColorStop(1, "rgba(255,150,70,0)");
	cx.fillStyle = upl;
	cx.fillRect(fpX, fpY - 16, fpW, 18);

	// ─────────────────────────────────────────────────────────
	// FLOOR-STANDING TOWER SPEAKERS (home-cinema, like the photo)
	// a slim gloss-black 3-driver tower on a plinth, one each side
	// of the marble feature, standing on the floor in front of glass
	// ─────────────────────────────────────────────────────────
	const drawTower = (txc: number, scale = 0.55, yOff = 0) => {
		const tw = 20 * scale,
			th = 116 * scale,
			ty = fY - th + 6 + yOff,
			tx = txc - tw / 2;
		// contact shadow on the floor
		cx.fillStyle = "rgba(0,0,0,0.22)";
		cx.beginPath();
		cx.ellipse(txc, ty + th + 2, tw * 1.2, 4 * scale + 2, 0, 0, Math.PI * 2);
		cx.fill();
		// plinth base
		cx.fillStyle = mix("#1a1a1e", "#0a0a0c");
		rr(tx - 4 * scale, ty + th - 2, tw + 8 * scale, 5 * scale + 1, 1.5);
		cx.fill();
		// gloss-black cabinet with side sheen
		const cab = cx.createLinearGradient(tx, 0, tx + tw, 0);
		cab.addColorStop(0, mix("#26262b", "#101012"));
		cab.addColorStop(0.5, mix("#141417", "#070708"));
		cab.addColorStop(0.78, mix("#34343c", "#16161a")); // specular highlight
		cab.addColorStop(1, mix("#0e0e10", "#050506"));
		cx.fillStyle = cab;
		rr(tx, ty, tw, th, 2.5 * scale);
		cx.fill();
		// top
		cx.fillStyle = mix("#2a2a30", "#141418");
		rr(tx, ty, tw, 3 * scale, 2 * scale);
		cx.fill();
		// drivers: tweeter + mid + two woofers down the baffle
		const cxm = txc;
		const driverYs = [
			ty + 16 * scale,
			ty + 38 * scale,
			ty + 66 * scale,
			ty + 94 * scale,
		];
		const driverR = [2.6 * scale, 5.5 * scale, 7 * scale, 7 * scale];
		driverYs.forEach((dy, i) => {
			// surround ring
			cx.fillStyle = mix("#3a3a40", "#1a1a1e");
			cx.beginPath();
			cx.ellipse(
				cxm,
				dy,
				driverR[i] + 1.4 * scale,
				driverR[i] + 1.4 * scale,
				0,
				0,
				Math.PI * 2,
			);
			cx.fill();
			// cone
			const cone = cx.createRadialGradient(
				cxm - driverR[i] * 0.3,
				dy - driverR[i] * 0.3,
				0.4,
				cxm,
				dy,
				driverR[i],
			);
			if (i === 0) {
				cone.addColorStop(0, "#cfcfce");
				cone.addColorStop(1, "#5a5a5c");
			} else {
				cone.addColorStop(0, mix("#b9a98c", "#6a6258"));
				cone.addColorStop(0.7, mix("#7a7064", "#3a352e"));
				cone.addColorStop(1, "#141414");
			}
			cx.fillStyle = cone;
			cx.beginPath();
			cx.ellipse(cxm, dy, driverR[i], driverR[i], 0, 0, Math.PI * 2);
			cx.fill();
			// dust cap / center
			cx.fillStyle = i === 0 ? "#e8e8e6" : "#0c0c0c";
			cx.beginPath();
			cx.ellipse(
				cxm,
				dy,
				driverR[i] * 0.28,
				driverR[i] * 0.28,
				0,
				0,
				Math.PI * 2,
			);
			cx.fill();
		});
		// thin front-edge gloss highlight
		cx.fillStyle = "rgba(255,255,255,0.06)";
		rr(tx + 1.5 * scale, ty + 2 * scale, 1.4 * scale, th - 6 * scale, 1);
		cx.fill();
		// subtle warm reflection from the fire on the gloss side
		cx.fillStyle = `rgba(255,150,70,${0.05 * glowPulse})`;
		rr(tx + tw - 5 * scale, ty + th * 0.3, 4 * scale, th * 0.5, 1);
		cx.fill();
	};
	// half-size towers, brought forward (lower on screen) and a bit toward the sofas
	drawTower(mX - 16, 0.55, 30); // snug against the left edge of the marble wall
	drawTower(mX + featW + 16, 0.55, 30); // snug against the right edge of the marble wall

	// ─────────────────────────────────────────────────────────
	// BACKLIT WALNUT BOOKSHELF (fills the left wall, like the photo)
	// ─────────────────────────────────────────────────────────
	const bsX = -M + 30,
		bsY = ceilY + 10,
		bsW = 150, // much wider — spans the left wall
		bsBot = fY - 2,
		bsH = bsBot - bsY;
	// walnut cabinet carcass with vertical grain shading
	for (let gx = bsX; gx < bsX + bsW; gx += 10) {
		const t = (gx - bsX) / bsW;
		const base = 70 + Math.sin(gx * 0.6) * 7;
		const wd = 1 - darkF * 0.55;
		cx.fillStyle = `rgb(${Math.round(base * wd)},${Math.round(base * 0.6 * wd)},${Math.round(base * 0.38 * wd)})`;
		cx.fillRect(gx, bsY, 10, bsH);
	}
	const rows = 6,
		cols = 4;
	const cellW = bsW / cols;
	const cellH = bsH / rows;
	const objCols = [
		"#8a5a3a",
		"#5a6a78",
		"#7a4a50",
		"#3a4a3a",
		"#9a8a6a",
		"#b0967a",
	];
	for (let r = 0; r < rows; r++) {
		for (let c = 0; c < cols; c++) {
			const cx0 = bsX + c * cellW;
			const cy0 = bsY + r * cellH;
			// recessed back panel + integrated warm LED (brighter)
			if (s.shelf > 0.01) {
				const bl = cx.createLinearGradient(cx0, cy0, cx0, cy0 + cellH);
				bl.addColorStop(0, `rgba(255,214,150,${0.72 * s.shelf})`);
				bl.addColorStop(1, `rgba(255,184,116,${0.34 * s.shelf})`);
				cx.fillStyle = bl;
			} else {
				cx.fillStyle = mix("#332518", "#120d08");
			}
			cx.fillRect(cx0 + 3, cy0 + 3, cellW - 6, cellH - 6);
			// bright LED strip line under each shelf lip
			if (s.shelf > 0.01) {
				cx.fillStyle = `rgba(255,236,195,${0.9 * s.shelf})`;
				cx.fillRect(cx0 + 4, cy0 + 4, cellW - 8, 1.2);
			}
			// staged objects per cell (deterministic): books, vase, sculpture, plant
			const kind = Math.floor(rnd(r * 13 + c * 7) * 4);
			const innerL = cx0 + 6,
				innerR = cx0 + cellW - 6,
				floor = cy0 + cellH - 4;
			if (kind === 0) {
				// stack of books
				let ox = innerL;
				while (ox < innerR - 3) {
					const bw = 3 + rnd(r * 9 + ox) * 4;
					const bh = cellH * (0.4 + rnd(r * 7 + ox) * 0.42);
					cx.fillStyle = mix(
						objCols[Math.floor(rnd(r + ox + c) * objCols.length)],
						"#241f1a",
					);
					cx.fillRect(ox, floor - bh, bw, bh);
					ox += bw + 1.4;
				}
			} else if (kind === 1) {
				// vase / vessel
				const vw = cellW * 0.28;
				cx.fillStyle = mix("#cabfa8", "#2a2620");
				rr(cx0 + cellW / 2 - vw / 2, floor - cellH * 0.5, vw, cellH * 0.5, {
					upperLeft: vw / 2,
					upperRight: vw / 2,
				});
				cx.fill();
			} else if (kind === 2) {
				// horizontal books + small sculpture
				cx.fillStyle = mix("#7a6450", "#241f1a");
				cx.fillRect(innerL, floor - 5, cellW * 0.5, 5);
				cx.fillStyle = mix("#b8a98c", "#2e2a22");
				cx.beginPath();
				cx.arc(innerR - 6, floor - 5, 4, 0, Math.PI * 2);
				cx.fill();
			} else {
				// small plant
				cx.fillStyle = mix("#a89a82", "#2a2620");
				cx.fillRect(cx0 + cellW / 2 - 4, floor - 6, 8, 6);
				cx.fillStyle = mix("#5f7a55", "#26331f");
				for (let k = -2; k <= 2; k++) {
					cx.beginPath();
					cx.moveTo(cx0 + cellW / 2, floor - 6);
					cx.quadraticCurveTo(
						cx0 + cellW / 2 + k * 4,
						floor - 14,
						cx0 + cellW / 2 + k * 6,
						floor - 18,
					);
					cx.lineWidth = 1.2;
					cx.strokeStyle = mix("#5f7a55", "#26331f");
					cx.stroke();
				}
			}
			// shelf board (front lip)
			cx.fillStyle = mix("#4a3826", "#15100b");
			cx.fillRect(cx0, cy0 + cellH - 2.5, cellW, 2.5);
		}
	}
	// vertical dividers
	cx.fillStyle = mix("#3e2e1d", "#120d08");
	for (let c = 0; c <= cols; c++) {
		cx.fillRect(bsX + c * cellW - 1, bsY, 2, bsH);
	}
	// brighter warm glow spilling into the room from the shelf
	if (s.shelf > 0.02) {
		const sp = cx.createLinearGradient(bsX + bsW, 0, bsX + bsW + 80, 0);
		sp.addColorStop(0, `rgba(255,206,150,${0.28 * s.shelf})`);
		sp.addColorStop(1, "rgba(255,206,150,0)");
		cx.fillStyle = sp;
		cx.fillRect(bsX + bsW, bsY, 80, bsH);
	}

	// ─────────────────────────────────────────────────────────
	// FLOOR (warm oak, perspective) + area rug
	// ─────────────────────────────────────────────────────────
	const fg = cx.createLinearGradient(0, fY, 0, H + M);
	fg.addColorStop(0, s.fT);
	fg.addColorStop(1, s.fB);
	cx.fillStyle = fg;
	cx.fillRect(-M, fY, W + 2 * M, H - fY + M);
	// plank seams converging
	cx.strokeStyle = "rgba(0,0,0,0.07)";
	cx.lineWidth = 0.5;
	for (let i = -6; i <= 6; i++) {
		const fxx = featX + i * 40;
		cx.beginPath();
		cx.moveTo(featX + i * 9, fY);
		cx.lineTo(fxx, H + M);
		cx.stroke();
	}
	for (let i = 1; i < 6; i++) {
		const y = fY + (H + M - fY) * Math.pow(i / 6, 1.7);
		cx.beginPath();
		cx.moveTo(-M, y);
		cx.lineTo(W + M, y);
		cx.stroke();
	}
	// fireplace warm wash on floor
	const fwash = cx.createLinearGradient(featX, fY, featX, H);
	fwash.addColorStop(0, "rgba(255,150,70,0.14)");
	fwash.addColorStop(1, "rgba(255,150,70,0)");
	cx.fillStyle = fwash;
	cx.beginPath();
	cx.moveTo(featX - 60, fY);
	cx.lineTo(featX + 60, fY);
	cx.lineTo(featX + 130, H);
	cx.lineTo(featX - 130, H);
	cx.closePath();
	cx.fill();
	// large rectangular cream rug (perspective trapezoid, like the photo)
	const rugTopY = fY + 14,
		rugBotY = H + 30;
	cx.fillStyle = mix("rgba(216,200,172,0.55)", "rgba(42,36,30,0.55)");
	cx.beginPath();
	cx.moveTo(featX - 150, rugTopY);
	cx.lineTo(featX + 150, rugTopY);
	cx.lineTo(featX + 230, rugBotY);
	cx.lineTo(featX - 230, rugBotY);
	cx.closePath();
	cx.fill();
	// soft pile texture (stipple)
	cx.save();
	cx.beginPath();
	cx.moveTo(featX - 150, rugTopY);
	cx.lineTo(featX + 150, rugTopY);
	cx.lineTo(featX + 230, rugBotY);
	cx.lineTo(featX - 230, rugBotY);
	cx.closePath();
	cx.clip();
	cx.fillStyle = mix("rgba(255,250,238,0.22)", "rgba(70,62,52,0.2)");
	for (let i = 0; i < 240; i++) {
		const px = ln(featX - 220, featX + 220, rnd(i + 3));
		const py = ln(rugTopY, rugBotY, rnd(i + 90));
		cx.fillRect(px, py, 0.8, 1.6);
	}
	cx.restore();
	cx.strokeStyle = mix("rgba(180,160,130,0.35)", "rgba(70,60,50,0.35)");
	cx.lineWidth = 1;
	cx.beginPath();
	cx.moveTo(featX - 142, rugTopY + 5);
	cx.lineTo(featX + 142, rugTopY + 5);
	cx.lineTo(featX + 218, rugBotY - 6);
	cx.lineTo(featX - 218, rugBotY - 6);
	cx.closePath();
	cx.stroke();

	// ─────────────────────────────────────────────────────────
	// TWO DARK LEATHER SOFAS in perspective, facing each other
	// (left sofa faces right, right sofa faces left — parallel, receding
	//  along each side wall toward the camera, like the reference photo)
	// ─────────────────────────────────────────────────────────
	const leatherTop = mix("#54565c", "#26262c");
	const leatherMid = mix("#42444a", "#1c1c22");
	const leatherDk = mix("#303238", "#141418");
	const leatherFront = mix("#3a3c42", "#18181d");

	// perspective projection along the room's depth axis.
	// t: 0 = far (back wall), 1 = near (foreground / camera)
	// u: across room, -1 = left wall, +1 = right wall
	// h: height above floor in design px (lifted, scaled by depth)
	const floorY = (t: number) => ln(fY - 2, H + 46, t);
	const halfW = (t: number) => ln(W * 0.32, W * 0.92, t);
	const hScale = (t: number) => ln(0.5, 1.5, t);
	const proj = (u: number, t: number, h = 0) => ({
		x: featX + u * halfW(t),
		y: floorY(t) - h * hScale(t),
	});
	const quad = (
		pts: { x: number; y: number }[],
		fill: string | CanvasGradient,
		stroke?: string,
	) => {
		cx.beginPath();
		cx.moveTo(pts[0].x, pts[0].y);
		for (let i = 1; i < pts.length; i++) cx.lineTo(pts[i].x, pts[i].y);
		cx.closePath();
		cx.fillStyle = fill;
		cx.fill();
		if (stroke) {
			cx.strokeStyle = stroke;
			cx.lineWidth = 0.5;
			cx.stroke();
		}
	};

	const drawSofa = (sideSign: number) => {
		// sideSign: -1 = left sofa (seat faces +, i.e. right), +1 = right sofa
		const sgn = sideSign;
		// footprint across the room (u): outer (against wall) -> inner (seat front)
		const uOuter = sgn * 0.98; // outer back of sofa (against side wall)
		const uBackFront = sgn * 0.78; // front face of backrest
		const uSeatFront = sgn * 0.4; // seat front edge (faces center)
		const tB = 0.14, // far end (near fireplace/back)
			tF = 1.02; // near end (foreground)
		const seatH = 22, // seat top height
			backH = 60, // backrest top height
			armH = 44;

		// helper to make a point
		const P = (u: number, t: number, h = 0) => proj(u, t, h);

		// ── contact shadow on the floor ──
		cx.fillStyle = "rgba(0,0,0,0.26)";
		quad(
			[
				P(uOuter, tB),
				P(uSeatFront, tB),
				P(uSeatFront + sgn * 0.04, tF),
				P(uOuter, tF),
			],
			"rgba(0,0,0,0.26)",
		);

		// ── SEAT BLOCK ──
		// seat front vertical face (faces center) — the big visible leather face
		const seatFrontGrad = cx.createLinearGradient(
			P(uSeatFront, tB).x,
			P(uSeatFront, tB, seatH).y,
			P(uSeatFront, tF).x,
			P(uSeatFront, tF).y,
		);
		seatFrontGrad.addColorStop(0, leatherMid);
		seatFrontGrad.addColorStop(1, leatherFront);
		quad(
			[
				P(uSeatFront, tB, seatH),
				P(uSeatFront, tF, seatH),
				P(uSeatFront, tF, 0),
				P(uSeatFront, tB, 0),
			],
			seatFrontGrad,
			"rgba(0,0,0,0.25)",
		);
		// seat top surface
		const seatTopGrad = cx.createLinearGradient(
			P(uSeatFront, tB, seatH).x,
			P(uSeatFront, tB, seatH).y,
			P(uBackFront, tF, seatH).x,
			P(uBackFront, tF, seatH).y,
		);
		seatTopGrad.addColorStop(0, leatherTop);
		seatTopGrad.addColorStop(1, leatherMid);
		quad(
			[
				P(uSeatFront, tB, seatH),
				P(uBackFront, tB, seatH),
				P(uBackFront, tF, seatH),
				P(uSeatFront, tF, seatH),
			],
			seatTopGrad,
		);

		// ── seat cushions on the top (receding) ──
		const nC = 4;
		for (let i = 0; i < nC; i++) {
			const ta = ln(tB + 0.04, tF - 0.04, i / nC);
			const tb = ln(tB + 0.04, tF - 0.04, (i + 0.92) / nC);
			const cg2 = cx.createLinearGradient(
				P(uSeatFront, ta, seatH).x,
				P(uSeatFront, ta, seatH).y,
				P(uBackFront, tb, seatH).x,
				P(uBackFront, tb, seatH).y,
			);
			cg2.addColorStop(0, leatherTop);
			cg2.addColorStop(1, leatherMid);
			quad(
				[
					P(uSeatFront, ta, seatH + 4),
					P(uBackFront, ta, seatH + 4),
					P(uBackFront, tb, seatH + 4),
					P(uSeatFront, tb, seatH + 4),
				],
				cg2,
				"rgba(0,0,0,0.18)",
			);
		}

		// ── BACKREST BLOCK (against the wall) ──
		// backrest front face (faces center)
		const backFrontGrad = cx.createLinearGradient(
			P(uBackFront, tB, backH).x,
			P(uBackFront, tB, backH).y,
			P(uBackFront, tF, 0).x,
			P(uBackFront, tF, 0).y,
		);
		backFrontGrad.addColorStop(0, leatherTop);
		backFrontGrad.addColorStop(1, leatherMid);
		quad(
			[
				P(uBackFront, tB, backH),
				P(uBackFront, tF, backH),
				P(uBackFront, tF, seatH - 2),
				P(uBackFront, tB, seatH - 2),
			],
			backFrontGrad,
		);
		// backrest top
		quad(
			[
				P(uBackFront, tB, backH),
				P(uOuter, tB, backH),
				P(uOuter, tF, backH),
				P(uBackFront, tF, backH),
			],
			leatherDk,
		);
		// back cushions (receding) on the backrest face
		for (let i = 0; i < nC; i++) {
			const ta = ln(tB + 0.04, tF - 0.04, i / nC);
			const tb = ln(tB + 0.04, tF - 0.04, (i + 0.92) / nC);
			quad(
				[
					P(uBackFront - sgn * 0.02, ta, backH - 2),
					P(uBackFront - sgn * 0.02, tb, backH - 2),
					P(uBackFront - sgn * 0.02, tb, seatH + 2),
					P(uBackFront - sgn * 0.02, ta, seatH + 2),
				],
				leatherTop,
				"rgba(0,0,0,0.18)",
			);
		}

		// ── NEAR ARMREST (foreground end cap) ──
		const armGrad = cx.createLinearGradient(
			P(uOuter, tF, armH).x,
			P(uOuter, tF, armH).y,
			P(uSeatFront, tF, 0).x,
			P(uSeatFront, tF, 0).y,
		);
		armGrad.addColorStop(0, leatherTop);
		armGrad.addColorStop(1, leatherFront);
		quad(
			[
				P(uOuter, tF, armH),
				P(uSeatFront, tF, armH),
				P(uSeatFront, tF, 0),
				P(uOuter, tF, 0),
			],
			armGrad,
			"rgba(0,0,0,0.22)",
		);
		// arm top rounded highlight
		cx.fillStyle = "rgba(255,255,255,0.05)";
		quad(
			[
				P(uOuter, tF, armH),
				P(uSeatFront, tF, armH),
				P(uSeatFront, tF - 0.04, armH),
				P(uOuter, tF - 0.04, armH),
			],
			"rgba(255,255,255,0.05)",
		);

		// ── throw pillows seated against the backrest, receding ──
		const pillowCols = ["#c2b393", "#a89c80", "#d8cdb3", "#9a8e74"];
		for (let i = 0; i < 5; i++) {
			const tp = ln(tB + 0.08, tF - 0.16, i / 4);
			const pc = P(ln(uBackFront, uSeatFront, 0.32), tp, seatH + 4);
			const sc = hScale(tp);
			cx.fillStyle = mix(pillowCols[i % pillowCols.length], "#2e2a22");
			rr(pc.x - 13 * sc, pc.y - 22 * sc, 24 * sc, 22 * sc, 5 * sc);
			cx.fill();
			cx.strokeStyle = "rgba(0,0,0,0.12)";
			cx.lineWidth = 0.5;
			rr(pc.x - 13 * sc, pc.y - 22 * sc, 24 * sc, 22 * sc, 5 * sc);
			cx.stroke();
		}

		// ── draped throw on the near end of the right sofa (like the photo) ──
		if (sgn > 0) {
			const dp = P(ln(uBackFront, uSeatFront, 0.5), tF - 0.12, seatH + 4);
			const sc = hScale(tF - 0.12);
			cx.fillStyle = mix("#b3a78c", "#332f27");
			rr(dp.x - 10 * sc, dp.y - 10 * sc, 20 * sc, 40 * sc, 4 * sc);
			cx.fill();
		}

		// ── warm fire reflection on the seat-front leather (static) ──
		cx.fillStyle = "rgba(255,140,60,0.05)";
		quad(
			[
				P(uSeatFront, 0.4, seatH),
				P(uSeatFront, 0.8, seatH),
				P(uSeatFront, 0.8, 4),
				P(uSeatFront, 0.4, 4),
			],
			"rgba(255,140,60,0.05)",
		);

		// tapered legs at the near corners
		cx.strokeStyle = mix("#1a1a1e", "#0a0a0c");
		cx.lineWidth = 2;
		[uOuter, uSeatFront].forEach((u) => {
			const top = P(u, tF, 0);
			const bot = P(u, tF + 0.02, 0);
			cx.beginPath();
			cx.moveTo(top.x, top.y);
			cx.lineTo(bot.x, bot.y + 5);
			cx.stroke();
		});
	};
	drawSofa(-1); // left sofa, faces right
	drawSofa(1); // right sofa, faces left

	// ─────────────────────────────────────────────────────────
	// BLACK MARBLE & POLISHED-METAL COFFEE TABLE (centered in the room)
	// two-tier: thick marble top + lower glass shelf on a visible metal frame
	// ─────────────────────────────────────────────────────────
	const ctW = 132,
		ctTopH = 9, // marble top thickness
		ctX = featX - ctW / 2,
		ctY = fY + 40, // lowered into the central conversation area (off the fireplace)
		legH = 26, // visible leg height
		shelfY = ctY + ctTopH + legH * 0.58; // lower shelf position

	// floor contact shadow (soft, under the whole footprint)
	cx.fillStyle = "rgba(0,0,0,0.26)";
	cx.beginPath();
	cx.ellipse(featX, ctY + ctTopH + legH + 4, ctW * 0.6, 11, 0, 0, Math.PI * 2);
	cx.fill();

	// ── polished metal frame legs (4, with perspective splay) ──
	const legW = 3.5;
	const legGrad = (x: number) => {
		const g = cx.createLinearGradient(x, 0, x + legW, 0);
		g.addColorStop(0, mix("#9a958c", "#3a3a40"));
		g.addColorStop(0.5, mix("#d8d2c6", "#5a5a62")); // chrome highlight
		g.addColorStop(1, mix("#6a665e", "#222228"));
		return g;
	};
	// back legs (slightly inset, drawn first)
	[ctX + 16, ctX + ctW - 16 - legW].forEach((lx) => {
		cx.fillStyle = legGrad(lx);
		cx.fillRect(lx, ctY + ctTopH - 2, legW, legH);
	});
	// lower glass/metal shelf (between legs)
	cx.fillStyle = "rgba(150,160,168,0.22)";
	rr(ctX + 14, shelfY, ctW - 28, 4, 1);
	cx.fill();
	cx.fillStyle = "rgba(255,255,255,0.06)";
	cx.fillRect(ctX + 16, shelfY + 0.5, ctW - 32, 1);
	// a couple of stacked design books on the lower shelf
	cx.fillStyle = mix("#b84a3a", "#3a1e18");
	rr(ctX + 24, shelfY - 5, 30, 5, 1);
	cx.fill();
	cx.fillStyle = mix("#d8d2c6", "#2a2620");
	rr(ctX + 27, shelfY - 9, 26, 4, 1);
	cx.fill();
	// front legs (drawn after shelf so they read in front)
	[ctX + 12, ctX + ctW - 12 - legW].forEach((lx) => {
		cx.fillStyle = legGrad(lx);
		cx.fillRect(lx, ctY + ctTopH - 2, legW, legH + 3);
		// little foot
		cx.fillStyle = mix("#2a2a30", "#141418");
		cx.fillRect(lx - 0.5, ctY + ctTopH + legH, legW + 1, 2);
	});

	// ── thick polished-black marble top with veining + bevel ──
	// side edge (gives the top real thickness)
	cx.fillStyle = "#050406";
	rr(ctX, ctY + ctTopH - 4, ctW, 5, 1);
	cx.fill();
	// top surface
	const topG = cx.createLinearGradient(ctX, ctY, ctX, ctY + ctTopH);
	topG.addColorStop(0, "#22201f");
	topG.addColorStop(0.5, "#0e0c0d");
	topG.addColorStop(1, "#070608");
	cx.fillStyle = topG;
	rr(ctX, ctY, ctW, ctTopH, 2);
	cx.fill();
	// marble veining on the top
	cx.save();
	cx.beginPath();
	cx.rect(ctX, ctY, ctW, ctTopH);
	cx.clip();
	for (let i = 0; i < 6; i++) {
		cx.strokeStyle = `rgba(200,195,188,${0.1 + rnd(i + 30) * 0.12})`;
		cx.lineWidth = 0.5 + rnd(i + 5) * 0.8;
		const sx = ctX + rnd(i) * ctW;
		cx.beginPath();
		cx.moveTo(sx, ctY);
		cx.bezierCurveTo(
			sx + 14,
			ctY + 3,
			sx - 10,
			ctY + 6,
			sx + (rnd(i + 2) - 0.5) * 30,
			ctY + ctTopH,
		);
		cx.stroke();
	}
	cx.restore();
	// bright edge highlight + specular streak (polished sheen)
	cx.fillStyle = "rgba(255,255,255,0.14)";
	cx.fillRect(ctX + 4, ctY + 1, ctW - 8, 1.4);
	cx.fillStyle = "rgba(255,255,255,0.06)";
	cx.fillRect(ctX + ctW * 0.12, ctY + 3.5, ctW * 0.3, 2);
	// warm fire reflection on the polished top (static)
	cx.fillStyle = "rgba(255,140,60,0.1)";
	cx.fillRect(ctX + ctW * 0.34, ctY + 2.5, ctW * 0.34, 3.5);

	// ── decor on top: stacked books, vase of hydrangea, candle ──
	// CHANEL-style stacked coffee-table books
	cx.fillStyle = mix("#d8d2c6", "#2a2620");
	rr(ctX + 14, ctY - 6, 36, 6, 1);
	cx.fill();
	cx.fillStyle = mix("#16140f", "#0a0908");
	rr(ctX + 17, ctY - 10, 32, 5, 1);
	cx.fill();
	// tiny title bar suggestion on the spine
	cx.fillStyle = "rgba(210,205,195,0.6)";
	cx.fillRect(ctX + 24, ctY - 8, 14, 0.8);
	// glass vase + white hydrangea (center)
	cx.fillStyle = "rgba(180,195,205,0.28)";
	rr(featX - 10, ctY - 15, 20, 15, 3);
	cx.fill();
	cx.fillStyle = "rgba(255,255,255,0.1)";
	cx.fillRect(featX - 7, ctY - 14, 2, 12);
	const fl = ["#f2f0ea", "#e8e6df", "#dcdad2"];
	for (let i = 0; i < 18; i++) {
		const a = rnd(i + 60) * Math.PI * 2;
		const r2 = rnd(i + 70) * 11;
		cx.fillStyle = mix(fl[i % 3], "#5a5650");
		cx.beginPath();
		cx.arc(
			featX + Math.cos(a) * r2,
			ctY - 20 + Math.sin(a) * r2 * 0.7,
			2.9,
			0,
			Math.PI * 2,
		);
		cx.fill();
	}
	// small candle on the table (static)
	const cdX = ctX + ctW - 24;
	cx.fillStyle = mix("#2a2622", "#0e0c10");
	rr(cdX, ctY - 9, 7, 9, 1);
	cx.fill();
	cx.fillStyle = "rgba(255,190,90,0.85)";
	cx.beginPath();
	cx.ellipse(cdX + 3.5, ctY - 11, 1.4, 3, 0, 0, Math.PI * 2);
	cx.fill();

	// (round side table with candle removed — it read as floating near the sofa)

	// ─────────────────────────────────────────────────────────
	// GLOBAL LIGHTING / ATMOSPHERE
	// ─────────────────────────────────────────────────────────
	if (s.br > 0.1) {
		const amb = cx.createRadialGradient(
			featX,
			fY * 0.5,
			30,
			featX,
			fY * 0.62,
			W * 0.85,
		);
		amb.addColorStop(0, `rgba(${s.aR},${s.aG},${s.aB},${s.br * 0.12})`);
		amb.addColorStop(1, "rgba(0,0,0,0)");
		cx.fillStyle = amb;
		cx.fillRect(-M, -M, W + 2 * M, H + 2 * M);
	}
	// depth vignette
	const vig = cx.createRadialGradient(
		featX,
		fY * 0.7,
		W * 0.38,
		featX,
		fY * 0.7,
		W * 0.9,
	);
	vig.addColorStop(0, "rgba(0,0,0,0)");
	vig.addColorStop(1, "rgba(0,0,0,0.2)");
	cx.fillStyle = vig;
	cx.fillRect(-M, -M, W + 2 * M, H + 2 * M);
	// night darkening
	if (s.br < 0.3) {
		cx.fillStyle = `rgba(10,8,22,${(0.3 - s.br) * 0.8})`;
		cx.fillRect(-M, -M, W + 2 * M, H + 2 * M);
	}
}

export default function RoomAutomation() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [scene, setScene] = useState<Scene>("relax");
	const [tvOn, setTvOn] = useState(false);
	const [closed, setClosed] = useState(false);
	const [transitioning, setTransitioning] = useState(false);
	const [ceilOn, setCeilOn] = useState(true);
	const [shelfOn, setShelfOn] = useState(true);

	const animRef = useRef<number | null>(null);
	const curS = useRef<DrawState>({
		...SCENES.relax,
		shade: 0,
		ceil: 1,
		shelf: 1,
	});
	const tvRef = useRef(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const loopRef = useRef<number | null>(null);
	const timeRef = useRef(0);
	// optional manual override for testing specific times; null = use real clock
	const [demoHour, setDemoHour] = useState<number | null>(null);
	const demoRef = useRef<number | null>(null);
	demoRef.current = demoHour;

	// current local hour as a fractional number (e.g. 13.5 = 1:30pm)
	function currentHour() {
		if (demoRef.current != null) return demoRef.current;
		const d = new Date();
		return d.getHours() + d.getMinutes() / 60;
	}

	function render() {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = window.devicePixelRatio || 1;
		const cw = canvas.clientWidth || W;
		const ch = canvas.clientHeight || H;

		const needW = Math.round(cw * dpr);
		const needH = Math.round(ch * dpr);
		if (canvas.width !== needW || canvas.height !== needH) {
			canvas.width = needW;
			canvas.height = needH;
		}

		ctx.setTransform(1, 0, 0, 1, 0, 0);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const ZOOM = 0.7;
		const scale = Math.max(cw / W, ch / H) * ZOOM;
		const offX = (cw - W * scale) / 2;
		const offY = Math.max(0, (ch - H * scale) / 2);
		ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offX * dpr, offY * dpr);

		drawRoom(
			ctx,
			curS.current,
			tvRef.current,
			videoRef.current,
			timeRef.current,
			currentHour(),
		);
	}

	// single persistent loop: keeps the fire alive every frame and paints
	// whatever curS currently holds (scene/shade tweens just mutate curS).
	function loop(ts: number) {
		timeRef.current = ts;
		render();
		loopRef.current = requestAnimationFrame(loop);
	}

	function startAnim(newTo: Partial<DrawState>, onDone?: () => void) {
		const fromS: DrawState = { ...curS.current };
		const toS: DrawState = { ...fromS, ...newTo };
		const start = timeRef.current;
		if (animRef.current) cancelAnimationFrame(animRef.current);
		function tick() {
			const t = Math.min((timeRef.current - start) / DUR, 1);
			curS.current = blend(fromS, toS, ease(t));
			if (t < 1) {
				animRef.current = requestAnimationFrame(tick);
			} else {
				curS.current = { ...toS };
				animRef.current = null;
				onDone?.();
			}
		}
		animRef.current = requestAnimationFrame(tick);
	}

	useEffect(() => {
		loopRef.current = requestAnimationFrame(loop);
		const canvas = canvasRef.current;
		let ro: ResizeObserver | undefined;
		if (canvas && typeof ResizeObserver !== "undefined") {
			ro = new ResizeObserver(() => render());
			ro.observe(canvas);
		}
		return () => {
			if (animRef.current) cancelAnimationFrame(animRef.current);
			if (loopRef.current) cancelAnimationFrame(loopRef.current);
			if (ro) ro.disconnect();
		};
	}, []);

	function handleScene(s: Scene) {
		if (transitioning || s === scene) return;
		setScene(s);
		setTransitioning(true);
		startAnim(
			{
				...SCENES[s],
				shade: curS.current.shade,
				ceil: curS.current.ceil,
				shelf: curS.current.shelf,
			},
			() => setTransitioning(false),
		);
	}

	useEffect(() => {
		tvRef.current = tvOn;

		const video = videoRef.current;
		if (video) {
			if (tvOn) {
				video.currentTime = 0;
				void video.play().catch(() => {});
			} else {
				video.pause();
				video.currentTime = 0;
			}
		}
	}, [tvOn]);

	useEffect(() => {
		if (transitioning) return;
		setTransitioning(true);
		startAnim({ ceil: ceilOn ? 1 : 0 }, () => setTransitioning(false));
	}, [ceilOn]);

	useEffect(() => {
		if (transitioning) return;
		setTransitioning(true);
		startAnim({ shelf: shelfOn ? 1 : 0 }, () => setTransitioning(false));
	}, [shelfOn]);

	useEffect(() => {
		if (transitioning) return;
		setTransitioning(true);
		startAnim({ shade: closed ? 100 : 0 }, () => setTransitioning(false));
	}, [closed]);

	const time = new Date();

	const hours = time.getHours();
	const minutes = time.getMinutes();

	const formattedHours = hours % 12 || 12;
	const formattedMinutes = minutes.toString().padStart(2, "0");
	const period = hours < 12 ? "AM" : "PM";

	return (
		<div className={styles.root}>
			<canvas ref={canvasRef} className={styles.canvas} />
			<video
				ref={videoRef}
				src="/tv-video.mp4"
				muted
				loop
				playsInline
				preload="auto"
				crossOrigin="anonymous"
				style={{
					position: "absolute",
					width: 1,
					height: 1,
					opacity: 0,
					pointerEvents: "none",
				}}
			/>
			<div className={styles.panel}>
				<div className={styles.sec}>
					<div
						style={{
							paddingBottom: "10px",
							display: "flex",
							justifyContent: "space-between",
							fontSize: "1.125rem",
							fontWeight: 500,
						}}
					>
						<p>Living Room</p>
						<p>
							{formattedHours}
							<span className={styles["panel-time-colon"]}>:</span>
							{formattedMinutes} {period}
						</p>
					</div>
					<p style={{ marginBottom: "5px" }}>Scenes</p>
					<div className={styles.sbns}>
						{(Object.keys(SCENE_META) as Scene[]).map((sk) => (
							<button
								key={sk}
								className={`${styles.sbn} ${scene === sk ? styles.on : ""}`}
								style={
									{
										"--ac": SCENE_META[sk].color,
										"--ac-bg": SCENE_META[sk].bg,
									} as React.CSSProperties
								}
								disabled={transitioning}
								aria-busy={transitioning}
								onClick={() => handleScene(sk)}
							>
								<span
									className={styles.dot}
									style={{ background: SCENE_META[sk].dot }}
								/>
								{SCENE_META[sk].label}
							</button>
						))}
					</div>
				</div>
				<div
					style={{
						display: "flex",
						flexWrap: "wrap",
						gap: "5px",
					}}
				>
					<button
						style={{
							display: "flex",
							flexDirection: "column",
							flex: "1",
						}}
						onClick={() => setCeilOn((prev) => !prev)}
						className={`btn ${ceilOn ? "btn--active" : ""}`}
						type="button"
						disabled={transitioning}
					>
						<LightbulbIcon />
						<span>{ceilOn ? "On" : "Off"}</span>
					</button>
					<button
						style={{
							display: "flex",
							flexDirection: "column",
							flex: "1",
							whiteSpace: "nowrap",
						}}
						type="button"
						onClick={() => setShelfOn((prev) => !prev)}
						className={`btn ${shelfOn ? "btn--active" : ""}`}
						disabled={transitioning}
					>
						<span>Shelf Light</span>
						<span>{shelfOn ? "On" : "Off"}</span>
					</button>
					<button
						style={{ display: "flex", flexDirection: "column", flex: "1" }}
						className={`btn ${tvOn ? "btn--active" : ""}`}
						onClick={() => setTvOn((prev) => !prev)}
						type="button"
						disabled={transitioning}
					>
						<TvIcon />
						<span>{tvOn ? "On" : "Off"}</span>
					</button>
					<button
						style={{ display: "flex", flexDirection: "column", flex: "1" }}
						className={`btn ${closed ? "btn--active" : ""}`}
						onClick={() => setClosed((prev) => !prev)}
						type="button"
						disabled={transitioning}
					>
						<span>Shades</span>
						<span>{closed ? "Closed" : "Opened"}</span>
					</button>
				</div>
			</div>
		</div>
	);
}
