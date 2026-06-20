"use client";
import { useEffect, useRef, useState } from "react";
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
	led: number;
	aR: number;
	aG: number;
	aB: number;
	br: number;
}

const SCENES: Record<Scene, SceneConfig> = {
	relax: {
		wT: "#efe7da",
		wB: "#e6d8c4",
		fT: "#d9cbb0",
		fB: "#bda584",
		cT: "#f8eed8",
		skyT: "#ffd27f",
		skyB: "#ff9e5a",
		sun: 1,
		led: 0,
		aR: 255,
		aG: 198,
		aB: 120,
		br: 0.68,
	},
	bright: {
		wT: "#f2f5fa",
		wB: "#e6ecf4",
		fT: "#e4dccb",
		fB: "#c8bca4",
		cT: "#fcfdff",
		skyT: "#7ec0f0",
		skyB: "#c8e4f7",
		sun: 1,
		led: 0,
		aR: 255,
		aG: 250,
		aB: 235,
		br: 1.0,
	},
	cinema: {
		wT: "#171327",
		wB: "#0c0a18",
		fT: "#241c34",
		fB: "#16102e",
		cT: "#1e1830",
		skyT: "#0a0820",
		skyB: "#161232",
		sun: 0,
		led: 1,
		aR: 90,
		aG: 70,
		aB: 200,
		br: 0.08,
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
	return `rgb(${Math.round(ln(p(a), p(b), t))},${Math.round(ln(q(a), q(b), t))},${Math.round(ln(r(a), r(b), t))})`;
}

interface DrawState extends SceneConfig {
	shade: number;
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
		led: ln(f.led, t.led, e),
		aR: ln(f.aR, t.aR, e),
		aG: ln(f.aG, t.aG, e),
		aB: ln(f.aB, t.aB, e),
		br: ln(f.br, t.br, e),
		shade: ln(f.shade, t.shade, e),
	};
}

interface RoomUI {
	vol: number;
	muted: boolean;
	audioOn: boolean;
	playing: boolean;
}

