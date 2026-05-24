"use client";

import { useState } from "react";
import "./styles.scss";

const CopyBtn = ({ txt }: { txt: string }) => {
	const [btnValueCopied, setBtnValueCopied] = useState(false);

	// navigator.clipboard.writeText() is async
	const handleCopy = async (value: string) => {
		try {
			await navigator.clipboard.writeText(value);
			setBtnValueCopied(true);
			setTimeout(() => setBtnValueCopied(false), 2000);
		} catch (err) {
			console.error("Copy failed:", err);
		}
	};

	return (
		<>
			<div
				className={`copy-btn-modal ${btnValueCopied ? "copy-btn-modal--visible" : ""}`}
			>
				Copied!
			</div>
			<button
				type="button"
				onClick={() => handleCopy(txt)}
				title="Click to copy"
				className="link"
				disabled={btnValueCopied}
			>
				{txt}
			</button>
		</>
	);
};

export default CopyBtn;
