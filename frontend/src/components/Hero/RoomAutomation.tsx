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
		// (walls/ceiling a touch deeper so the hidden LED cove reads clearly)
		wT: "#cfb08c",
		wB: "#b08c64",
		fT: "#8c7058", // smoked oak — warm, dark, luxurious
		fB: "#5a4534",
		cT: "#cdae8a",
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
		fT: "#ad9274", // smoked oak in daylight
		fB: "#7e6550",
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

	// recessed soffit step (follows the scene's wall tone, a hair deeper)
	cx.fillStyle = s.wT;
	cx.fillRect(-M, ceilY - 12, W + 2 * M, 12);
	cx.fillStyle = "rgba(0,0,0,0.04)";
	cx.fillRect(-M, ceilY - 12, W + 2 * M, 12);
	cx.fillStyle = "rgba(0,0,0,0.18)";
	cx.fillRect(-M, ceilY, W + 2 * M, 2);

	// ── HIDDEN LED COVE (recessed ceiling coffer) ──
	// The LED strip sits behind the lip of a recessed coffer, so the strip itself
	// is never visible: you only see its light washing onto the raised ceiling,
	// brightest right at the edge and fading toward the middle, which stays darker.
	// The coffer is drawn in true perspective toward the room's vanishing point
	// (narrow at the back wall, widening toward the camera), like a real room.
	// Everything is clipped to the ceiling so it can never light the windows.
	{
		const vpX = W * 0.5; // vanishing point (matches the floor perspective)
		const vpY = fY * 0.6;
		const y0 = ceilY - 18; // back edge of the coffer (lip of lower ceiling below it)
		const hw = W * 0.36; // half-width of the coffer at the back edge
		const yTop = -M - 10; // coffer runs past the top of the view (over the camera)
		// screen x of a ceiling point at lateral offset X (measured at the back edge)
		const px = (X: number, y: number) =>
			vpX + (X * (vpY - y)) / (vpY - y0);
		// coffer outline inset by `k` steps (k = 0 → the edge itself)
		const outline = (k: number, dX: number, dY: number) => {
			const X = hw - k * dX;
			const y = y0 - k * dY;
			cx.moveTo(px(-X, yTop), yTop);
			cx.lineTo(px(-X, y), y);
			cx.lineTo(px(X, y), y);
			cx.lineTo(px(X, yTop), yTop);
			cx.closePath();
		};

		cx.save();
		cx.beginPath();
		cx.rect(-M, -M, W + 2 * M, ceilY - 12 + M); // ceiling only (above the soffit)
		cx.clip();

		// recess depth: the raised panel reads slightly deeper than the lower ceiling
		cx.fillStyle = "rgba(0,0,0,0.035)";
		cx.beginPath();
		outline(0, 0, 0);
		cx.fill();

		if (s.ceil > 0.01) {
			const a = s.ceil;
			// "screen" brightens the ceiling like real light instead of tinting it,
			// so the cove reads on a light ceiling (Bright/Relax) and a dark one (Cinema)
			cx.globalCompositeOperation = "screen";
			// very faint overall bounce inside the coffer (indirect light lifts it a touch)
			cx.fillStyle = `rgba(255,214,166,${0.05 * a})`;
			cx.beginPath();
			outline(0, 0, 0);
			cx.fill();
			// soft falloff from the hidden strip: many thin rings that follow the
			// coffer edge in perspective (fine steps → smooth, no visible banding),
			// so the glow widens naturally toward the camera
			const N = 72,
				dX = 0.92,
				dY = 0.48;
			for (let k = 0; k < N; k++) {
				const tk = (k + 0.5) / N;
				const fall = 0.7 * Math.exp(-tk * 10) + 0.3 * Math.exp(-tk * 3);
				cx.fillStyle = `rgba(255,206,146,${0.95 * a * fall})`;
				cx.beginPath();
				outline(k, dX, dY);
				outline(k + 1, dX, dY);
				cx.fill("evenodd");
			}
			cx.globalCompositeOperation = "source-over";
		}

		// shadow gap on the lip edge — the dark line that hides the LED strip
		cx.strokeStyle = mix("rgba(70,56,40,0.22)", "rgba(0,0,0,0.5)");
		cx.lineWidth = 0.8;
		cx.beginPath();
		cx.moveTo(px(-hw - 1, yTop), yTop);
		cx.lineTo(px(-hw - 1, y0 + 0.6), y0 + 0.6);
		cx.lineTo(px(hw + 1, y0 + 0.6), y0 + 0.6);
		cx.lineTo(px(hw + 1, yTop), yTop);
		cx.stroke();

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
		// trim ring
		cx.fillStyle = "rgba(0,0,0,0.12)";
		cx.beginPath();
		cx.ellipse(x, y, 3.4, 2, 0, 0, Math.PI * 2);
		cx.fill();
		// aperture (lit when the scene is bright enough)
		cx.fillStyle =
			s.br > 0.2
				? `rgba(255,242,212,${Math.min(1, 0.55 + s.br * 0.45)})`
				: "rgba(90,90,112,0.5)";
		cx.beginPath();
		cx.ellipse(x, y, 1.7, 1, 0, 0, Math.PI * 2);
		cx.fill();
		// a downlight shines DOWN, so the ceiling around it only gets a tiny,
		// tight halo from the trim — no beam painted across the ceiling
		if (s.br > 0.15) {
			const halo = cx.createRadialGradient(x, y, 0.5, x, y, 6);
			halo.addColorStop(0, `rgba(${s.aR},${s.aG},${s.aB},${0.18 * s.br})`);
			halo.addColorStop(1, `rgba(${s.aR},${s.aG},${s.aB},0)`);
			cx.fillStyle = halo;
			cx.beginPath();
			cx.ellipse(x, y, 6, 3.6, 0, 0, Math.PI * 2);
			cx.fill();
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

	// ── HIDDEN WALL-WASH SLOT (shadow gap where ceiling meets the back wall) ──
	// A second concealed LED strip sits in the gap under the soffit and grazes
	// light DOWN the wall: brightest right under the ceiling, fading quickly.
	// Drawn before the windows, so glass and frames stay clean.
	if (s.ceil > 0.01) {
		const a = s.ceil;
		cx.globalCompositeOperation = "screen";
		const wash = cx.createLinearGradient(0, ceilY, 0, ceilY + 70);
		wash.addColorStop(0, `rgba(255,210,152,${0.8 * a})`);
		wash.addColorStop(0.12, `rgba(255,204,144,${0.45 * a})`);
		wash.addColorStop(0.45, `rgba(255,198,138,${0.12 * a})`);
		wash.addColorStop(1, "rgba(255,198,138,0)");
		cx.fillStyle = wash;
		cx.fillRect(-M, ceilY, W + 2 * M, 70);
		cx.globalCompositeOperation = "source-over";
	}

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
	// hidden wall-wash grazing down the marble from the ceiling slot
	if (s.ceil > 0.01) {
		const a = s.ceil;
		cx.globalCompositeOperation = "screen";
		// grazing light: soft spill above the slot, brightest right at the slot
		// (ceiling line), then fading down the stone — one smooth gradient
		const span = ceilY + 58 - mTop;
		const slot = (ceilY - mTop) / span;
		const mw = cx.createLinearGradient(0, mTop, 0, ceilY + 58);
		mw.addColorStop(0, `rgba(255,200,140,${0.22 * a})`);
		mw.addColorStop(slot, `rgba(255,206,148,${0.55 * a})`);
		mw.addColorStop(slot + (1 - slot) * 0.15, `rgba(255,200,140,${0.3 * a})`);
		mw.addColorStop(slot + (1 - slot) * 0.5, `rgba(255,196,136,${0.08 * a})`);
		mw.addColorStop(1, "rgba(255,196,136,0)");
		cx.fillStyle = mw;
		cx.fillRect(mX, mTop, featW, span);
		cx.globalCompositeOperation = "source-over";
	}

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
	// BUILT-IN WALNUT SHELVING (left wall) — curated, backlit, with a closed
	// cabinet below. Narrower than before so it keeps a clear gap to the window.
	// Each open bay has a concealed LED strip under the shelf above it: you never
	// see the diodes, only a soft light falling onto the back panel and objects,
	// brightest just under the shelf and fading down, with soft cast shadows.
	// ─────────────────────────────────────────────────────────
	{
		const bsX = -100,
			bsW = 116, // right edge at x = 16 → ~10 units of wall before the window frame
			bsY = ceilY + 10,
			bsBot = fY - 2,
			bsH = bsBot - bsY;
		const fr = 3; // carcass side/top thickness
		const plinth = 4;
		const div = 2; // vertical divider thickness
		const bt = 2.4; // shelf board thickness
		const cols = 3,
			rows = 5; // 4 open rows + closed cabinet at the bottom
		const colW = (bsW - 2 * fr - (cols - 1) * div) / cols;
		const rowH = (bsH - fr - plinth) / rows;
		const L = s.shelf; // shelf LED level 0..1

		// colour helper: ambient-dimmed colour, or the cast-shadow colour while
		// drawing an object's shadow pass
		// objects lit by the shelf LED stay readable even in a dark scene
		const lit = darkF * (1 - 0.55 * L);
		const mixL = (l: string, d: string) => mix(l, d, lit);
		let shadowMode = false;
		const shCol = `rgba(12,7,3,${0.1 + 0.3 * L})`;
		const col = (light: string, dark: string) =>
			shadowMode ? shCol : mixL(light, dark);
		const fx = (style: string) => (shadowMode ? "rgba(0,0,0,0)" : style);

		// ── object helpers (x = left/centre, fl = shelf top surface) ──
		const book = (
			x: number,
			fl: number,
			w: number,
			h: number,
			c: [string, string],
			band: boolean,
			lean = 0,
		) => {
			cx.save();
			if (lean) {
				const px0 = lean < 0 ? x + w : x; // pivot on the corner it rests on
				cx.translate(px0, fl);
				cx.rotate(lean);
				cx.translate(-px0, -fl);
			}
			cx.fillStyle = col(c[0], c[1]);
			cx.fillRect(x, fl - h, w, h);
			if (!shadowMode) {
				// rounded-spine shading
				cx.fillStyle = "rgba(255,255,255,0.1)";
				cx.fillRect(x + 0.25, fl - h, 0.45, h);
				cx.fillStyle = "rgba(0,0,0,0.2)";
				cx.fillRect(x + w - 0.6, fl - h, 0.6, h);
				if (band) {
					// gilt bands near head and tail
					cx.fillStyle = "rgba(214,182,120,0.7)";
					cx.fillRect(x, fl - h + h * 0.1, w, 0.35);
					cx.fillRect(x, fl - h * 0.14, w, 0.35);
				}
				// title block
				cx.fillStyle = "rgba(240,232,214,0.28)";
				cx.fillRect(x + w * 0.25, fl - h * 0.62, w * 0.5, h * 0.22);
			}
			cx.restore();
		};
		// ── book palettes: muted, "designer library" tones ──
		const palA: [string, string][] = [
			["#e9e1cf", "#2c2822"], // cream
			["#2b3a4e", "#11161d"], // navy
			["#7a2f2a", "#2a1210"], // oxblood
			["#8f9a7c", "#2c3026"], // sage
			["#c9a27a", "#3a2e22"], // sand
			["#1e1e1e", "#0b0b0b"], // black
		];
		const palB: [string, string][] = [
			["#b8634a", "#3a1e16"], // terracotta
			["#d8d2c4", "#2a2824"], // greige
			["#4d5f6e", "#181e24"], // slate blue
			["#a8865a", "#33281c"], // camel
			["#3c4a3a", "#141914"], // forest
			["#efe9dc", "#2e2b26"], // off-white
		];
		const booksRow = (
			x0: number,
			x1: number,
			fl: number,
			maxH: number,
			seed: number,
			pal: [string, string][],
		) => {
			let ox = x0,
				i = 0;
			while (ox < x1 - 2) {
				const bw = 2.1 + rnd(seed + i) * 1.9;
				if (ox + bw > x1) break;
				const bh = maxH * (0.6 + rnd(seed + i + 40) * 0.38);
				const c = pal[Math.floor(rnd(seed + i + 80) * pal.length)];
				book(ox, fl, bw, bh, c, rnd(seed + i + 120) > 0.55);
				ox += bw + 0.22;
				i++;
			}
			return ox;
		};
		// books lying flat (fore-edge pages visible), returns top y
		const stackFlat = (
			x: number,
			fl: number,
			w: number,
			n: number,
			seed: number,
			pal: [string, string][],
		) => {
			let y = fl;
			for (let k = 0; k < n; k++) {
				const bw = w * (1 - k * 0.07 - rnd(seed + k) * 0.06);
				const bh = 1.5 + rnd(seed + k + 9) * 1.1;
				const bx = x + (w - bw) / 2 + (rnd(seed + k + 3) - 0.5) * 1.2;
				const c = pal[Math.floor(rnd(seed + k + 17) * pal.length)];
				cx.fillStyle = col(c[0], c[1]);
				cx.fillRect(bx, y - bh, bw, bh);
				// page block on the right end
				cx.fillStyle = fx("rgba(245,238,222,0.75)");
				cx.fillRect(bx + bw - 1.2, y - bh + 0.3, 1, bh - 0.6);
				y -= bh;
			}
			return y;
		};
		const vase = (
			cxm: number,
			fl: number,
			w: number,
			h: number,
			c: [string, string],
			neck = 0.32,
		) => {
			cx.fillStyle = col(c[0], c[1]);
			cx.beginPath();
			cx.moveTo(cxm - w * 0.28, fl);
			cx.bezierCurveTo(
				cxm - w * 0.62,
				fl - h * 0.25,
				cxm - w * 0.55,
				fl - h * 0.7,
				cxm - w * neck * 0.5,
				fl - h * 0.86,
			);
			cx.lineTo(cxm - w * neck * 0.6, fl - h);
			cx.lineTo(cxm + w * neck * 0.6, fl - h);
			cx.lineTo(cxm + w * neck * 0.5, fl - h * 0.86);
			cx.bezierCurveTo(
				cxm + w * 0.55,
				fl - h * 0.7,
				cxm + w * 0.62,
				fl - h * 0.25,
				cxm + w * 0.28,
				fl,
			);
			cx.closePath();
			cx.fill();
			if (!shadowMode) {
				// glaze highlight + shaded side
				const g = cx.createLinearGradient(cxm - w * 0.5, 0, cxm + w * 0.5, 0);
				g.addColorStop(0, "rgba(255,255,255,0)");
				g.addColorStop(0.3, "rgba(255,255,255,0.16)");
				g.addColorStop(0.55, "rgba(255,255,255,0)");
				g.addColorStop(1, "rgba(0,0,0,0.22)");
				cx.fillStyle = g;
				cx.fill();
			}
			return fl - h;
		};
		// loose bouquet: curved stems, leaves and layered blossoms
		const flowers = (
			cxm: number,
			topY: number,
			spread: number,
			height: number,
			seed: number,
			petal: [string, string],
			n = 7,
		) => {
			for (let k = 0; k < n; k++) {
				const t = n > 1 ? k / (n - 1) - 0.5 : 0;
				const ex = cxm + t * spread * 2 + (rnd(seed + k) - 0.5) * 2;
				const ey = topY - height * (0.55 + rnd(seed + k + 5) * 0.45);
				cx.strokeStyle = col("#5f7a4c", "#1e281a");
				cx.lineWidth = 0.35;
				cx.beginPath();
				cx.moveTo(cxm + t * 1.2, topY);
				cx.quadraticCurveTo(cxm + t * spread * 0.6, ey + (topY - ey) * 0.5, ex, ey);
				cx.stroke();
				// a leaf on the stem
				if (rnd(seed + k + 30) > 0.4) {
					const ly = ey + (topY - ey) * 0.55;
					const lx = ln(cxm, ex, 0.5);
					cx.fillStyle = col("#6f8a58", "#22301c");
					cx.beginPath();
					cx.ellipse(lx + (t < 0 ? -1 : 1), ly, 1.4, 0.55, t < 0 ? 0.6 : -0.6, 0, Math.PI * 2);
					cx.fill();
				}
				// blossom: five petals around a centre
				const pr = 0.85 + rnd(seed + k + 12) * 0.5;
				cx.fillStyle = col(petal[0], petal[1]);
				for (let p = 0; p < 5; p++) {
					const a2 = (p / 5) * Math.PI * 2 + rnd(seed + k) * 2;
					cx.beginPath();
					cx.arc(ex + Math.cos(a2) * pr * 0.8, ey + Math.sin(a2) * pr * 0.8, pr * 0.75, 0, Math.PI * 2);
					cx.fill();
				}
				cx.fillStyle = col("#d9b65a", "#3a3018");
				cx.beginPath();
				cx.arc(ex, ey, pr * 0.42, 0, Math.PI * 2);
				cx.fill();
			}
		};
		// eucalyptus branch with paired round leaves
		const branch = (cxm: number, topY: number, h: number, seed: number) => {
			const ex = cxm + (rnd(seed) - 0.3) * 6;
			const ey = topY - h;
			cx.strokeStyle = col("#6b6a52", "#24241c");
			cx.lineWidth = 0.35;
			cx.beginPath();
			cx.moveTo(cxm, topY);
			cx.quadraticCurveTo(cxm + 1, topY - h * 0.5, ex, ey);
			cx.stroke();
			for (let k = 1; k <= 6; k++) {
				const t = k / 7;
				const bx = ln(cxm, ex, t) + Math.sin(t * 3) * 0.6;
				const by = ln(topY, ey, t);
				cx.fillStyle = col("#9fb3a2", "#2c3530");
				cx.beginPath();
				cx.ellipse(bx - 1.1, by, 0.95, 0.75, 0, 0, Math.PI * 2);
				cx.ellipse(bx + 1.1, by - 0.4, 0.95, 0.75, 0, 0, Math.PI * 2);
				cx.fill();
			}
		};
		// pothos in a ceramic pot, vines trailing over the shelf edge
		const trailingPlant = (cxm: number, fl: number, potW: number, potH: number, seed: number) => {
			cx.fillStyle = col("#e6ddcc", "#2b2722");
			rr(cxm - potW / 2, fl - potH, potW, potH, 1.2);
			cx.fill();
			if (!shadowMode) {
				cx.fillStyle = "rgba(0,0,0,0.18)";
				cx.fillRect(cxm + potW * 0.2, fl - potH, potW * 0.3, potH);
			}
			const leaf = (lx: number, ly: number, sz: number, rot: number, k: number) => {
				cx.fillStyle = col(rnd(seed + k) > 0.5 ? "#6f9a52" : "#5a8444", "#1d2c17");
				cx.beginPath();
				cx.ellipse(lx, ly, sz, sz * 0.62, rot, 0, Math.PI * 2);
				cx.fill();
			};
			// upright crown
			for (let k = 0; k < 9; k++) {
				const a2 = -Math.PI / 2 + (rnd(seed + k) - 0.5) * 2.2;
				const rd = 2 + rnd(seed + k + 3) * 3.5;
				leaf(cxm + Math.cos(a2) * rd, fl - potH - 1 + Math.sin(a2) * rd * 0.8, 1.5, a2, k);
			}
			// two vines draping over the front of the shelf
			[-1, 1].forEach((side, v) => {
				const sx = cxm + side * potW * 0.45;
				const len = 9 + v * 5;
				cx.strokeStyle = col("#557a3e", "#1a2614");
				cx.lineWidth = 0.3;
				cx.beginPath();
				cx.moveTo(sx, fl - potH + 0.5);
				cx.quadraticCurveTo(sx + side * 4, fl, sx + side * 3, fl + len);
				cx.stroke();
				for (let k = 0; k < 6; k++) {
					const t = (k + 1) / 7;
					const lx = ln(sx, sx + side * 3, t) + side * Math.sin(t * Math.PI) * 3;
					const ly = ln(fl - potH + 0.5, fl + len, t);
					leaf(lx + side * 0.9, ly, 1.25, side * 0.8, k + 20 + v * 7);
				}
			});
		};
		// original designer vinyl art toy — a chunky little robot
		const artToy = (cxm: number, fl: number, h: number) => {
			const u = h / 20;
			// feet
			cx.fillStyle = col("#2a2a2e", "#0e0e10");
			rr(cxm - 5 * u, fl - 2 * u, 4 * u, 2 * u, u);
			cx.fill();
			rr(cxm + 1 * u, fl - 2 * u, 4 * u, 2 * u, u);
			cx.fill();
			// body
			cx.fillStyle = col("#e0613f", "#3a1810");
			rr(cxm - 4.5 * u, fl - 9 * u, 9 * u, 7.4 * u, 1.6 * u);
			cx.fill();
			// arms
			rr(cxm - 6.6 * u, fl - 8.4 * u, 2 * u, 5 * u, u);
			cx.fill();
			rr(cxm + 4.6 * u, fl - 8.4 * u, 2 * u, 5 * u, u);
			cx.fill();
			// belly panel
			cx.fillStyle = col("#efe6d6", "#2e2b26");
			rr(cxm - 2.6 * u, fl - 7.6 * u, 5.2 * u, 3.6 * u, 0.8 * u);
			cx.fill();
			// big head
			cx.fillStyle = col("#efe6d6", "#2e2b26");
			rr(cxm - 6 * u, fl - 18 * u, 12 * u, 9.4 * u, 3 * u);
			cx.fill();
			// visor + eyes
			cx.fillStyle = col("#1c2230", "#0a0c10");
			rr(cxm - 4.4 * u, fl - 15.6 * u, 8.8 * u, 4.4 * u, 2 * u);
			cx.fill();
			cx.fillStyle = fx("rgba(140,230,255,0.95)");
			cx.beginPath();
			cx.arc(cxm - 1.9 * u, fl - 13.4 * u, 0.9 * u, 0, Math.PI * 2);
			cx.arc(cxm + 1.9 * u, fl - 13.4 * u, 0.9 * u, 0, Math.PI * 2);
			cx.fill();
			// antenna
			cx.strokeStyle = col("#2a2a2e", "#0e0e10");
			cx.lineWidth = 0.6 * u;
			cx.beginPath();
			cx.moveTo(cxm, fl - 18 * u);
			cx.lineTo(cxm, fl - 20.4 * u);
			cx.stroke();
			cx.fillStyle = col("#e0613f", "#3a1810");
			cx.beginPath();
			cx.arc(cxm, fl - 20.6 * u, 1 * u, 0, Math.PI * 2);
			cx.fill();
			if (!shadowMode) {
				// vinyl sheen on the head
				cx.fillStyle = "rgba(255,255,255,0.22)";
				rr(cxm - 4.8 * u, fl - 17.3 * u, 3.4 * u, 1 * u, 0.5 * u);
				cx.fill();
			}
		};
		// brass sphere on a travertine block
		const sphereSculpture = (cxm: number, fl: number, r: number) => {
			cx.fillStyle = col("#d9cbb2", "#2c2924");
			cx.fillRect(cxm - r * 1.1, fl - r * 0.9, r * 2.2, r * 0.9);
			const top = fl - r * 0.9;
			if (shadowMode) {
				cx.fillStyle = shCol;
			} else {
				const g = cx.createRadialGradient(cxm - r * 0.35, top - r * 1.35, r * 0.1, cxm, top - r, r);
				g.addColorStop(0, mixL("#f6e2a8", "#4a3f26"));
				g.addColorStop(0.5, mixL("#c49a4c", "#3a2c16"));
				g.addColorStop(1, mixL("#6e5226", "#1c150a"));
				cx.fillStyle = g;
			}
			cx.beginPath();
			cx.arc(cxm, top - r, r, 0, Math.PI * 2);
			cx.fill();
		};
		// travertine ring on a plinth
		const ringSculpture = (cxm: number, fl: number, r: number) => {
			cx.fillStyle = col("#3a3632", "#121110");
			cx.fillRect(cxm - r * 0.7, fl - r * 0.35, r * 1.4, r * 0.35);
			cx.strokeStyle = col("#d6c7ab", "#2a2620");
			cx.lineWidth = r * 0.42;
			cx.beginPath();
			cx.arc(cxm, fl - r * 0.35 - r * 0.95, r * 0.75, 0, Math.PI * 2);
			cx.stroke();
		};
		// small framed abstract print, leaning against the back panel
		const frame = (x: number, fl: number, w: number, h: number) => {
			cx.save();
			cx.translate(x, fl);
			cx.rotate(-0.06);
			cx.fillStyle = col("#1b1a18", "#0a0a09");
			cx.fillRect(0, -h, w, h);
			cx.fillStyle = col("#f1ece2", "#2e2c28");
			cx.fillRect(0.9, -h + 0.9, w - 1.8, h - 1.8);
			if (!shadowMode) {
				// abstract artwork: arch + sun, in earthy tones
				cx.fillStyle = mixL("#c2714f", "#3a2016");
				cx.beginPath();
				cx.arc(w * 0.42, -h * 0.28, w * 0.24, Math.PI, 0);
				cx.lineTo(w * 0.66, -h * 0.28 + 0.1);
				cx.fill();
				cx.fillStyle = mixL("#d9b15e", "#3a301a");
				cx.beginPath();
				cx.arc(w * 0.66, -h * 0.66, w * 0.11, 0, Math.PI * 2);
				cx.fill();
				cx.fillStyle = mixL("#6f7f6a", "#22281f");
				cx.fillRect(w * 0.2, -h * 0.28, w * 0.6, h * 0.08);
			}
			cx.restore();
		};
		const candle = (cxm: number, fl: number, w: number, h: number) => {
			cx.fillStyle = col("#efe8da", "#2e2c28");
			rr(cxm - w / 2, fl - h, w, h, 0.6);
			cx.fill();
			cx.strokeStyle = col("#2a2622", "#0c0b0a");
			cx.lineWidth = 0.3;
			cx.beginPath();
			cx.moveTo(cxm, fl - h);
			cx.lineTo(cxm, fl - h - 0.9);
			cx.stroke();
		};
		const bowl = (cxm: number, fl: number, w: number, h: number) => {
			cx.fillStyle = col("#3b3530", "#121010");
			cx.beginPath();
			cx.moveTo(cxm - w / 2, fl - h);
			cx.quadraticCurveTo(cxm - w * 0.4, fl, cxm - w * 0.14, fl);
			cx.lineTo(cxm + w * 0.14, fl);
			cx.quadraticCurveTo(cxm + w * 0.4, fl, cxm + w / 2, fl - h);
			cx.closePath();
			cx.fill();
			cx.fillStyle = fx("rgba(255,255,255,0.12)");
			cx.fillRect(cxm - w / 2, fl - h, w, 0.35);
		};

		// ── what sits in each open bay (row, col) ──
		const bays: Record<string, (x: number, fl: number, w: number, h: number) => void> = {
			"0-0": (x, fl, w, h) => {
				booksRow(x + 1.5, x + w - 8, fl, h * 0.84, 11, palA);
				candle(x + w - 4, fl, 3.4, h * 0.3);
			},
			"0-1": (x, fl, w, h) => {
				const top = vase(x + w * 0.5, fl, w * 0.34, h * 0.4, ["#ece6da", "#2c2a26"]);
				flowers(x + w * 0.5, top, w * 0.16, h * 0.46, 7, ["#fbf7f0", "#3a3834"], 8);
			},
			"0-2": (x, fl, w, h) => {
				const top = stackFlat(x + 2, fl, w * 0.52, 4, 21, palB);
				candle(x + 2 + w * 0.26, top, 2.6, h * 0.18);
				sphereSculpture(x + w * 0.77, fl, h * 0.13);
			},
			"1-0": (x, fl, w, h) => {
				artToy(x + w * 0.33, fl, h * 0.8);
				stackFlat(x + w * 0.6, fl, w * 0.34, 3, 31, palA);
			},
			"1-1": (x, fl, w, h) => {
				const end = booksRow(x + 1.5, x + w * 0.68, fl, h * 0.82, 23, palB);
				// one book leaning on the row, as in a real library
				book(end + 1.8, fl, 2.6, h * 0.7, palA[3], true, -0.3);
			},
			"1-2": (x, fl, w, h) => {
				frame(x + 2.5, fl, w * 0.48, h * 0.68);
				const top = vase(x + w * 0.79, fl, w * 0.18, h * 0.38, ["#8a8274", "#262420"], 0.4);
				branch(x + w * 0.79, top, h * 0.42, 5);
			},
			"2-0": (x, fl, w, h) => {
				trailingPlant(x + w * 0.42, fl, w * 0.36, h * 0.32, 13);
			},
			"2-1": (x, fl, w, h) => {
				booksRow(x + 1.5, x + w * 0.48, fl, h * 0.8, 37, palA);
				bowl(x + w * 0.75, fl, w * 0.38, h * 0.16);
			},
			"2-2": (x, fl, w, h) => {
				// pair of ceramic vessels, tall matte black + short stone
				vase(x + w * 0.36, fl, w * 0.3, h * 0.62, ["#2a2826", "#0e0d0c"], 0.36);
				vase(x + w * 0.68, fl, w * 0.28, h * 0.34, ["#cfc3ad", "#2a2722"], 0.5);
			},
			"3-0": (x, fl, w, h) => {
				const top = stackFlat(x + 2.5, fl, w * 0.62, 3, 47, palB);
				ringSculpture(x + 2.5 + w * 0.31, top, h * 0.18);
			},
			"3-1": (x, fl, w, h) => {
				booksRow(x + 1.5, x + w - 1.5, fl, h * 0.86, 53, [...palA, ...palB]);
			},
			"3-2": (x, fl, w, h) => {
				const top = vase(x + w * 0.4, fl, w * 0.24, h * 0.3, ["#b9a58c", "#2a251e"], 0.42);
				flowers(x + w * 0.4, top, w * 0.12, h * 0.3, 19, ["#e8b4b0", "#3a2828"], 5);
				candle(x + w * 0.72, fl, 3.2, h * 0.24);
				candle(x + w * 0.84, fl, 3.2, h * 0.17);
			},
		};

		const walnut = mix("#5c4330", "#1a120c");
		const walnutDk = mix("#3e2c1e", "#110c08");

		// draw bottom → top so trailing vines and leaning books overlap the bay below
		for (let r = rows - 1; r >= 0; r--) {
			for (let c = 0; c < cols; c++) {
				const x = bsX + fr + c * (colW + div);
				const y = bsY + fr + r * rowH;
				const h = rowH - bt;
				const fl = y + h; // top surface of this bay's shelf board

				if (r === rows - 1) {
					// closed walnut cabinet door with a slim brass pull
					const dg = cx.createLinearGradient(x, 0, x + colW, 0);
					dg.addColorStop(0, walnut);
					dg.addColorStop(1, walnutDk);
					cx.fillStyle = dg;
					cx.fillRect(x, y, colW, rowH);
					// vertical grain
					cx.strokeStyle = "rgba(0,0,0,0.12)";
					cx.lineWidth = 0.3;
					for (let g = 0; g < 7; g++) {
						const gx = x + 2 + rnd(r * 31 + c * 7 + g) * (colW - 4);
						cx.beginPath();
						cx.moveTo(gx, y + 1);
						cx.bezierCurveTo(gx + 1, y + rowH * 0.3, gx - 1, y + rowH * 0.7, gx + 0.5, y + rowH - 1);
						cx.stroke();
					}
					cx.fillStyle = mix("#c8a45e", "#3a2e18");
					cx.fillRect(x + colW / 2 - 4, y + 2.5, 8, 0.8);
					// reveal between doors
					cx.fillStyle = "rgba(0,0,0,0.45)";
					cx.fillRect(x + colW - 0.4, y, 0.4, rowH);
					// light from the bay above grazing the top of the doors
					if (L > 0.01) {
						cx.globalCompositeOperation = "screen";
						const dl = cx.createLinearGradient(0, y, 0, y + rowH * 0.5);
						dl.addColorStop(0, `rgba(255,196,128,${0.22 * L})`);
						dl.addColorStop(1, "rgba(255,196,128,0)");
						cx.fillStyle = dl;
						cx.fillRect(x, y, colW, rowH * 0.5);
						cx.globalCompositeOperation = "source-over";
					}
					continue;
				}

				// ── open bay ──
				// shelf board (drawn first so trailing vines can hang in front of it)
				// front edge (walnut), lit surface line when the LED is on
				cx.fillStyle = walnut;
				cx.fillRect(x, fl, colW, bt);
				cx.fillStyle = "rgba(255,255,255,0.07)";
				cx.fillRect(x, fl, colW, 0.35);
				if (L > 0.01) {
					cx.fillStyle = `rgba(255,214,160,${0.35 * L})`;
					cx.fillRect(x, fl - 0.35, colW, 0.35);
				}
				cx.save();
				cx.beginPath();
				cx.rect(x, y, colW, h + (r === 2 ? rowH : 0)); // bay 2 lets vines hang over
				cx.clip();

				// back panel (walnut veneer)
				const bp = cx.createLinearGradient(0, y, 0, fl);
				bp.addColorStop(0, mix("#4a3524", "#170f0a"));
				bp.addColorStop(1, mix("#3a2a1c", "#120c08"));
				cx.fillStyle = bp;
				cx.fillRect(x, y, colW, h);

				if (L > 0.01) {
					// concealed strip under the shelf above: soft wash down the back panel
					cx.globalCompositeOperation = "screen";
					const wash = cx.createLinearGradient(0, y, 0, fl);
					wash.addColorStop(0, `rgba(255,196,128,${0.9 * L})`);
					wash.addColorStop(0.3, `rgba(255,186,116,${0.48 * L})`);
					wash.addColorStop(1, `rgba(255,176,104,${0.14 * L})`);
					cx.fillStyle = wash;
					cx.fillRect(x, y, colW, h);
					cx.globalCompositeOperation = "source-over";
					// light falls off toward the sides of the bay
					const side = cx.createLinearGradient(x, 0, x + colW, 0);
					side.addColorStop(0, "rgba(0,0,0,0.26)");
					side.addColorStop(0.22, "rgba(0,0,0,0)");
					side.addColorStop(0.78, "rgba(0,0,0,0)");
					side.addColorStop(1, "rgba(0,0,0,0.26)");
					cx.fillStyle = side;
					cx.fillRect(x, y, colW, h);
				}

				// objects: soft cast shadow first (offset down/right), then the object
				const draw = bays[`${r}-${c}`];
				if (draw) {
					shadowMode = true;
					cx.save();
					cx.translate(0.5, 1.3);
					draw(x, fl, colW, h);
					cx.restore();
					shadowMode = false;
					draw(x, fl, colW, h);
				}

				if (L > 0.01) {
					// top light catching the objects, strongest right under the strip
					cx.globalCompositeOperation = "screen";
					const tl = cx.createLinearGradient(0, y, 0, y + h * 0.6);
					tl.addColorStop(0, `rgba(255,208,148,${0.3 * L})`);
					tl.addColorStop(1, "rgba(255,208,148,0)");
					cx.fillStyle = tl;
					cx.fillRect(x, y, colW, h * 0.6);
					// diffused glow just under the shelf above (the hidden strip itself stays out of view)
					const ug = cx.createLinearGradient(0, y, 0, y + 1.8);
					ug.addColorStop(0, `rgba(255,232,192,${0.75 * L})`);
					ug.addColorStop(1, "rgba(255,232,192,0)");
					cx.fillStyle = ug;
					cx.fillRect(x, y, colW, 1.8);
					cx.globalCompositeOperation = "source-over";
				}
				cx.restore();

			}
		}

		// carcass: sides, top header, plinth and dividers (drawn last, on top)
		const side = cx.createLinearGradient(bsX, 0, bsX + fr, 0);
		side.addColorStop(0, walnutDk);
		side.addColorStop(1, walnut);
		cx.fillStyle = side;
		cx.fillRect(bsX, bsY, fr, bsH);
		cx.fillRect(bsX + bsW - fr, bsY, fr, bsH);
		cx.fillStyle = walnut;
		cx.fillRect(bsX, bsY, bsW, fr);
		cx.fillStyle = walnutDk;
		cx.fillRect(bsX + 1, bsBot - plinth, bsW - 2, plinth);
		cx.fillStyle = "rgba(0,0,0,0.35)";
		cx.fillRect(bsX + 1, bsBot - plinth, bsW - 2, 0.6);
		for (let c = 1; c < cols; c++) {
			const dx = bsX + fr + c * (colW + div) - div;
			cx.fillStyle = walnut;
			cx.fillRect(dx, bsY + fr, div, bsH - fr - plinth);
			cx.fillStyle = "rgba(0,0,0,0.25)";
			cx.fillRect(dx + div - 0.4, bsY + fr, 0.4, bsH - fr - plinth);
		}
		// soft edge highlight on the outer right side (faces the room light)
		cx.fillStyle = "rgba(255,255,255,0.06)";
		cx.fillRect(bsX + bsW - 0.5, bsY, 0.5, bsH);

		// warm glow spilling from the open bays onto the wall beside the shelf
		if (L > 0.02) {
			const sp = cx.createLinearGradient(bsX + bsW, 0, bsX + bsW + 9, 0);
			sp.addColorStop(0, `rgba(255,206,150,${0.22 * L})`);
			sp.addColorStop(1, "rgba(255,206,150,0)");
			cx.fillStyle = sp;
			cx.fillRect(bsX + bsW, bsY + fr, 9, rowH * (rows - 1));
		}
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
	// warm mushroom-taupe velvet upholstery (luxury, pairs with walnut + smoked oak)
	const leatherTop = mix("#7b6b5c", "#302a25");
	const leatherMid = mix("#64574a", "#25201c");
	const leatherDk = mix("#483e35", "#1a1714");
	const leatherFront = mix("#574b3f", "#1f1b18");

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
		// rounded polygon: each corner is softened with a small arc (upholstery
		// has no sharp edges); radius is clamped so short edges stay clean
		const n = pts.length;
		const radius = 2.4;
		cx.beginPath();
		const m0 = {
			x: (pts[n - 1].x + pts[0].x) / 2,
			y: (pts[n - 1].y + pts[0].y) / 2,
		};
		cx.moveTo(m0.x, m0.y);
		for (let i = 0; i < n; i++) {
			const cur = pts[i];
			const nxt = pts[(i + 1) % n];
			const prv = pts[(i - 1 + n) % n];
			const r = Math.min(
				radius,
				Math.hypot(nxt.x - cur.x, nxt.y - cur.y) * 0.35,
				Math.hypot(prv.x - cur.x, prv.y - cur.y) * 0.35,
			);
			cx.arcTo(cur.x, cur.y, nxt.x, nxt.y, r);
		}
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
		// plump down-filled cushions: pinched corners, bowed edges, piping,
		// a soft centre dip, shading and a contact shadow on the backrest.
		// colour + fabric alternate (cream bouclé, camel linen, sage velvet, ivory, rust)
		const pillowCols: { c: string; boucle: boolean }[] = [
			{ c: "#e8e0d0", boucle: true },
			{ c: "#b8915f", boucle: false },
			{ c: "#8e9a80", boucle: false },
			{ c: "#efe9dd", boucle: true },
			{ c: "#a5583a", boucle: false },
		];
		const pillowPath = (l: number, t: number, w: number, h: number) => {
			const r = l + w,
				b = t + h,
				mx = l + w / 2,
				my = t + h / 2;
			const p = w * 0.07; // pinched corners
			const bw = w * 0.08; // bowed edges
			cx.beginPath();
			cx.moveTo(l + p, t + p);
			cx.quadraticCurveTo(mx, t - bw, r - p, t + p);
			cx.quadraticCurveTo(r + bw * 0.8, my, r - p, b - p);
			cx.quadraticCurveTo(mx, b + bw * 0.5, l + p, b - p);
			cx.quadraticCurveTo(l - bw * 0.8, my, l + p, t + p);
			cx.closePath();
		};
		for (let i = 0; i < 5; i++) {
			const tp = ln(tB + 0.08, tF - 0.16, i / 4);
			const pc = P(ln(uBackFront, uSeatFront, 0.32), tp, seatH + 4);
			const sc = hScale(tp);
			const pcol = pillowCols[(i + (sgn > 0 ? 2 : 0)) % pillowCols.length];
			const w = 24 * sc,
				h = 22 * sc,
				l = pc.x - 13 * sc,
				t = pc.y - 22 * sc;
			const tilt = (rnd(i * 7 + (sgn > 0 ? 50 : 0)) - 0.5) * 0.16;
			cx.save();
			cx.translate(l + w / 2, t + h);
			cx.rotate(tilt);
			cx.translate(-(l + w / 2), -(t + h));
			// contact shadow on the backrest / seat
			pillowPath(l + 1.2 * sc, t + 1.6 * sc, w, h);
			cx.fillStyle = "rgba(0,0,0,0.22)";
			cx.fill();
			// cushion body with soft volume shading
			pillowPath(l, t, w, h);
			const base = mix(pcol.c, "#2a2620");
			cx.fillStyle = base;
			cx.fill();
			const vol = cx.createRadialGradient(
				l + w * 0.42,
				t + h * 0.38,
				w * 0.05,
				l + w / 2,
				t + h / 2,
				w * 0.62,
			);
			vol.addColorStop(0, "rgba(255,255,255,0.16)");
			vol.addColorStop(0.55, "rgba(255,255,255,0)");
			vol.addColorStop(1, "rgba(0,0,0,0.28)");
			cx.fillStyle = vol;
			cx.fill();
			cx.save();
			cx.clip();
			// bouclé texture: tiny loops
			if (pcol.boucle) {
				cx.fillStyle = "rgba(0,0,0,0.07)";
				for (let k = 0; k < 70; k++) {
					cx.beginPath();
					cx.arc(
						l + rnd(i * 97 + k) * w,
						t + rnd(i * 53 + k + 7) * h,
						0.35 * sc + 0.15,
						0,
						Math.PI * 2,
					);
					cx.fill();
				}
			} else {
				// velvet / linen sheen across the top
				const sh = cx.createLinearGradient(0, t, 0, t + h * 0.5);
				sh.addColorStop(0, "rgba(255,255,255,0.12)");
				sh.addColorStop(1, "rgba(255,255,255,0)");
				cx.fillStyle = sh;
				cx.fillRect(l - 2, t - 2, w + 4, h * 0.5);
			}
			// soft centre dip (the "karate chop") with folds toward the corners
			const dip = cx.createRadialGradient(
				l + w / 2,
				t + h * 0.32,
				0,
				l + w / 2,
				t + h * 0.32,
				w * 0.18,
			);
			dip.addColorStop(0, "rgba(0,0,0,0.2)");
			dip.addColorStop(1, "rgba(0,0,0,0)");
			cx.fillStyle = dip;
			cx.fillRect(l, t, w, h);
			cx.strokeStyle = "rgba(0,0,0,0.1)";
			cx.lineWidth = 0.4 * sc;
			cx.beginPath();
			cx.moveTo(l + w / 2, t + h * 0.34);
			cx.quadraticCurveTo(l + w * 0.32, t + h * 0.3, l + w * 0.12, t + h * 0.14);
			cx.moveTo(l + w / 2, t + h * 0.34);
			cx.quadraticCurveTo(l + w * 0.68, t + h * 0.3, l + w * 0.88, t + h * 0.14);
			cx.stroke();
			cx.restore();
			// piping seam around the edge
			pillowPath(l, t, w, h);
			cx.strokeStyle = "rgba(0,0,0,0.2)";
			cx.lineWidth = 0.55 * sc;
			cx.stroke();
			cx.restore();
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
