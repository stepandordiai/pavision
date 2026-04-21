import "./styles.scss";

type SwitchBtnProps = {
	isActive: boolean | null;
	disabled: boolean;
	toggleIsActive: () => void;
};

const SwitchBtn = ({ isActive, disabled, toggleIsActive }: SwitchBtnProps) => {
	return (
		<button
			onClick={toggleIsActive}
			className={`switch-btn ${isActive ? "switch-btn--active" : ""} ${disabled ? "switch-btn--disabled" : ""}`}
			disabled={disabled}
		></button>
	);
};

export default SwitchBtn;
