import "./Header.scss";

const Header = () => {
	return (
		<header className="header">
			<a className="header__logo" href="">
				<img src="/logo.svg" width={30} alt="" />
				<span>P&A Vision</span>
			</a>
			<nav className="header-nav">
				<a href="">Home</a>
				<a href="">About us</a>
				<a href="">Services</a>
				<a href="">Contact</a>
			</nav>
			<button className="header__btn">Order now</button>
		</header>
	);
};

export default Header;
