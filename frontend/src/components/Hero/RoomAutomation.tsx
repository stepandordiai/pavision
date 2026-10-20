"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import TemperatureHalfIcon from "../icons/TemperatureHalfIcon";
import styles from "./RoomAutomation.module.scss";

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
	relax: { label: "relax", color: "#854f0b", dot: "#ba7517", bg: "#faeeda" },
	bright: { label: "bright", color: "#0c447c", dot: "#185fa5", bg: "#e6f1fb" },
	cinema: { label: "cinema", color: "#3c3489", dot: "#534ab7", bg: "#eeedfe" },
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

		// ── STATIC DAYLIGHT LANDSCAPE (no animation, no sun, no night) ──
		// Everything uses absolute canvas x, so the mountains, hills and the
		// forest line continue seamlessly from the left window to the right one.
		const hz = (k: number) => winTop + winH * k; // y at a fraction of the window height

		// soft, hazy daylight sky — deeper blue up top, pale toward the horizon
		const sky = cx.createLinearGradient(0, winTop, 0, hz(0.7));
		sky.addColorStop(0, "#6fa6d8");
		sky.addColorStop(0.55, "#a9cbe8");
		sky.addColorStop(1, "#dfe9ee");
		cx.fillStyle = sky;
		cx.fillRect(wx, winTop, ww, winH);

		// a few soft, high clouds
		for (let i = 0; i < 7; i++) {
			const cxw = wx + rnd(i * 3 + (flip ? 90 : 10)) * ww;
			const cyw = hz(0.06 + rnd(i * 5 + 3) * 0.22);
			const cwd = 14 + rnd(i * 7 + 1) * 26;
			for (let k = 0; k < 5; k++) {
				const px = cxw + (k - 2) * cwd * 0.22 + (rnd(i * 11 + k) - 0.5) * 4;
				const py = cyw + (rnd(i * 13 + k) - 0.5) * 3;
				const pr = cwd * (0.18 + rnd(i * 17 + k) * 0.16);
				const cl = cx.createRadialGradient(px, py - pr * 0.3, 0, px, py, pr);
				cl.addColorStop(0, "rgba(255,255,255,0.55)");
				cl.addColorStop(0.6, "rgba(250,252,255,0.22)");
				cl.addColorStop(1, "rgba(245,250,255,0)");
				cx.fillStyle = cl;
				cx.beginPath();
				cx.ellipse(px, py, pr * 1.6, pr, 0, 0, Math.PI * 2);
				cx.fill();
			}
		}

		// ridged multi-octave noise → natural, peaky mountain silhouettes (0..1)
		const ridge = (x: number, seed: number) => {
			let v = 0,
				a = 0.5,
				f = 0.012,
				n = 0;
			for (let k = 0; k < 5; k++) {
				v += (1 - Math.abs(Math.sin(x * f + seed + k * 2.13))) * a;
				n += a;
				a *= 0.5;
				f *= 2.1;
			}
			return v / n;
		};
		// smooth rolling hills (0..1)
		const hills = (x: number) =>
			0.5 +
			0.25 * Math.sin(x * 0.021 + 1.1) +
			0.15 * Math.sin(x * 0.047 + 2.4) +
			0.1 * Math.sin(x * 0.11 + 0.3);

		// draws one landform layer: faceted relief shading (lit from the left),
		// optional snow on the peaks and atmospheric haze toward its base
		const drawRange = (
			baseK: number,
			heightK: number,
			fn: (x: number) => number,
			lightC: number[],
			darkC: number[],
			haze: number,
			snow = 0,
		) => {
			const base = hz(baseK),
				hMax = winH * heightK,
				step = 1;
			const yAt = (x: number) => base - fn(x) * hMax;
			let prevY = yAt(wx - 2 * step);
			for (let x = wx - step; x <= wx + ww + step; x += step) {
				const y = yAt(x);
				const lightAmt = Math.max(
					0,
					Math.min(1, 0.5 - ((y - prevY) / step) * 0.8),
				);
				prevY = y;
				cx.fillStyle = `rgb(${Math.round(ln(darkC[0], lightC[0], lightAmt))},${Math.round(
					ln(darkC[1], lightC[1], lightAmt),
				)},${Math.round(ln(darkC[2], lightC[2], lightAmt))})`;
				cx.fillRect(x, y, step + 0.5, winBot - y);
			}
			cx.save();
			cx.beginPath();
			cx.moveTo(wx - step, winBot);
			for (let x = wx - step; x <= wx + ww + step; x += step)
				cx.lineTo(x, yAt(x));
			cx.lineTo(wx + ww + step, winBot);
			cx.closePath();
			cx.clip();
			const top = base - hMax;
			if (snow > 0) {
				const sg = cx.createLinearGradient(0, top, 0, top + hMax * 0.28);
				sg.addColorStop(0, `rgba(250,252,255,${0.8 * snow})`);
				sg.addColorStop(0.55, `rgba(240,245,250,${0.3 * snow})`);
				sg.addColorStop(1, "rgba(240,245,250,0)");
				cx.fillStyle = sg;
				cx.fillRect(wx - step, top, ww + step * 2, hMax * 0.28);
			}
			const hg = cx.createLinearGradient(0, top, 0, base);
			hg.addColorStop(0, "rgba(222,232,240,0)");
			hg.addColorStop(1, `rgba(222,232,240,${haze})`);
			cx.fillStyle = hg;
			cx.fillRect(wx - step, top, ww + step * 2, winBot - top);
			cx.restore();
			return yAt;
		};

		// spruce / fir: layered drooping tiers, lit on the left
		const spruce = (
			bx: number,
			by: number,
			h: number,
			lightC: string,
			darkC: string,
			seed: number,
		) => {
			const w = h * 0.34;
			const tiers = Math.max(3, Math.round(h / 2.4));
			const R: number[] = [],
				L: number[] = [],
				Y: number[] = [];
			for (let k = 1; k <= tiers; k++) {
				const f = k / tiers;
				Y[k] = by - h + h * 0.9 * f;
				R[k] = w * f * (0.82 + rnd(seed + k) * 0.36);
				L[k] = w * f * (0.82 + rnd(seed + k + 50) * 0.36);
			}
			const g = cx.createLinearGradient(bx - w, 0, bx + w, 0);
			g.addColorStop(0, lightC);
			g.addColorStop(1, darkC);
			cx.fillStyle = g;
			cx.beginPath();
			cx.moveTo(bx, by - h);
			for (let k = 1; k <= tiers; k++) {
				cx.lineTo(bx + R[k], Y[k]);
				if (k < tiers) cx.lineTo(bx + R[k] * 0.5, Y[k] - h * 0.025);
			}
			cx.lineTo(bx, Y[tiers] - h * 0.02);
			for (let k = tiers; k >= 1; k--) {
				cx.lineTo(bx - L[k], Y[k]);
				if (k > 1) cx.lineTo(bx - L[k - 1] * 0.5, Y[k - 1] - h * 0.025);
			}
			cx.closePath();
			cx.fill();
			// soft needle highlights on the lit side of each tier
			if (h > 12) {
				cx.strokeStyle = "rgba(176,206,146,0.2)";
				cx.lineWidth = Math.max(0.3, h * 0.012);
				for (let k = 2; k <= tiers; k++) {
					cx.beginPath();
					cx.moveTo(bx - L[k] * 0.85, Y[k] - h * 0.005);
					cx.lineTo(bx - L[k] * 0.2, Y[k] - h * 0.05);
					cx.stroke();
				}
			}
			// trunk peeking out below the lowest tier
			cx.fillStyle = "rgba(60,44,32,0.9)";
			cx.fillRect(
				bx - Math.max(0.3, h * 0.025),
				Y[tiers] - h * 0.02,
				Math.max(0.6, h * 0.05),
				by - Y[tiers] + h * 0.02,
			);
		};

		// broadleaf tree: tapered trunk, limbs and many lit leaf clusters
		const broadleaf = (
			bx: number,
			by: number,
			h: number,
			seed: number,
			haze = 0,
		) => {
			const hc = (c: number[]) =>
				`rgb(${Math.round(ln(c[0], 214, haze))},${Math.round(
					ln(c[1], 226, haze),
				)},${Math.round(ln(c[2], 232, haze))})`;
			const cw = h * (0.68 + rnd(seed) * 0.16);
			const ch = h * 0.66;
			const ccx = bx + (rnd(seed + 2) - 0.5) * h * 0.06;
			const ccy = by - h + ch * 0.5;
			// soft ground shadow
			cx.fillStyle = `rgba(30,48,22,${0.22 * (1 - haze)})`;
			cx.beginPath();
			cx.ellipse(bx + h * 0.08, by, cw * 0.45, h * 0.035 + 0.5, 0, 0, Math.PI * 2);
			cx.fill();
			// tapered trunk
			cx.fillStyle = hc([78, 60, 44]);
			cx.beginPath();
			cx.moveTo(bx - h * 0.035, by);
			cx.lineTo(bx - h * 0.014, ccy + ch * 0.15);
			cx.lineTo(bx + h * 0.014, ccy + ch * 0.15);
			cx.lineTo(bx + h * 0.035, by);
			cx.closePath();
			cx.fill();
			// main limbs
			cx.strokeStyle = hc([70, 54, 40]);
			cx.lineWidth = Math.max(0.4, h * 0.016);
			cx.lineCap = "round";
			for (let b = 0; b < 3; b++) {
				const sy = ccy + ch * (0.25 - b * 0.08);
				const dir = b === 0 ? -1 : b === 1 ? 0 : 1;
				cx.beginPath();
				cx.moveTo(bx, sy + ch * 0.12);
				cx.quadraticCurveTo(
					bx + dir * cw * 0.12,
					sy,
					bx + dir * cw * 0.3 + (rnd(seed + b) - 0.5) * 2,
					sy - ch * 0.22,
				);
				cx.stroke();
			}
			cx.lineCap = "butt";
			// leaf clusters, lit from the upper left
			const n = Math.max(16, Math.round(h * 2.4));
			const pts: { px: number; py: number; pr: number; lit: number }[] = [];
			for (let k = 0; k < n; k++) {
				const ang = rnd(seed * 7 + k) * Math.PI * 2;
				const rad = Math.sqrt(rnd(seed * 7 + k + 1));
				const ox = Math.cos(ang) * rad,
					oy = Math.sin(ang) * rad;
				pts.push({
					px: ccx + ox * cw * 0.46,
					py: ccy + oy * ch * 0.44,
					pr: h * (0.05 + rnd(seed * 7 + k + 2) * 0.045),
					lit: Math.max(0, Math.min(1, 0.55 - ox * 0.35 - oy * 0.45)),
				});
			}
			// shadowed inner mass first (one soft canopy volume)
			const mass = cx.createRadialGradient(
				ccx - cw * 0.12,
				ccy - ch * 0.15,
				ch * 0.1,
				ccx,
				ccy,
				cw * 0.55,
			);
			mass.addColorStop(0, hc([70, 100, 48]));
			mass.addColorStop(0.75, hc([44, 68, 34]));
			mass.addColorStop(1, hc([36, 58, 30]));
			cx.fillStyle = mass;
			cx.beginPath();
			cx.ellipse(ccx, ccy, cw * 0.47, ch * 0.45, 0, 0, Math.PI * 2);
			cx.fill();
			// lit clusters on top (darker ones first, brightest last)
			pts
				.sort((a, b) => a.lit - b.lit)
				.forEach((p) => {
					const lg = cx.createRadialGradient(
						p.px - p.pr * 0.4,
						p.py - p.pr * 0.45,
						p.pr * 0.1,
						p.px,
						p.py,
						p.pr * 1.05,
					);
					lg.addColorStop(
						0,
						hc([ln(96, 168, p.lit), ln(130, 196, p.lit), ln(62, 104, p.lit)]),
					);
					lg.addColorStop(
						0.65,
						hc([ln(66, 112, p.lit), ln(98, 146, p.lit), ln(46, 70, p.lit)]),
					);
					lg.addColorStop(1, "rgba(40,64,32,0)");
					cx.fillStyle = lg;
					cx.beginPath();
					cx.ellipse(p.px, p.py, p.pr, p.pr * 0.92, 0, 0, Math.PI * 2);
					cx.fill();
				});
		};

		// far snow-capped range, mid forested range, near rolling hills
		drawRange(0.68, 0.34, (x) => ridge(x, 1.3), [176, 188, 206], [104, 120, 146], 0.42, 1);
		drawRange(0.75, 0.2, (x) => ridge(x * 1.35 + 300, 4.7), [128, 152, 138], [72, 96, 88], 0.35);
		const nearY = drawRange(0.8, 0.09, hills, [134, 164, 92], [92, 120, 62], 0.12);

		// distant forest line along the near hills
		for (let x = wx - 2; x <= wx + ww + 2; x += 2.2) {
			const k = Math.floor(x * 3.1);
			if (rnd(k) < 0.22) continue;
			spruce(
				x + (rnd(k + 3) - 0.5) * 1.5,
				nearY(x) + 1.2,
				3 + rnd(k + 7) * 4,
				"rgb(88,116,92)",
				"rgb(46,66,54)",
				k,
			);
		}

		// meadow in front of the hills
		const mTopY = (x: number) => hz(0.86) + Math.sin(x * 0.035 + 0.8) * 2.2;
		cx.beginPath();
		cx.moveTo(wx - 2, winBot);
		for (let x = wx - 2; x <= wx + ww + 2; x += 2) cx.lineTo(x, mTopY(x));
		cx.lineTo(wx + ww + 2, winBot);
		cx.closePath();
		const meadow = cx.createLinearGradient(0, hz(0.84), 0, winBot);
		meadow.addColorStop(0, "#93b566");
		meadow.addColorStop(1, "#5e8240");
		cx.fillStyle = meadow;
		cx.fill();
		// fine grass texture
		cx.strokeStyle = "rgba(60,92,40,0.35)";
		cx.lineWidth = 0.35;
		cx.beginPath();
		for (let i = 0; i < Math.round(ww * 0.9); i++) {
			const gx = wx + rnd(i * 3 + (flip ? 500 : 0)) * ww;
			const gy = ln(hz(0.88), winBot, rnd(i * 5 + (flip ? 600 : 1)));
			cx.moveTo(gx, gy);
			cx.lineTo(gx + (rnd(i) - 0.5) * 0.8, gy - 1 - rnd(i + 2) * 1.2);
		}
		cx.stroke();

		// a few small trees across the meadow (slightly hazed by distance)
		for (let i = 0; i < 3; i++) {
			const seed = 300 + i + (flip ? 20 : 0);
			const bx = wx + (0.3 + i * 0.2 + (rnd(seed) - 0.5) * 0.1) * ww;
			broadleaf(bx, mTopY(bx) + 1.5, winH * (0.1 + rnd(seed + 1) * 0.05), seed, 0.25);
		}

		// foreground trees framing each view
		const groundY = (x: number) => mTopY(x) + winH * 0.07;
		const fgShadow = (x: number, y: number, r: number) => {
			cx.fillStyle = "rgba(30,48,22,0.22)";
			cx.beginPath();
			cx.ellipse(x + r * 0.2, y, r, r * 0.12 + 0.5, 0, 0, Math.PI * 2);
			cx.fill();
		};
		if (!flip) {
			const b1 = wx + ww * 0.2;
			broadleaf(b1, groundY(b1), winH * 0.44, 501);
			const s1 = wx + ww * 0.8;
			fgShadow(s1, groundY(s1) + 1, winH * 0.12);
			spruce(s1, groundY(s1) + 1, winH * 0.4, "rgb(78,112,70)", "rgb(30,52,38)", 511);
			const s2 = wx + ww * 0.93;
			fgShadow(s2, groundY(s2) + 2, winH * 0.09);
			spruce(s2, groundY(s2) + 2, winH * 0.3, "rgb(74,108,66)", "rgb(28,50,36)", 531);
		} else {
			const s1 = wx + ww * 0.12;
			fgShadow(s1, groundY(s1) + 1, winH * 0.11);
			spruce(s1, groundY(s1) + 1, winH * 0.38, "rgb(78,112,70)", "rgb(30,52,38)", 541);
			const b1 = wx + ww * 0.78;
			broadleaf(b1, groundY(b1), winH * 0.46, 521);
		}

		// rounded garden shrubs along the base of the glass
		for (let i = 0; i < Math.round(ww / 12); i++) {
			const seed = 700 + i + (flip ? 60 : 0);
			const sxp = wx + (i + 0.5) * 12 + (rnd(seed) - 0.5) * 6;
			const syp = winBot - winH * 0.02;
			for (let k = 0; k < 4; k++) {
				const pr = 2.4 + rnd(seed + k + 9) * 1.6;
				const px = sxp + (k - 1.5) * 2.6 + (rnd(seed + k) - 0.5) * 1.5;
				const py = syp - pr * 0.6 - rnd(seed + k + 3) * 1.5;
				const bg = cx.createRadialGradient(px - pr * 0.4, py - pr * 0.5, 0.2, px, py, pr);
				bg.addColorStop(0, "rgb(132,168,84)");
				bg.addColorStop(0.7, "rgb(78,112,52)");
				bg.addColorStop(1, "rgb(52,80,38)");
				cx.fillStyle = bg;
				cx.beginPath();
				cx.ellipse(px, py, pr, pr * 0.85, 0, 0, Math.PI * 2);
				cx.fill();
			}
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
	// CRESTRON HORIZON THERMOSTAT on the right-hand wall.
	// Black glass body, lit screen showing 21.5, setpoint ring,
	// touch chevrons and the signature white LED light bar.
	// ─────────────────────────────────────────────────────────
	{
		const wallL = rightWin.x + rightWin.w; // inner edge of the right wall plaster
		const wallR = W - 4;
		const tw = 28; // panel width
		const th = 20; // panel height (≈ 1.4 : 1, like the real unit)
		const tx = wallL + (wallR - wallL) * 0.5 - tw / 2 + 2; // centered in the wall, nudged right off the frame
		const ty = ceilY + (fY - ceilY) * 0.4 - th / 2; // mounted at a natural height
		// the lit screen + LED bar read stronger as the room gets darker
		const lit = 0.35 + darkF * 0.65;

		// soft cool light the lit screen casts onto the plaster around it
		const halo = cx.createRadialGradient(
			tx + tw / 2,
			ty + th * 0.55,
			2,
			tx + tw / 2,
			ty + th * 0.55,
			tw * 0.95,
		);
		halo.addColorStop(0, `rgba(205,218,255,${0.12 * lit})`);
		halo.addColorStop(1, "rgba(205,218,255,0)");
		cx.fillStyle = halo;
		cx.fillRect(tx - tw * 0.6, ty - th * 0.8, tw * 2.2, th * 2.6);

		// contact + ambient drop shadow (unit sits slightly proud of the wall)
		cx.fillStyle = "rgba(0,0,0,0.12)";
		rr(tx + 0.4, ty + 2.6, tw + 1.4, th + 1, 2);
		cx.fill();
		cx.fillStyle = "rgba(0,0,0,0.28)";
		rr(tx + 1, ty + 1.6, tw, th, 1.4);
		cx.fill();

		// black glass body
		const body = cx.createLinearGradient(tx, ty, tx, ty + th);
		body.addColorStop(0, "#262629");
		body.addColorStop(1, "#141416");
		cx.fillStyle = body;
		rr(tx, ty, tw, th, 1.2);
		cx.fill();

		// everything on the face is clipped to the glass
		cx.save();
		rr(tx, ty, tw, th, 1.2);
		cx.clip();

		// ── lit screen ──
		const sx = tx + tw * 0.13,
			sy = ty + th * 0.13,
			sw = tw * 0.53,
			sh = th * 0.55;
		const scr = cx.createRadialGradient(
			sx + sw / 2,
			sy + sh / 2,
			0.5,
			sx + sw / 2,
			sy + sh / 2,
			sw * 0.7,
		);
		scr.addColorStop(0, "#3c3c40");
		scr.addColorStop(1, "#2b2b2e");
		cx.fillStyle = scr;
		cx.fillRect(sx, sy, sw, sh);

		// setpoint ring (cyan → violet → pink, open at the bottom)
		const rcx = sx + sw / 2,
			rcy = sy + sh / 2,
			rR = sh * 0.4;
		const ring = cx.createLinearGradient(rcx - rR, 0, rcx + rR, 0);
		ring.addColorStop(0, "#35e3f2");
		ring.addColorStop(0.4, "#8fa6ec");
		ring.addColorStop(0.6, "#c784d6");
		ring.addColorStop(1, "#f2507c");
		cx.strokeStyle = ring;
		cx.lineCap = "round";
		// soft glow pass
		cx.globalAlpha = 0.35;
		cx.lineWidth = 0.9;
		cx.beginPath();
		cx.arc(rcx, rcy, rR, Math.PI * 0.66, Math.PI * 2.34);
		cx.stroke();
		// crisp line
		cx.globalAlpha = 1;
		cx.lineWidth = 0.32;
		cx.beginPath();
		cx.arc(rcx, rcy, rR, Math.PI * 0.66, Math.PI * 2.34);
		cx.stroke();

		// heat / current / cool markers crossing the ring
		const tick = (ang: number, col: string, len: number, wdt: number) => {
			const c = Math.cos(ang),
				sn = Math.sin(ang);
			cx.strokeStyle = col;
			cx.lineWidth = wdt;
			cx.beginPath();
			cx.moveTo(rcx + c * (rR - len * 0.5), rcy + sn * (rR - len * 0.5));
			cx.lineTo(rcx + c * (rR + len * 0.5), rcy + sn * (rR + len * 0.5));
			cx.stroke();
		};
		tick(-Math.PI / 2, "#ff6b6b", 1.6, 0.45); // heat setpoint
		tick(-Math.PI / 2 + 0.32, "rgba(255,255,255,0.9)", 1.1, 0.2); // current
		tick(-0.85, "#2aa8e8", 1.6, 0.45); // cool setpoint
		cx.lineCap = "butt";

		// temperature readout
		cx.fillStyle = "#f4f4f6";
		cx.font = "600 3.4px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
		cx.textAlign = "center";
		cx.textBaseline = "middle";
		cx.fillText("21.5", rcx, rcy + 0.15);

		// ── glowing touch chevrons (up / down) ──
		const chev = (cxp: number, cyp: number, up: boolean) => {
			const d = up ? 1 : -1;
			const hw = 1.4,
				hh = 0.75;
			const path = () => {
				cx.beginPath();
				cx.moveTo(cxp - hw, cyp + (d * hh) / 2);
				cx.lineTo(cxp, cyp - (d * hh) / 2);
				cx.lineTo(cxp + hw, cyp + (d * hh) / 2);
			};
			cx.lineCap = "round";
			cx.lineJoin = "round";
			cx.strokeStyle = "rgba(235,240,255,0.25)";
			cx.lineWidth = 0.9;
			path();
			cx.stroke();
			cx.strokeStyle = "rgba(255,255,255,0.95)";
			cx.lineWidth = 0.3;
			path();
			cx.stroke();
			cx.lineCap = "butt";
			cx.lineJoin = "miter";
		};
		chev(tx + tw * 0.83, ty + th * 0.3, true);
		chev(tx + tw * 0.83, ty + th * 0.56, false);

		// ── signature white LED light bar ──
		const barY = ty + th * 0.8;
		// slightly darker lower strip below the bar
		cx.fillStyle = "rgba(0,0,0,0.14)";
		cx.fillRect(tx, barY, tw, th - (barY - ty));
		// soft bloom
		const bloom = cx.createLinearGradient(0, barY - 1.6, 0, barY + 1.6);
		bloom.addColorStop(0, "rgba(230,238,255,0)");
		bloom.addColorStop(0.5, `rgba(230,238,255,${0.22 + 0.2 * lit})`);
		bloom.addColorStop(1, "rgba(230,238,255,0)");
		cx.fillStyle = bloom;
		cx.fillRect(tx, barY - 1.6, tw, 3.2);
		// hot core, slightly tapered at the ends
		const core = cx.createLinearGradient(tx, 0, tx + tw, 0);
		core.addColorStop(0, "rgba(255,255,255,0.55)");
		core.addColorStop(0.08, "rgba(255,255,255,0.95)");
		core.addColorStop(0.92, "rgba(255,255,255,0.95)");
		core.addColorStop(1, "rgba(255,255,255,0.55)");
		cx.fillStyle = core;
		cx.fillRect(tx, barY - 0.18, tw, 0.36);

		// faint brand mark in the lower strip
		cx.fillStyle = "rgba(255,255,255,0.12)";
		cx.font = "italic 800 1.5px system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
		cx.textAlign = "right";
		cx.textBaseline = "middle";
		cx.fillText("CRESTRON", tx + tw * 0.9, ty + th * 0.91);

		// diagonal glass reflection across the whole face
		const gl = cx.createLinearGradient(tx, ty, tx + tw, ty + th);
		gl.addColorStop(0, "rgba(255,255,255,0.09)");
		gl.addColorStop(0.42, "rgba(255,255,255,0.045)");
		gl.addColorStop(0.43, "rgba(255,255,255,0.012)");
		gl.addColorStop(1, "rgba(255,255,255,0)");
		cx.fillStyle = gl;
		cx.fillRect(tx, ty, tw, th);

		cx.restore(); // end face clip

		// thin bevel highlight on the glass edge
		cx.strokeStyle = "rgba(255,255,255,0.1)";
		cx.lineWidth = 0.3;
		rr(tx + 0.15, ty + 0.15, tw - 0.3, th - 0.3, 1.1);
		cx.stroke();
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

	// ── LINEAR FIREPLACE (static bonfire) below TV ──
	const fpX = mX + 12,
		fpY = fY - 54,
		fpW = featW - 24,
		fpH = 30;
	const baseY = fpY + fpH - 5;
	// firebox recess
	cx.fillStyle = "#0a0807";
	rr(fpX, fpY, fpW, fpH, 2);
	cx.fill();
	// static ember bed behind logs (fixed at its average brightness)
	const emberFlick = 0.82;
	const ember = cx.createLinearGradient(0, fpY + fpH, 0, fpY + 6);
	ember.addColorStop(0, `rgba(255,150,50,${emberFlick})`);
	ember.addColorStop(1, "rgba(120,30,0,0.18)");
	cx.fillStyle = ember;
	cx.fillRect(fpX + 2, fpY + 8, fpW - 4, fpH - 9);

	// static flames — each tongue keeps its own height & lean from its phase offset
	cx.save();
	cx.beginPath();
	cx.rect(fpX, fpY - 24, fpW, fpH + 24);
	cx.clip();
	const nFl = Math.max(6, Math.round(fpW / 8));
	for (let i = 0; i < nFl; i++) {
		const phase = i * 1.7;
		const flx = fpX + 6 + (i / (nFl - 1)) * (fpW - 12);
		// height & lateral lean from layered sines of a fixed phase (no animation)
		const breathe =
			0.7 + 0.3 * Math.sin(phase) + 0.15 * Math.sin(phase * 2.3);
		const flh = (10 + rnd(i + 20) * 12) * (0.7 + breathe * 0.6);
		const sway = Math.sin(phase) * 2.4 + Math.sin(phase) * 1.1;
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
	// static glow (fixed at its average brightness)
	const glowPulse = 0.78;
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
		// subtle warm reflection from the fire on the gloss side (static)
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
	const t = useTranslations("hero");

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
		);
	}

	// single persistent loop: keeps the TV video alive every frame and paints
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
						<p>{t("livingRoom")}</p>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								gap: "5px",
							}}
						>
							<p style={{ textAlign: "right" }}>
								{formattedHours}
								<span className={styles["panel-time-colon"]}>:</span>
								{formattedMinutes} {period}
							</p>
							<p
								style={{
									display: "flex",
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<span>
									<TemperatureHalfIcon size={20} />
								</span>
								<span>21.5°C</span>
							</p>
						</div>
					</div>
					<p style={{ marginBottom: "5px" }}>{t("lightingScenes")}</p>
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
								{t(SCENE_META[sk].label)}
							</button>
						))}
					</div>
				</div>
				<div>
					<p style={{ marginBottom: "5px" }}>{t("roomControls")}</p>
					<div
						style={{
							display: "flex",
							flexWrap: "wrap",
							gap: "5px",
						}}
					>
						<button
							onClick={() => setCeilOn((prev) => !prev)}
							className={`${styles.btn} ${ceilOn ? styles["btn--active"] : ""}`}
							type="button"
							disabled={transitioning}
						>
							<p>{t("cellingLight")}</p>
							<span>{ceilOn ? t("on") : t("off")}</span>
						</button>
						<button
							type="button"
							onClick={() => setShelfOn((prev) => !prev)}
							className={`${styles.btn} ${shelfOn ? styles["btn--active"] : ""}`}
							disabled={transitioning}
						>
							<p>{t("shelfLight")}</p>
							<span>{shelfOn ? t("on") : t("off")}</span>
						</button>
						<button
							className={`${styles.btn} ${tvOn ? styles["btn--active"] : ""}`}
							onClick={() => setTvOn((prev) => !prev)}
							type="button"
							disabled={transitioning}
						>
							<p>TV</p>
							<span>{tvOn ? t("on") : t("off")}</span>
						</button>
						<button
							className={`${styles.btn} ${closed ? styles["btn--active"] : ""}`}
							onClick={() => setClosed((prev) => !prev)}
							type="button"
							disabled={transitioning}
						>
							<p>{t("shades")}</p>
							<span>{closed ? t("closed") : t("opened")}</span>
						</button>
					</div>
				</div>
			</div>
			<div className="hero-curtain"></div>
		</div>
	);
}
