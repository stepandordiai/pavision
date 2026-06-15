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
		wT: "#efe4d4",
		wB: "#e4d3bd",
		fT: "#c9a96b",
		fB: "#a8884e",
		cT: "#f8e6c0",
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
		wT: "#f0f4fa",
		wB: "#e2e9f2",
		fT: "#b8a888",
		fB: "#9c8c6c",
		cT: "#fbfcff",
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

function drawRoom(
	cx: CanvasRenderingContext2D,
	s: DrawState,
	tvOn: boolean,
	video: HTMLVideoElement | null,
) {
	const fY = H * 0.66;
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

	const cg = cx.createLinearGradient(0, 0, 0, fY * 0.5);
	cg.addColorStop(0, s.cT);
	cg.addColorStop(1, s.wT);
	cx.fillStyle = cg;
	cx.fillRect(-M, -M, W + 2 * M, fY * 0.4 + M);
	const wg = cx.createLinearGradient(0, fY * 0.3, 0, fY);
	wg.addColorStop(0, s.wT);
	wg.addColorStop(1, s.wB);
	cx.fillStyle = wg;
	cx.fillRect(-M, fY * 0.3, W + 2 * M, fY - fY * 0.3);
	cx.fillStyle = "rgba(0,0,0,0.025)";
	cx.fillRect(-M, fY * 0.4, W + 2 * M, 2);

	const fg = cx.createLinearGradient(0, fY, 0, H);
	fg.addColorStop(0, s.fT);
	fg.addColorStop(1, s.fB);
	cx.fillStyle = fg;
	cx.fillRect(-M, fY, W + 2 * M, H - fY + M);

	const vanX = W * 0.62;
	for (let i = 0; i < 10; i++) {
		cx.strokeStyle = `rgba(0,0,0,${0.05 - i * 0.003})`;
		cx.lineWidth = 0.5;
		cx.beginPath();
		cx.moveTo(vanX, fY);
		cx.lineTo(ln(-M, W + M, i / 9), H);
		cx.stroke();
	}
	for (let i = 1; i < 5; i++) {
		cx.strokeStyle = `rgba(0,0,0,0.04)`;
		cx.lineWidth = 0.5;
		const y = fY + (H - fY) * Math.pow(i / 5, 1.6);
		cx.beginPath();
		cx.moveTo(-M, y);
		cx.lineTo(W + M, y);
		cx.stroke();
	}
	cx.strokeStyle = "rgba(0,0,0,0.12)";
	cx.lineWidth = 1;
	cx.beginPath();
	cx.moveTo(-M, fY);
	cx.lineTo(W + M, fY);
	cx.stroke();

	const wX = 34,
		wY = 34,
		wW = 120,
		wH = 158;
	cx.fillStyle = "rgba(60,45,28,0.5)";
	rr(wX - 12, wY - 10, wW + 24, wH + 18, 4);
	cx.fill();
	cx.fillStyle = "#5a4528";
	rr(wX - 8, wY - 6, wW + 16, wH + 12, 3);
	cx.fill();

	const skg = cx.createLinearGradient(wX, wY, wX, wY + wH);
	skg.addColorStop(0, s.skyT);
	skg.addColorStop(1, s.skyB);
	cx.fillStyle = skg;
	cx.fillRect(wX, wY, wW, wH);

	if (s.sun > 0.01) {
		cx.fillStyle = `rgba(255,238,150,${0.9 * s.sun})`;
		cx.beginPath();
		cx.arc(wX + wW * 0.68, wY + wH * 0.32, 15, 0, Math.PI * 2);
		cx.fill();
		cx.fillStyle = `rgba(255,238,150,${0.2 * s.sun})`;
		cx.beginPath();
		cx.arc(wX + wW * 0.68, wY + wH * 0.32, 26, 0, Math.PI * 2);
		cx.fill();
	}
	cx.fillStyle = "rgba(120,160,90,0.4)";
	cx.fillRect(wX, wY + wH * 0.8, wW, wH * 0.2);
	cx.fillStyle = "rgba(90,130,70,0.3)";
	cx.beginPath();
	cx.moveTo(wX, wY + wH * 0.82);
	cx.quadraticCurveTo(
		wX + wW * 0.3,
		wY + wH * 0.72,
		wX + wW * 0.6,
		wY + wH * 0.82,
	);
	cx.quadraticCurveTo(wX + wW * 0.8, wY + wH * 0.88, wX + wW, wY + wH * 0.8);
	cx.lineTo(wX + wW, wY + wH);
	cx.lineTo(wX, wY + wH);
	cx.closePath();
	cx.fill();

	const shPx = Math.round(wH * (s.shade / 100));
	if (shPx > 0) {
		const slatH = 9,
			nSlats = Math.ceil(shPx / slatH);
		for (let i = 0; i < nSlats; i++) {
			const y = wY + i * slatH,
				h = Math.min(slatH, wY + shPx - y);
			if (h <= 0) break;
			const sg2 = cx.createLinearGradient(0, y, 0, y + slatH);
			sg2.addColorStop(0, "#d8c9a8");
			sg2.addColorStop(0.5, "#c4b088");
			sg2.addColorStop(1, "#b09c70");
			cx.fillStyle = sg2;
			cx.fillRect(wX, y, wW, h);
			cx.strokeStyle = "rgba(120,100,60,0.35)";
			cx.lineWidth = 0.5;
			cx.beginPath();
			cx.moveTo(wX, y + h);
			cx.lineTo(wX + wW, y + h);
			cx.stroke();
		}
		cx.fillStyle = "rgba(150,130,85,0.9)";
		cx.fillRect(wX, wY, wW, 5);
	}
	cx.strokeStyle = "rgba(70,55,35,0.55)";
	cx.lineWidth = 2;
	cx.strokeRect(wX, wY, wW, wH);
	cx.strokeStyle = "rgba(70,55,35,0.25)";
	cx.lineWidth = 1;
	cx.beginPath();
	cx.moveTo(wX + wW / 2, wY);
	cx.lineTo(wX + wW / 2, wY + wH);
	cx.stroke();

	const tvX = W - 205,
		tvY = fY - 160,
		tvW = 176,
		tvH = 104;
	cx.fillStyle = "rgba(0,0,0,0.08)";
	rr(tvX - 6, tvY + tvH + 2, tvW + 12, 8, 2);
	cx.fill();
	cx.fillStyle = "#1a1722";
	rr(tvX - 5, tvY - 4, tvW + 10, tvH + 8, 6);
	cx.fill();
	cx.fillStyle = "#0c0a12";
	rr(tvX, tvY, tvW, tvH, 3);
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
	cx.fillStyle = "#15121c";
	cx.fillRect(tvX + tvW / 2 - 3, tvY + tvH + 4, 6, 16);
	cx.fillRect(tvX + tvW / 2 - 26, tvY + tvH + 20, 52, 5);

	const cabX = tvX - 10,
		cabY = fY - 12,
		cabW = tvW + 30,
		cabH = 14;
	cx.fillStyle = "rgba(0,0,0,0.1)";
	cx.fillRect(cabX + 4, cabY + 5, cabW, cabH);
	cx.fillStyle = "#3a2c1d";
	rr(cabX, cabY, cabW, cabH, 2);
	cx.fill();
	cx.fillStyle = "rgba(255,255,255,0.04)";
	cx.fillRect(cabX, cabY, cabW, 2);

	if (s.led > 0.01) {
		cx.fillStyle = `rgba(60,120,255,${0.85 * s.led})`;
		cx.fillRect(cabX + 3, cabY + cabH, cabW - 6, 2.5);
		const ledGlow = cx.createLinearGradient(
			0,
			cabY + cabH,
			0,
			cabY + cabH + 40,
		);
		ledGlow.addColorStop(0, `rgba(60,120,255,${0.35 * s.led})`);
		ledGlow.addColorStop(1, "rgba(60,120,255,0)");
		cx.fillStyle = ledGlow;
		cx.fillRect(cabX, cabY + cabH, cabW, 40);
		const wallGlow = cx.createRadialGradient(
			cabX + cabW / 2,
			cabY,
			5,
			cabX + cabW / 2,
			cabY,
			cabW * 0.7,
		);
		wallGlow.addColorStop(0, `rgba(50,110,255,${0.12 * s.led})`);
		wallGlow.addColorStop(1, "rgba(50,110,255,0)");
		cx.fillStyle = wallGlow;
		cx.fillRect(cabX - 40, fY - 120, cabW + 80, 120);
	}

	const soX = 92,
		soY = fY - 78,
		soW = 200,
		soH = 80;
	cx.fillStyle = "rgba(0,0,0,0.12)";
	cx.beginPath();
	cx.ellipse(soX + soW / 2, fY + 6, soW * 0.55, 12, 0, 0, Math.PI * 2);
	cx.fill();
	cx.fillStyle = "#7d5e38";
	rr(soX + 12, soY + soH - 6, 16, 16, 3);
	cx.fill();
	rr(soX + soW - 28, soY + soH - 6, 16, 16, 3);
	cx.fill();
	cx.fillStyle = "#9c7548";
	rr(soX - 22, soY + 24, 24, soH - 18, {
		upperLeft: 6,
		lowerLeft: 6,
		upperRight: 2,
		lowerRight: 2,
	});
	cx.fill();
	rr(soX + soW - 2, soY + 24, 24, soH - 18, {
		upperLeft: 2,
		lowerLeft: 2,
		upperRight: 6,
		lowerRight: 6,
	});
	cx.fill();
	const backG = cx.createLinearGradient(soX, soY, soX, soY + soH * 0.5);
	backG.addColorStop(0, "#b88a52");
	backG.addColorStop(1, "#a87c46");
	cx.fillStyle = backG;
	rr(soX, soY, soW, soH * 0.5, {
		upperLeft: 8,
		upperRight: 8,
		lowerLeft: 0,
		lowerRight: 0,
	});
	cx.fill();
	const seatG = cx.createLinearGradient(soX, soY + soH * 0.42, soX, soY + soH);
	seatG.addColorStop(0, "#a87c46");
	seatG.addColorStop(1, "#8f6838");
	cx.fillStyle = seatG;
	rr(soX, soY + soH * 0.42, soW, soH * 0.58, {
		lowerLeft: 6,
		lowerRight: 6,
		upperLeft: 0,
		upperRight: 0,
	});
	cx.fill();
	const cushW = (soW - 16) / 3;
	for (let i = 0; i < 3; i++) {
		const cxx = soX + 8 + i * cushW;
		const cg2 = cx.createLinearGradient(
			cxx,
			soY + 6,
			cxx,
			soY + 6 + soH * 0.42,
		);
		cg2.addColorStop(0, "#c89858");
		cg2.addColorStop(1, "#b3853f");
		cx.fillStyle = cg2;
		rr(cxx + 3, soY + 6, cushW - 6, soH * 0.42, 7);
		cx.fill();
		cx.strokeStyle = "rgba(120,85,40,0.4)";
		cx.lineWidth = 0.5;
		rr(cxx + 3, soY + 6, cushW - 6, soH * 0.42, 7);
		cx.stroke();
	}
	cx.fillStyle = "#9a3b52";
	rr(soX + 18, soY + soH * 0.4, 30, 30, 5);
	cx.fill();
	cx.fillStyle = "#356b80";
	rr(soX + soW - 50, soY + soH * 0.4, 30, 30, 5);
	cx.fill();

	const ctX = soX + soW / 2 - 38,
		ctY = fY - 16,
		ctW = 76,
		ctH = 11;
	cx.fillStyle = "rgba(0,0,0,0.1)";
	cx.beginPath();
	cx.ellipse(ctX + ctW / 2, ctY + ctH + 12, ctW * 0.55, 7, 0, 0, Math.PI * 2);
	cx.fill();
	cx.fillStyle = "#5a4228";
	rr(ctX, ctY, ctW, ctH, 3);
	cx.fill();
	cx.fillStyle = "#4a3620";
	cx.fillRect(ctX + 10, ctY + ctH, 4, 13);
	cx.fillRect(ctX + ctW - 14, ctY + ctH, 4, 13);
	cx.fillStyle = "#7c4a55";
	rr(ctX + ctW / 2 - 12, ctY - 5, 24, 5, 2);
	cx.fill();

	const rugX = soX - 30,
		rugY = fY + 8,
		rugW = soW + 70,
		rugH = 46;
	cx.fillStyle = "rgba(150,90,45,0.16)";
	cx.beginPath();
	cx.ellipse(
		rugX + rugW / 2,
		rugY + rugH / 2,
		rugW / 2,
		rugH / 2,
		0,
		0,
		Math.PI * 2,
	);
	cx.fill();
	cx.strokeStyle = "rgba(130,75,35,0.22)";
	cx.lineWidth = 1;
	cx.beginPath();
	cx.ellipse(
		rugX + rugW / 2,
		rugY + rugH / 2,
		rugW / 2 - 8,
		rugH / 2 - 6,
		0,
		0,
		Math.PI * 2,
	);
	cx.stroke();

	const plX = wX + wW + 30,
		plY = fY;
	cx.fillStyle = "rgba(0,0,0,0.1)";
	cx.beginPath();
	cx.ellipse(plX, plY + 3, 18, 5, 0, 0, Math.PI * 2);
	cx.fill();
	const potG = cx.createLinearGradient(plX - 14, plY - 20, plX + 14, plY);
	potG.addColorStop(0, "#c97f4a");
	potG.addColorStop(1, "#a8632f");
	cx.fillStyle = potG;
	cx.beginPath();
	cx.moveTo(plX - 14, plY - 22);
	cx.lineTo(plX + 14, plY - 22);
	cx.lineTo(plX + 10, plY);
	cx.lineTo(plX - 10, plY);
	cx.closePath();
	cx.fill();
	cx.fillStyle = "#b87038";
	rr(plX - 15, plY - 26, 30, 6, 2);
	cx.fill();
	const fronds = [
		{ x: plX, y: plY - 30, w: 48, h: 64, rot: 0 },
		{ x: plX - 4, y: plY - 28, w: 54, h: 52, rot: -0.5 },
		{ x: plX + 4, y: plY - 28, w: 54, h: 52, rot: 0.5 },
		{ x: plX - 2, y: plY - 26, w: 44, h: 40, rot: -0.9 },
		{ x: plX + 2, y: plY - 26, w: 44, h: 40, rot: 0.9 },
	];
	fronds.forEach(({ x, y, w, h, rot }) => {
		cx.save();
		cx.translate(x, y);
		cx.rotate(rot);
		const lg = cx.createLinearGradient(0, 0, 0, -h);
		lg.addColorStop(0, "#2d6e22");
		lg.addColorStop(1, "#48a832");
		cx.fillStyle = lg;
		cx.beginPath();
		cx.moveTo(0, 0);
		cx.quadraticCurveTo(-w / 2, -h * 0.6, -w * 0.15, -h);
		cx.quadraticCurveTo(0, -h * 0.85, w * 0.15, -h);
		cx.quadraticCurveTo(w / 2, -h * 0.6, 0, 0);
		cx.closePath();
		cx.fill();
		cx.strokeStyle = "rgba(20,70,15,0.4)";
		cx.lineWidth = 0.5;
		cx.beginPath();
		cx.moveTo(0, 0);
		cx.lineTo(0, -h * 0.92);
		cx.stroke();
		cx.restore();
	});

	const lampPositions = [W * 0.3, W * 0.5, W * 0.7];
	const lampTop = 14;
	lampPositions.forEach((lx) => {
		cx.strokeStyle = "rgba(80,65,42,0.5)";
		cx.lineWidth = 1;
		cx.beginPath();
		cx.moveTo(lx, lampTop);
		cx.lineTo(lx, lampTop + 16);
		cx.stroke();
		cx.fillStyle =
			s.br > 0.2 ? "rgba(250,235,200,0.95)" : "rgba(50,45,60,0.85)";
		cx.beginPath();
		cx.moveTo(lx - 13, lampTop + 16);
		cx.lineTo(lx + 13, lampTop + 16);
		cx.lineTo(lx + 9, lampTop + 34);
		cx.lineTo(lx - 9, lampTop + 34);
		cx.closePath();
		cx.fill();
		cx.strokeStyle = "rgba(0,0,0,0.1)";
		cx.lineWidth = 0.5;
		cx.stroke();
		if (s.br > 0.12) {
			const halo = cx.createRadialGradient(
				lx,
				lampTop + 34,
				0,
				lx,
				lampTop + 34,
				90 * s.br,
			);
			halo.addColorStop(0, `rgba(${s.aR},${s.aG},${s.aB},${s.br * 0.22})`);
			halo.addColorStop(1, "rgba(0,0,0,0)");
			cx.fillStyle = halo;
			cx.beginPath();
			cx.moveTo(lx, lampTop + 30);
			cx.lineTo(lx + 70 * s.br, H * 0.55);
			cx.lineTo(lx - 70 * s.br, H * 0.55);
			cx.closePath();
			cx.fill();
		}
	});

	if (s.br > 0.1) {
		const amb = cx.createRadialGradient(
			W / 2,
			H * 0.2,
			30,
			W / 2,
			H * 0.35,
			W * 0.7,
		);
		amb.addColorStop(0, `rgba(${s.aR},${s.aG},${s.aB},${s.br * 0.14})`);
		amb.addColorStop(1, "rgba(0,0,0,0)");
		cx.fillStyle = amb;
		cx.fillRect(-M, -M, W + 2 * M, H + 2 * M);
	}
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

	const animRef = useRef<number | null>(null);
	const curS = useRef<DrawState>({ ...SCENES.relax, shade: 0 });
	const tvRef = useRef(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const videoLoopRef = useRef<number | null>(null);

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

		drawRoom(ctx, curS.current, tvRef.current, videoRef.current);
	}

	function videoTick() {
		render();
		videoLoopRef.current = requestAnimationFrame(videoTick);
	}

	function startAnim(newTo: Partial<DrawState>) {
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
		setScene(s);
		startAnim({ ...SCENES[s], shade: curS.current.shade });
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
			render();
		}
	}

	function handleBlinds(checked: boolean) {
		setClosed(checked);
		startAnim({ shade: checked ? 100 : 0 });
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
			</div>
		</div>
	);
}
