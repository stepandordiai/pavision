import "./styles.scss";

type HeaderProps = {
	productsLength: number;
};

const Header = ({ productsLength }: HeaderProps) => {
	return (
		<header className="header">
			<p>All products: {productsLength ? productsLength : "Loading..."}</p>
		</header>
	);
};

export default Header;