function drawRoom(
	cx: CanvasRenderingContext2D,
	s: DrawState,
	tvOn: boolean,
	video: HTMLVideoElement | null,
	ui?: RoomUI,
) {
	const fY = H * 0.62;
	const M = 150;
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
	// deterministic pseudo-random so textures don't flicker between frames
	const rnd = (i: number) => {
		const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
		return x - Math.floor(x);
	};
	// continuous "darkness" factor (0 = fully lit palette, 1 = night/cinema)
	// replaces hard `s.br < 0.4 ? dark : light` switches so materials
	// interpolate smoothly across a scene transition instead of snapping.
	const darkF = Math.max(0, Math.min(1, (0.5 - s.br) / 0.42));
	const hx = (h: string) => [
		parseInt(h.slice(1, 3), 16),
		parseInt(h.slice(3, 5), 16),
		parseInt(h.slice(5, 7), 16),
	];
	// mix light↔dark hex by the current darkF (or an explicit amount)
	const mix = (lightHex: string, darkHex: string, amt = darkF) => {
		const a = hx(lightHex),
			b = hx(darkHex);
		return `rgb(${Math.round(a[0] + (b[0] - a[0]) * amt)},${Math.round(
			a[1] + (b[1] - a[1]) * amt,
		)},${Math.round(a[2] + (b[2] - a[2]) * amt)})`;
	};

	// ── CEILING ───────────────────────────────────────────────
	const cg = cx.createLinearGradient(0, -M, 0, fY * 0.42);
	cg.addColorStop(0, s.cT);
	cg.addColorStop(1, s.wT);
	cx.fillStyle = cg;
	cx.fillRect(-M, -M, W + 2 * M, fY * 0.32 + M);

	// soft overall ceiling wash (brighter, even, premium)
	if (s.br > 0.12) {
		const wash = cx.createLinearGradient(0, -M, 0, fY * 0.34);
		wash.addColorStop(0, `rgba(255,246,228,${0.1 + s.br * 0.12})`);
		wash.addColorStop(1, "rgba(255,246,228,0)");
		cx.fillStyle = wash;
		cx.fillRect(-M, -M, W + 2 * M, fY * 0.34 + M);
	}

	// recessed ceiling downlights (brightened ~18%)
	const ceilY = fY * 0.12;
	[W * 0.34, W * 0.5, W * 0.66, W * 0.82].forEach((lx) => {
		cx.fillStyle = "rgba(0,0,0,0.10)";
		cx.beginPath();
		cx.ellipse(lx, ceilY, 4, 2.4, 0, 0, Math.PI * 2);
		cx.fill();
		cx.fillStyle =
			s.br > 0.2
				? `rgba(255,242,212,${Math.min(1, 0.62 + s.br * 0.46)})`
				: "rgba(95,95,115,0.5)";
		cx.beginPath();
		cx.ellipse(lx, ceilY, 2, 1.2, 0, 0, Math.PI * 2);
		cx.fill();
		if (s.br > 0.15) {
			const dl = cx.createRadialGradient(lx, ceilY, 0, lx, ceilY, 66 * s.br);
			dl.addColorStop(0, `rgba(${s.aR},${s.aG},${s.aB},${s.br * 0.12})`);
			dl.addColorStop(1, "rgba(0,0,0,0)");
			cx.fillStyle = dl;
			cx.beginPath();
			cx.moveTo(lx, ceilY);
			cx.lineTo(lx + 42 * s.br, fY);
			cx.lineTo(lx - 42 * s.br, fY);
			cx.closePath();
			cx.fill();
		}
	});

	// flush in-ceiling architectural speakers (whole-home audio)
	[W * 0.42, W * 0.74].forEach((sx) => {
		const sy = fY * 0.055;
		cx.fillStyle = mix("#d8d2c6", "#1a1a1e");
		cx.beginPath();
		cx.ellipse(sx, sy, 6, 3.4, 0, 0, Math.PI * 2);
		cx.fill();
		cx.strokeStyle = "rgba(0,0,0,0.18)";
		cx.lineWidth = 0.5;
		cx.beginPath();
		cx.ellipse(sx, sy, 6, 3.4, 0, 0, Math.PI * 2);
		cx.stroke();
		// perforated grille dots
		cx.fillStyle = "rgba(0,0,0,0.22)";
		for (let gx = -4; gx <= 4; gx += 2) {
			for (let gy = -2; gy <= 2; gy += 2) {
				if (gx * gx * 0.3 + gy * gy < 6) {
					cx.beginPath();
					cx.ellipse(sx + gx, sy + gy * 0.6, 0.5, 0.3, 0, 0, Math.PI * 2);
					cx.fill();
				}
			}
		}
	});

	// hidden LED cove (warm indirect, slightly stronger)
	const coveY = fY * 0.32;
	const coveGrad = cx.createLinearGradient(0, coveY - 3, 0, coveY + 24);
	const coveA = 0.26 + s.br * 0.34 + s.led * 0.25;
	coveGrad.addColorStop(0, `rgba(255,216,154,${Math.min(0.85, coveA)})`);
	coveGrad.addColorStop(1, "rgba(255,216,154,0)");
	cx.fillStyle = coveGrad;
	cx.fillRect(-M, coveY - 3, W + 2 * M, 28);
	cx.fillStyle = `rgba(255,226,174,${0.4 + s.br * 0.32})`;
	cx.fillRect(-M, coveY - 2, W + 2 * M, 1.5);

	// ── BACK WALL ─────────────────────────────────────────────
	const wg = cx.createLinearGradient(0, coveY, 0, fY);
	wg.addColorStop(0, s.wT);
	wg.addColorStop(1, s.wB);
	cx.fillStyle = wg;
	cx.fillRect(-M, coveY, W + 2 * M, fY - coveY);

	// ── TRAVERTINE FLOOR ──────────────────────────────────────
	const fg = cx.createLinearGradient(0, fY, 0, H + M);
	fg.addColorStop(0, s.fT);
	fg.addColorStop(1, s.fB);
	cx.fillStyle = fg;
	cx.fillRect(-M, fY, W + 2 * M, H - fY + M);

	// large-format stone seams (perspective)
	const vanX = W * 0.5;
	cx.strokeStyle = "rgba(0,0,0,0.06)";
	cx.lineWidth = 0.5;
	for (let i = 0; i <= 6; i++) {
		const tx = i / 6;
		cx.beginPath();
		cx.moveTo(ln(vanX, vanX, tx), fY);
		cx.lineTo(ln(-M, W + M, tx), H + M);
		cx.stroke();
	}
	for (let i = 1; i < 6; i++) {
		const y = fY + (H + M - fY) * Math.pow(i / 6, 1.7);
		cx.beginPath();
		cx.moveTo(-M, y);
		cx.lineTo(W + M, y);
		cx.stroke();
	}
	// travertine mottling + veins (deterministic, subtle)
	cx.save();
	cx.beginPath();
	cx.rect(-M, fY, W + 2 * M, H - fY + M);
	cx.clip();
	for (let i = 0; i < 90; i++) {
		const px = ln(-M, W + M, rnd(i));
		const py = ln(fY, H + M, rnd(i + 50));
		const rad = 6 + rnd(i + 100) * 16;
		const tone = rnd(i + 150);
		cx.fillStyle =
			tone > 0.5
				? `rgba(255,250,235,${0.05 + rnd(i + 7) * 0.05})`
				: `rgba(120,95,60,${0.04 + rnd(i + 9) * 0.05})`;
		cx.beginPath();
		cx.ellipse(px, py, rad, rad * 0.4, rnd(i) * 3, 0, Math.PI * 2);
		cx.fill();
	}
	for (let i = 0; i < 22; i++) {
		const py = ln(fY + 4, H + M, rnd(i + 200));
		cx.strokeStyle = `rgba(150,120,80,${0.04 + rnd(i + 3) * 0.05})`;
		cx.lineWidth = 0.5;
		cx.beginPath();
		cx.moveTo(-M, py + rnd(i) * 4);
		cx.bezierCurveTo(
			W * 0.3,
			py - 3 + rnd(i + 1) * 6,
			W * 0.6,
			py + 3 - rnd(i + 2) * 6,
			W + M,
			py + rnd(i + 4) * 4,
		);
		cx.stroke();
	}
	cx.restore();
	// floor base-of-wall contact shadow
	const fsh = cx.createLinearGradient(0, fY, 0, fY + 26);
	fsh.addColorStop(0, "rgba(0,0,0,0.10)");
	fsh.addColorStop(1, "rgba(0,0,0,0)");
	cx.fillStyle = fsh;
	cx.fillRect(-M, fY, W + 2 * M, 26);

	// ── WALNUT SLAT FEATURE WALL (right, behind TV) ───────────
	const fwX = W * 0.5,
		fwW = W + M - fwX,
		fwTop = coveY,
		fwBot = fY;
	const woodDark = 1 - darkF * 0.55;
	const slatW = 13;
	for (let x = fwX; x < fwX + fwW; x += slatW) {
		const t = (x - fwX) / fwW;
		const base = 74 + Math.sin(x * 0.7) * 8;
		const sg = cx.createLinearGradient(x, 0, x + slatW, 0);
		sg.addColorStop(
			0,
			`rgb(${Math.round(base * woodDark)},${Math.round(base * 0.62 * woodDark)},${Math.round(base * 0.4 * woodDark)})`,
		);
		sg.addColorStop(
			0.5,
			`rgb(${Math.round((base + 16) * woodDark)},${Math.round((base + 6) * 0.62 * woodDark)},${Math.round((base + 2) * 0.4 * woodDark)})`,
		);
		sg.addColorStop(
			1,
			`rgb(${Math.round((base - 10) * woodDark)},${Math.round((base - 10) * 0.6 * woodDark)},${Math.round((base - 12) * 0.4 * woodDark)})`,
		);
		cx.fillStyle = sg;
		cx.fillRect(x, fwTop, slatW - 1.5, fwBot - fwTop);
		// gap shadow
		cx.fillStyle = "rgba(0,0,0,0.22)";
		cx.fillRect(x + slatW - 1.5, fwTop, 1.5, fwBot - fwTop);
		// faint grain
		cx.strokeStyle = "rgba(40,25,12,0.12)";
		cx.lineWidth = 0.5;
		cx.beginPath();
		cx.moveTo(x + 3 + t, fwTop);
		cx.lineTo(x + 4 + Math.sin(x) * 1.5, fwBot);
		cx.stroke();
	}
	// soft vignette on wood from cove light
	const woodGlow = cx.createLinearGradient(0, fwTop, 0, fwTop + 50);
	woodGlow.addColorStop(0, `rgba(255,220,160,${0.12 + s.br * 0.12})`);
	woodGlow.addColorStop(1, "rgba(0,0,0,0)");
	cx.fillStyle = woodGlow;
	cx.fillRect(fwX, fwTop, fwW, 50);

	// ── FLOOR-TO-CEILING WINDOW (left) ────────────────────────
	const wX = 22,
		wY = coveY + 6,
		wW = W * 0.32,
		wH = fY - wY - 4;
	// outer thin frame
	cx.fillStyle = mix("#2a2622", "#10100f");
	rr(wX - 5, wY - 5, wW + 10, wH + 10, 2);
	cx.fill();
	// sky / outdoor scenery
	const skg = cx.createLinearGradient(wX, wY, wX, wY + wH);
	skg.addColorStop(0, s.skyT);
	skg.addColorStop(1, s.skyB);
	cx.fillStyle = skg;
	cx.fillRect(wX, wY, wW, wH);
	// distant mountains
	cx.fillStyle = "rgba(80,95,120,0.35)";
	cx.beginPath();
	cx.moveTo(wX, wY + wH * 0.5);
	cx.lineTo(wX + wW * 0.25, wY + wH * 0.36);
	cx.lineTo(wX + wW * 0.5, wY + wH * 0.5);
	cx.lineTo(wX + wW * 0.78, wY + wH * 0.33);
	cx.lineTo(wX + wW, wY + wH * 0.48);
	cx.lineTo(wX + wW, wY + wH * 0.62);
	cx.lineTo(wX, wY + wH * 0.62);
	cx.closePath();
	cx.fill();
	if (s.sun > 0.01) {
		cx.fillStyle = `rgba(255,240,170,${0.85 * s.sun})`;
		cx.beginPath();
		cx.arc(wX + wW * 0.7, wY + wH * 0.26, 12, 0, Math.PI * 2);
		cx.fill();
		cx.fillStyle = `rgba(255,240,170,${0.18 * s.sun})`;
		cx.beginPath();
		cx.arc(wX + wW * 0.7, wY + wH * 0.26, 22, 0, Math.PI * 2);
		cx.fill();
	}
	// landscaped garden hedge
	const hedge = cx.createLinearGradient(0, wY + wH * 0.6, 0, wY + wH);
	hedge.addColorStop(0, "rgba(70,120,60,0.55)");
	hedge.addColorStop(1, "rgba(40,80,40,0.7)");
	cx.fillStyle = hedge;
	cx.beginPath();
	cx.moveTo(wX, wY + wH * 0.72);
	for (let i = 0; i <= 8; i++) {
		const hx = wX + (wW * i) / 8;
		cx.quadraticCurveTo(
			hx - wW / 16,
			wY + wH * (0.66 + rnd(i) * 0.06),
			hx,
			wY + wH * 0.72,
		);
	}
	cx.lineTo(wX + wW, wY + wH);
	cx.lineTo(wX, wY + wH);
	cx.closePath();
	cx.fill();
	// glass reflection sheen
	const sheen = cx.createLinearGradient(wX, wY, wX + wW, wY + wH);
	sheen.addColorStop(0, "rgba(255,255,255,0.10)");
	sheen.addColorStop(0.3, "rgba(255,255,255,0.02)");
	sheen.addColorStop(1, "rgba(255,255,255,0)");
	cx.fillStyle = sheen;
	cx.fillRect(wX, wY, wW, wH);

	// mullion (single thin vertical divider)
	cx.fillStyle = darkF > 0.5 ? "rgba(20,18,16,0.9)" : "rgba(45,40,35,0.8)";
	cx.fillRect(wX + wW / 2 - 1, wY, 2, wH);

	// motorized roller shade (premium woven fabric, partial translucency)
	const shPx = Math.round(wH * (s.shade / 100));
	if (shPx > 0) {
		cx.save();
		cx.beginPath();
		cx.rect(wX, wY, wW, shPx);
		cx.clip();
		// base fabric gradient (warm oatmeal linen)
		const fab = cx.createLinearGradient(wX, wY, wX + wW, wY);
		fab.addColorStop(0, "#e8ddc8");
		fab.addColorStop(0.5, "#ddd0b6");
		fab.addColorStop(1, "#d2c4a6");
		cx.fillStyle = fab;
		cx.fillRect(wX, wY, wW, shPx);
		// daylight glow passing through the translucent weave
		if (s.sun > 0.05) {
			const trans = cx.createLinearGradient(wX, wY, wX, wY + shPx);
			trans.addColorStop(0, `rgba(255,244,210,${0.25 * s.sun})`);
			trans.addColorStop(1, "rgba(255,244,210,0)");
			cx.fillStyle = trans;
			cx.fillRect(wX, wY, wW, shPx);
		}
		// fine vertical weave threads
		cx.strokeStyle = "rgba(150,132,98,0.18)";
		cx.lineWidth = 0.5;
		for (let x = wX + 2; x < wX + wW; x += 3) {
			cx.beginPath();
			cx.moveTo(x, wY);
			cx.lineTo(x, wY + shPx);
			cx.stroke();
		}
		// horizontal weave + subtle fabric folds
		cx.strokeStyle = "rgba(150,132,98,0.10)";
		for (let y = wY + 3; y < wY + shPx; y += 4) {
			cx.beginPath();
			cx.moveTo(wX, y);
			cx.lineTo(wX + wW, y);
			cx.stroke();
		}
		for (let i = 0; i < 4; i++) {
			const fx = wX + (wW * (i + 0.5)) / 4;
			const fold = cx.createLinearGradient(fx - 8, 0, fx + 8, 0);
			fold.addColorStop(0, "rgba(255,255,255,0)");
			fold.addColorStop(0.5, "rgba(255,255,255,0.10)");
			fold.addColorStop(1, "rgba(0,0,0,0.05)");
			cx.fillStyle = fold;
			cx.fillRect(fx - 8, wY, 16, shPx);
		}
		cx.restore();
		// weighted hem bar at the bottom edge
		const hemY = wY + shPx - 4;
		const hem = cx.createLinearGradient(0, hemY, 0, hemY + 4);
		hem.addColorStop(0, "#b9a982");
		hem.addColorStop(1, "#8f8262");
		cx.fillStyle = hem;
		cx.fillRect(wX, hemY, wW, 4);
		cx.fillStyle = "rgba(255,255,255,0.18)";
		cx.fillRect(wX, hemY, wW, 1);
	}
	// hidden motorized housing recessed into the ceiling above the window
	const houseG = cx.createLinearGradient(0, wY - 8, 0, wY);
	houseG.addColorStop(0, mix("#2c2823", "#15140f"));
	houseG.addColorStop(1, mix("#1d1a16", "#0c0b08"));
	cx.fillStyle = houseG;
	cx.fillRect(wX - 5, wY - 9, wW + 10, 9);
	cx.fillStyle = "rgba(0,0,0,0.3)";
	cx.fillRect(wX - 5, wY - 1, wW + 10, 1.5);

	// frame outline
	cx.strokeStyle = darkF > 0.5 ? "rgba(10,10,9,0.9)" : "rgba(40,36,32,0.7)";
	cx.lineWidth = 3;
	cx.strokeRect(wX, wY, wW, wH);

	// ── WALL SMART CONTROL PANEL (glass touchscreen) ──────────
	const pX = wX + wW + 14,
		pY = coveY + 26,
		pW = 30,
		pH = 46;
	// recess shadow
	cx.fillStyle = "rgba(0,0,0,0.16)";
	rr(pX - 2, pY - 1, pW + 4, pH + 4, 4);
	cx.fill();
	// dark aluminium frame
	cx.fillStyle = "#101013";
	rr(pX, pY, pW, pH, 3);
	cx.fill();
	// glass screen
	const scr = cx.createLinearGradient(pX, pY, pX + pW, pY + pH);
	scr.addColorStop(0, "#1b2230");
	scr.addColorStop(1, "#0d1118");
	cx.fillStyle = scr;
	rr(pX + 2, pY + 2, pW - 4, pH - 4, 2);
	cx.fill();
	// glass reflection sheen
	cx.fillStyle = "rgba(255,255,255,0.06)";
	cx.beginPath();
	cx.moveTo(pX + 2, pY + 2);
	cx.lineTo(pX + pW - 4, pY + 2);
	cx.lineTo(pX + 2, pY + pH * 0.5);
	cx.closePath();
	cx.fill();
	// UI: title bar
	cx.fillStyle = "rgba(120,170,255,0.85)";
	cx.fillRect(pX + 5, pY + 6, 10, 1.4);
	// UI: three scene dots (active one warm)
	const sceneCols = ["#e0a23c", "#5aa0e0", "#8b7ae0"];
	const activeIdx = s.br > 0.85 ? 1 : s.br < 0.3 ? 2 : 0;
	sceneCols.forEach((col, i) => {
		cx.fillStyle = i === activeIdx ? col : "rgba(255,255,255,0.18)";
		cx.beginPath();
		cx.arc(pX + 8 + i * 7, pY + 14, 2, 0, Math.PI * 2);
		cx.fill();
	});
	// UI: TV / Audio status rows (reflect live state)
	const audioOn = ui ? ui.audioOn : true;
	const muted = ui ? ui.muted : false;
	const playing = ui ? ui.playing : false;
	const vol = ui ? ui.vol : 60;
	cx.fillStyle = "rgba(255,255,255,0.22)";
	cx.fillRect(pX + 5, pY + 21, pW - 14, 1.2);
	cx.fillStyle = tvOn ? "rgba(110,200,120,0.9)" : "rgba(255,255,255,0.3)";
	cx.beginPath();
	cx.arc(pX + pW - 7, pY + 21.5, 1.8, 0, Math.PI * 2);
	cx.fill();
	cx.fillStyle = "rgba(255,255,255,0.22)";
	cx.fillRect(pX + 5, pY + 27, pW - 14, 1.2);
	cx.fillStyle = audioOn ? "rgba(110,200,120,0.9)" : "rgba(255,255,255,0.3)";
	cx.beginPath();
	cx.arc(pX + pW - 7, pY + 27.5, 1.8, 0, Math.PI * 2);
	cx.fill();
	// small play/pause + mute glyphs on the audio row
	cx.fillStyle = "rgba(255,255,255,0.5)";
	if (playing) {
		cx.fillRect(pX + 6, pY + 25.6, 1.2, 3.6);
		cx.fillRect(pX + 8, pY + 25.6, 1.2, 3.6);
	} else {
		cx.beginPath();
		cx.moveTo(pX + 6, pY + 25.6);
		cx.lineTo(pX + 6, pY + 29.2);
		cx.lineTo(pX + 9, pY + 27.4);
		cx.closePath();
		cx.fill();
	}
	// UI: volume slider (real-time, dims when muted)
	cx.fillStyle = "rgba(255,255,255,0.16)";
	cx.fillRect(pX + 5, pY + 33, pW - 10, 2);
	cx.fillStyle = muted ? "rgba(150,160,180,0.5)" : "rgba(120,170,255,0.95)";
	cx.fillRect(pX + 5, pY + 33, (pW - 10) * (muted ? 0 : vol / 100), 2);
	// slider knob
	if (!muted) {
		cx.fillStyle = "rgba(220,235,255,0.95)";
		cx.beginPath();
		cx.arc(pX + 5 + (pW - 10) * (vol / 100), pY + 34, 1.6, 0, Math.PI * 2);
		cx.fill();
	}
	// UI: shades slider reflecting current shade
	cx.fillStyle = "rgba(255,255,255,0.16)";
	cx.fillRect(pX + 5, pY + 39, pW - 10, 2);
	cx.fillStyle = "rgba(230,200,150,0.9)";
	cx.fillRect(pX + 5, pY + 39, (pW - 10) * (s.shade / 100), 2);

	// ── VOLUME KEYPAD (rotary + LED dots) ─────────────────────
	const kX = pX + pW + 8,
		kY = pY + 8,
		kW = 16,
		kH = 30;
	cx.fillStyle = "rgba(0,0,0,0.14)";
	rr(kX - 1, kY, kW + 2, kH + 2, 3);
	cx.fill();
	cx.fillStyle = mix("#1d1d20", "#141417");
	rr(kX, kY, kW, kH, 3);
	cx.fill();
	// rotary dial
	const dialY = kY + 9;
	const dial = cx.createRadialGradient(
		kX + kW / 2 - 1,
		dialY - 1,
		0,
		kX + kW / 2,
		dialY,
		6,
	);
	dial.addColorStop(0, "#3a3a40");
	dial.addColorStop(1, "#141417");
	cx.fillStyle = dial;
	cx.beginPath();
	cx.arc(kX + kW / 2, dialY, 5.5, 0, Math.PI * 2);
	cx.fill();
	cx.strokeStyle = "rgba(120,170,255,0.7)";
	cx.lineWidth = 1;
	cx.beginPath();
	cx.moveTo(kX + kW / 2, dialY);
	cx.lineTo(kX + kW / 2 + 3, dialY - 4);
	cx.stroke();
	// LED level dots
	for (let i = 0; i < 4; i++) {
		cx.fillStyle = i < 3 ? "rgba(120,200,255,0.9)" : "rgba(255,255,255,0.18)";
		cx.beginPath();
		cx.arc(kX + 4 + i * 3, kY + kH - 5, 1, 0, Math.PI * 2);
		cx.fill();
	}

	// daylight wash on floor from window
	if (s.sun > 0.05 && s.shade < 60) {
		const beam = cx.createLinearGradient(wX, fY, wX + wW * 1.4, H);
		const ba = s.sun * (1 - s.shade / 100) * 0.16;
		beam.addColorStop(0, `rgba(255,240,200,${ba})`);
		beam.addColorStop(1, "rgba(255,240,200,0)");
		cx.fillStyle = beam;
		cx.beginPath();
		cx.moveTo(wX, fY);
		cx.lineTo(wX + wW, fY);
		cx.lineTo(wX + wW * 1.7, H);
		cx.lineTo(wX - wW * 0.2, H);
		cx.closePath();
		cx.fill();
	}

	// ── FLUSH TV (on walnut wall) ─────────────────────────────
	const tvX = W - 205,
		tvY = fY - 150,
		tvW = 176,
		tvH = 104;

	// premium flush in-wall speakers flanking the TV (fabric grille)
	[tvX - 22, tvX + tvW + 6].forEach((spx) => {
		const spy = tvY + 6,
			spw = 16,
			sph = tvH - 12;
		cx.fillStyle = "rgba(0,0,0,0.22)";
		rr(spx - 1, spy - 1, spw + 2, sph + 2, 3);
		cx.fill();
		// linen grille cloth
		const grille = cx.createLinearGradient(spx, spy, spx + spw, spy);
		grille.addColorStop(0, mix("#cfc4ae", "#1c1b1f"));
		grille.addColorStop(1, mix("#b6ab93", "#141318"));
		cx.fillStyle = grille;
		rr(spx, spy, spw, sph, 2);
		cx.fill();
		// fine perforation weave
		cx.fillStyle = "rgba(0,0,0,0.10)";
		for (let gy = spy + 3; gy < spy + sph - 2; gy += 3) {
			for (let gx = spx + 3; gx < spx + spw - 2; gx += 3) {
				cx.beginPath();
				cx.arc(gx, gy, 0.45, 0, Math.PI * 2);
				cx.fill();
			}
		}
		cx.strokeStyle = "rgba(0,0,0,0.12)";
		cx.lineWidth = 0.5;
		rr(spx, spy, spw, sph, 2);
		cx.stroke();
	});

	// ambient bias backlight behind the panel (premium, subtle)
	if (s.br < 0.5 || tvOn) {
		const biasA = tvOn ? 0.18 : 0.08 + darkF * 0.1;
		const bias = cx.createRadialGradient(
			tvX + tvW / 2,
			tvY + tvH / 2,
			tvH * 0.4,
			tvX + tvW / 2,
			tvY + tvH / 2,
			tvW * 0.85,
		);
		bias.addColorStop(0, `rgba(90,150,255,${biasA})`);
		bias.addColorStop(1, "rgba(90,150,255,0)");
		cx.fillStyle = bias;
		cx.fillRect(tvX - 40, tvY - 34, tvW + 80, tvH + 68);
	}

	// recessed shadow into wall
	cx.fillStyle = "rgba(0,0,0,0.28)";
	rr(tvX - 5, tvY - 4, tvW + 10, tvH + 9, 4);
	cx.fill();
	// ultra-thin bezel
	cx.fillStyle = "#0a0a0d";
	rr(tvX - 2, tvY - 2, tvW + 4, tvH + 4, 3);
	cx.fill();
	cx.fillStyle = "#040406";
	rr(tvX, tvY, tvW, tvH, 2);
	cx.fill();
	if (tvOn) {
		const innerX = tvX + 2,
			innerY = tvY + 2,
			innerW = tvW - 4,
			innerH = tvH - 4;

		cx.fillStyle = `rgba(80,140,255,0.10)`;
		cx.fillRect(tvX - 30, tvY - 20, tvW + 60, tvH + 40);

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
	// glass reflection across the panel (subtle, even when off)
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

	// ── LOW MEDIA CONSOLE under TV ────────────────────────────
	const cabX = tvX - 24,
		cabY = fY - 26,
		cabW = tvW + 70,
		cabH = 20;
	cx.fillStyle = "rgba(0,0,0,0.18)";
	cx.beginPath();
	cx.ellipse(cabX + cabW / 2, fY + 2, cabW * 0.5, 7, 0, 0, Math.PI * 2);
	cx.fill();
	const cabG = cx.createLinearGradient(0, cabY, 0, cabY + cabH);
	cabG.addColorStop(0, mix("#46321f", "#23170d"));
	cabG.addColorStop(1, mix("#33240f", "#160e07"));
	cx.fillStyle = cabG;
	rr(cabX, cabY, cabW, cabH, 2);
	cx.fill();
	cx.fillStyle = "rgba(255,255,255,0.05)";
	cx.fillRect(cabX, cabY, cabW, 1.5);
	// console floating LED underglow
	if (s.led > 0.01 || s.br < 0.4) {
		const u = Math.max(s.led, s.br < 0.4 ? 0.5 : 0);
		const ug = cx.createLinearGradient(0, cabY + cabH, 0, cabY + cabH + 30);
		ug.addColorStop(0, `rgba(70,130,255,${0.3 * u})`);
		ug.addColorStop(1, "rgba(70,130,255,0)");
		cx.fillStyle = ug;
		cx.fillRect(cabX + 4, cabY + cabH, cabW - 8, 30);
	}
	// decor object on console
	cx.fillStyle = mix("#cfc4b0", "#3a3a44");
	rr(cabX + 14, cabY - 12, 8, 12, 1);
	cx.fill();

	// ── BOUCLÉ MODULAR SECTIONAL (center) ─────────────────────
	const soX = 96,
		soY = fY - 70,
		soW = 188,
		soH = 70;
	const boucleBase = mix("#e8e2d4", "#3b3a42");
	const boucleDk = mix("#d2cabb", "#2c2b33");
	const boucleSh = mix("#c0b7a6", "#222127");
	// soft floor shadow
	cx.fillStyle = "rgba(0,0,0,0.16)";
	cx.beginPath();
	cx.ellipse(soX + soW / 2, fY + 4, soW * 0.6, 12, 0, 0, Math.PI * 2);
	cx.fill();
	// chaise (extends left, lower)
	const chX = soX - 56,
		chW = 64;
	cx.fillStyle = boucleDk;
	rr(chX, soY + 26, chW + 8, soH - 22, 10);
	cx.fill();
	cx.fillStyle = boucleBase;
	rr(chX, soY + 20, chW, soH - 18, 9);
	cx.fill();
	// base / seat block
	cx.fillStyle = boucleSh;
	rr(soX - 6, soY + 30, soW + 12, soH - 24, 10);
	cx.fill();
	// backrest
	const backG = cx.createLinearGradient(soX, soY, soX, soY + soH * 0.55);
	backG.addColorStop(0, boucleBase);
	backG.addColorStop(1, boucleDk);
	cx.fillStyle = backG;
	rr(soX, soY, soW, soH * 0.56, { upperLeft: 12, upperRight: 12 });
	cx.fill();
	// armrests
	cx.fillStyle = boucleBase;
	rr(soX - 16, soY + 16, 20, soH - 12, { upperLeft: 9, lowerLeft: 9 });
	cx.fill();
	rr(soX + soW - 4, soY + 16, 20, soH - 12, { upperRight: 9, lowerRight: 9 });
	cx.fill();
	// seat cushions (with compression)
	const seatG = cx.createLinearGradient(soX, soY + soH * 0.42, soX, soY + soH);
	seatG.addColorStop(0, boucleBase);
	seatG.addColorStop(1, boucleDk);
	const nSeat = 3;
	const seatW = (soW - 12) / nSeat;
	for (let i = 0; i < nSeat; i++) {
		const cxx = soX + 6 + i * seatW;
		cx.fillStyle = seatG;
		rr(cxx + 2, soY + soH * 0.42, seatW - 4, soH * 0.42, 8);
		cx.fill();
		cx.strokeStyle = "rgba(0,0,0,0.06)";
		cx.lineWidth = 0.5;
		rr(cxx + 2, soY + soH * 0.42, seatW - 4, soH * 0.42, 8);
		cx.stroke();
	}
	// back cushions
	for (let i = 0; i < nSeat; i++) {
		const cxx = soX + 6 + i * seatW;
		cx.fillStyle = boucleBase;
		rr(cxx + 3, soY + 4, seatW - 6, soH * 0.4, 8);
		cx.fill();
		cx.strokeStyle = "rgba(0,0,0,0.05)";
		cx.lineWidth = 0.5;
		rr(cxx + 3, soY + 4, seatW - 6, soH * 0.4, 8);
		cx.stroke();
	}
	// bouclé stipple texture
	cx.save();
	cx.beginPath();
	cx.rect(soX - 16, soY, soW + 36, soH);
	cx.rect(chX, soY + 20, chW, soH);
	cx.clip();
	cx.fillStyle =
		darkF > 0.5 ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.07)";
	for (let i = 0; i < 260; i++) {
		const px = ln(chX, soX + soW + 16, rnd(i + 11));
		const py = ln(soY + 2, soY + soH, rnd(i + 71));
		cx.beginPath();
		cx.arc(px, py, 0.7, 0, Math.PI * 2);
		cx.fill();
	}
	cx.fillStyle = "rgba(0,0,0,0.04)";
	for (let i = 0; i < 160; i++) {
		const px = ln(chX, soX + soW + 16, rnd(i + 211));
		const py = ln(soY + 2, soY + soH, rnd(i + 271));
		cx.beginPath();
		cx.arc(px, py, 0.6, 0, Math.PI * 2);
		cx.fill();
	}
	cx.restore();
	// accent throw pillows
	cx.fillStyle = mix("#b06a55", "#5a3a44");
	rr(soX + 12, soY + soH * 0.34, 26, 26, 5);
	cx.fill();
	cx.fillStyle = mix("#6f8a86", "#3a4a54");
	rr(soX + soW - 44, soY + soH * 0.34, 26, 26, 5);
	cx.fill();

	// ── DESIGNER COFFEE TABLE + BOOKS ─────────────────────────
	const ctX = soX + soW / 2 - 44,
		ctY = fY - 18,
		ctW = 92,
		ctH = 9;
	cx.fillStyle = "rgba(0,0,0,0.16)";
	cx.beginPath();
	cx.ellipse(ctX + ctW / 2, ctY + ctH + 12, ctW * 0.55, 7, 0, 0, Math.PI * 2);
	cx.fill();
	// slim marble/oak top
	const topG = cx.createLinearGradient(ctX, ctY, ctX, ctY + ctH);
	topG.addColorStop(0, mix("#efe9dd", "#2a2620"));
	topG.addColorStop(1, mix("#d8cfbe", "#1c1914"));
	cx.fillStyle = topG;
	rr(ctX, ctY, ctW, ctH, 2);
	cx.fill();
	cx.fillStyle = "rgba(255,255,255,0.10)";
	cx.fillRect(ctX, ctY, ctW, 1.5);
	// thin metal legs
	cx.strokeStyle = mix("#8a8378", "#33312c");
	cx.lineWidth = 1.5;
	cx.beginPath();
	cx.moveTo(ctX + 10, ctY + ctH);
	cx.lineTo(ctX + 7, ctY + ctH + 14);
	cx.moveTo(ctX + ctW - 10, ctY + ctH);
	cx.lineTo(ctX + ctW - 7, ctY + ctH + 14);
	cx.stroke();
	// stacked premium books
	cx.fillStyle = mix("#8a9bb0", "#3a4250");
	rr(ctX + 14, ctY - 6, 30, 6, 1);
	cx.fill();
	cx.fillStyle = mix("#c07a6a", "#503a3a");
	rr(ctX + 17, ctY - 10, 26, 5, 1);
	cx.fill();
	// vase with stems
	cx.fillStyle = mix("#9fae9a", "#2a3a34");
	rr(ctX + ctW - 30, ctY - 16, 9, 16, 2);
	cx.fill();
	cx.strokeStyle = mix("#5f7a55", "#3a5a44");
	cx.lineWidth = 1;
	cx.beginPath();
	cx.moveTo(ctX + ctW - 26, ctY - 16);
	cx.lineTo(ctX + ctW - 30, ctY - 30);
	cx.moveTo(ctX + ctW - 24, ctY - 16);
	cx.lineTo(ctX + ctW - 20, ctY - 28);
	cx.stroke();


	// ── GLOBAL LIGHTING ATMOSPHERE ────────────────────────────
	if (s.br > 0.1) {
		const amb = cx.createRadialGradient(
			W * 0.55,
			fY * 0.5,
			30,
			W * 0.55,
			fY * 0.6,
			W * 0.8,
		);
		amb.addColorStop(0, `rgba(${s.aR},${s.aG},${s.aB},${s.br * 0.13})`);
		amb.addColorStop(1, "rgba(0,0,0,0)");
		cx.fillStyle = amb;
		cx.fillRect(-M, -M, W + 2 * M, H + 2 * M);
	}
	// corner vignette for depth
	const vig = cx.createRadialGradient(
		W / 2,
		fY * 0.7,
		W * 0.35,
		W / 2,
		fY * 0.7,
		W * 0.85,
	);
	vig.addColorStop(0, "rgba(0,0,0,0)");
	vig.addColorStop(1, "rgba(0,0,0,0.18)");
	cx.fillStyle = vig;
	cx.fillRect(-M, -M, W + 2 * M, H + 2 * M);

	if (s.br < 0.3) {
		cx.fillStyle = `rgba(10,8,24,${(0.3 - s.br) * 0.8})`;
		cx.fillRect(-M, -M, W + 2 * M, H + 2 * M);
	}
}

