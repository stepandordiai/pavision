import "./styles.scss";

type FooterProps = {
	visibleLength: number;
	setVisibleLength: React.Dispatch<React.SetStateAction<number>>;
	productsLength: number;
};

const Footer = ({
	visibleLength,
	setVisibleLength,
	productsLength,
}: FooterProps) => {
	return (
		<footer className="footer">
			<p>
				Products per page{" "}
				<select
					className="footer__select"
					onChange={(e) => setVisibleLength(Number(e.target.value))}
					value={visibleLength}
					name=""
					id=""
				>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
				</select>{" "}
				1-
				<span>
					{productsLength
						? productsLength < visibleLength
							? productsLength
							: visibleLength
						: "Loading..."}
				</span>{" "}
				of {productsLength ? productsLength : "Loading..."}
			</p>
			{/* <div>
				<span>1</span> <span>2</span> <span>3</span> <span>...</span>{" "}
				<span>{productsLength < 100 ? visibleLength : 100}</span>
			</div> */}
		</footer>
	);
};

export default Footer;
