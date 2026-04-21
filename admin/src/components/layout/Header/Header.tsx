import type React from "react";
import "./styles.scss";

type HeaderProps = {
	productsLength: number;
	setBannerVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header = ({ productsLength, setBannerVisible }: HeaderProps) => {
	return (
		<header className="header">
			<p>All products: {productsLength}</p>
			<button className="header__btn" onClick={() => setBannerVisible(true)}>
				Add product
			</button>
		</header>
	);
};

export default Header;