export default function RoomAutomation() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [scene, setScene] = useState<Scene>("relax");
	const [tvOn, setTvOn] = useState(false);
	const [closed, setClosed] = useState(false);
	const [transitioning, setTransitioning] = useState(false);
	const [audioOn, setAudioOn] = useState(true);
	const [muted, setMuted] = useState(false);
	const [playing, setPlaying] = useState(false);
	const [volume, setVolume] = useState(45);

	const animRef = useRef<number | null>(null);
	const curS = useRef<DrawState>({ ...SCENES.relax, shade: 0 });
	const tvRef = useRef(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const videoLoopRef = useRef<number | null>(null);
	// live UI state mirrored onto the on-canvas control panel
	const uiRef = useRef({
		vol: 45,
		muted: false,
		audioOn: true,
		playing: false,
	});

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

		const ZOOM = 0.82;
		const scale = Math.max(cw / W, ch / H) * ZOOM;
		const offX = (cw - W * scale) / 2;
		const offY = Math.max(0, (ch - H * scale) / 2);
		ctx.setTransform(scale * dpr, 0, 0, scale * dpr, offX * dpr, offY * dpr);

		drawRoom(ctx, curS.current, tvRef.current, videoRef.current, uiRef.current);
	}

	function videoTick() {
		render();
		videoLoopRef.current = requestAnimationFrame(videoTick);
	}

	function startAnim(newTo: Partial<DrawState>, onDone?: () => void) {
		const fromS: DrawState = { ...curS.current };
		const toS: DrawState = { ...fromS, ...newTo };
		let start: number | null = null;
		if (animRef.current) cancelAnimationFrame(animRef.current);
		function tick(ts: number) {
			if (!start) start = ts;
			const t = Math.min((ts - start) / DUR, 1);
			curS.current = blend(fromS, toS, ease(t));
			render();
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
		render();
		const canvas = canvasRef.current;
		let ro: ResizeObserver | undefined;
		if (canvas && typeof ResizeObserver !== "undefined") {
			ro = new ResizeObserver(() => render());
			ro.observe(canvas);
		}
		const onResize = () => render();
		window.addEventListener("resize", onResize);
		return () => {
			if (animRef.current) cancelAnimationFrame(animRef.current);
			if (videoLoopRef.current) cancelAnimationFrame(videoLoopRef.current);
			if (ro) ro.disconnect();
			window.removeEventListener("resize", onResize);
		};
	}, []);

	function handleScene(s: Scene) {
		// ignore scene requests while a transition is already running
		if (transitioning || s === scene) return;
		setScene(s);
		setTransitioning(true);
		startAnim({ ...SCENES[s], shade: curS.current.shade }, () => {
			setTransitioning(false);
		});
	}

	function handleTv(checked: boolean) {
		tvRef.current = checked;
		setTvOn(checked);
		const video = videoRef.current;
		if (checked) {
			if (video) {
				video.currentTime = 0;
				void video.play().catch(() => {});
			}
			setPlaying(true);
			uiRef.current.playing = true;
			if (videoLoopRef.current === null) videoTick();
		} else {
			if (videoLoopRef.current !== null) {
				cancelAnimationFrame(videoLoopRef.current);
				videoLoopRef.current = null;
			}
			if (video) {
				video.pause();
				video.currentTime = 0;
			}
			setPlaying(false);
			uiRef.current.playing = false;
			render();
		}
	}

	function handleBlinds(checked: boolean) {
		setClosed(checked);
		startAnim({ shade: checked ? 100 : 0 });
	}

	function handleVolume(v: number) {
		setVolume(v);
		uiRef.current.vol = v;
		if (v > 0 && muted) {
			setMuted(false);
			uiRef.current.muted = false;
		}
		render();
	}

	function handleMute() {
		const next = !muted;
		setMuted(next);
		uiRef.current.muted = next;
		render();
	}

	function handleAudioPower() {
		const next = !audioOn;
		setAudioOn(next);
		uiRef.current.audioOn = next;
		render();
	}

	function handlePlayPause() {
		const video = videoRef.current;
		const next = !playing;
		setPlaying(next);
		uiRef.current.playing = next;
		if (video && tvOn) {
			if (next) void video.play().catch(() => {});
			else video.pause();
		}
		render();
	}

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
					<p className={styles.sl}>Lighting Scenes</p>
					<div className={styles.sbns}>
						{(Object.keys(SCENE_META) as Scene[]).map((s) => (
							<button
								key={s}
								className={`${styles.sbn} ${scene === s ? styles.on : ""}`}
								style={
									{
										"--ac": SCENE_META[s].color,
										"--ac-bg": SCENE_META[s].bg,
									} as React.CSSProperties
								}
								disabled={transitioning}
								aria-busy={transitioning}
								onClick={() => handleScene(s)}
							>
								<span
									className={styles.dot}
									style={{ background: SCENE_META[s].dot }}
								/>
								{SCENE_META[s].label}
							</button>
						))}
					</div>
				</div>
				<div
					style={{ display: "flex", justifyContent: "space-between", gap: 10 }}
				>
					<div className={styles.sec}>
						<p className={styles.sl}>
							<i className="ti ti-device-tv" aria-hidden="true" /> Television
						</p>
						<div className={styles.trow}>
							<span className={styles.tl}>Power</span>
							<label className={styles.tgl} aria-label="TV power">
								<input
									type="checkbox"
									checked={tvOn}
									onChange={(e) => handleTv(e.target.checked)}
								/>
								<span className={styles.tt} />
								<span className={styles.tth} />
							</label>
						</div>
					</div>

					<div className={styles.sec}>
						<p className={styles.sl}>
							<i className="ti ti-stack-2" aria-hidden="true" /> Blinds
						</p>
						<div className={styles.trow}>
							<span className={styles.tl}>{closed ? "Closed" : "Open"}</span>
							<label className={styles.tgl} aria-label="Blinds toggle">
								<input
									type="checkbox"
									checked={closed}
									onChange={(e) => handleBlinds(e.target.checked)}
								/>
								<span className={styles.tt} />
								<span className={styles.tth} />
							</label>
						</div>
					</div>
				</div>

				<div className={styles.sec}>
					{/* <p className={styles.sl}>
						<i className="ti ti-music" aria-hidden="true" /> Entertainment
					</p> */}
					{/* <div className={styles.entRow}>
						<button
							className={`${styles.entBtn} ${tvOn ? styles.entOn : ""}`}
							onClick={() => handleTv(!tvOn)}
							aria-label="TV power"
							title="TV Power"
						>
							<i className="ti ti-device-tv" aria-hidden="true" />
						</button>
						<button
							className={`${styles.entBtn} ${audioOn ? styles.entOn : ""}`}
							onClick={handleAudioPower}
							aria-label="Audio power"
							title="Audio Power"
						>
							<i className="ti ti-speakerphone" aria-hidden="true" />
						</button>
						<button
							className={`${styles.entBtn} ${playing ? styles.entOn : ""}`}
							onClick={handlePlayPause}
							aria-label="Play or pause"
							title="Play / Pause"
						>
							<i
								className={playing ? "ti ti-player-pause" : "ti ti-player-play"}
								aria-hidden="true"
							/>
						</button>
						<button
							className={`${styles.entBtn} ${muted ? styles.entMuted : ""}`}
							onClick={handleMute}
							aria-label="Mute"
							title="Mute"
						>
							<i
								className={muted ? "ti ti-volume-off" : "ti ti-volume"}
								aria-hidden="true"
							/>
						</button>
					</div> */}

					<div className={styles.volHead}>
						<span className={styles.tl}>Volume</span>
						<span className={styles.volVal}>
							{muted ? "Muted" : `${volume}%`}
						</span>
					</div>
					<input
						className={styles.volSlider}
						type="range"
						min={0}
						max={100}
						step={1}
						value={muted ? 0 : volume}
						onChange={(e) => handleVolume(Number(e.target.value))}
						aria-label="Volume"
						style={
							{ "--fill": `${muted ? 0 : volume}%` } as React.CSSProperties
						}
					/>
				</div>
			</div>
		</div>
	);
}
