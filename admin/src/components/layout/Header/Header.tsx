import { useState } from "react";
import MenuIcon from "../../icons/MenuIcon";
import { NavLink } from "react-router-dom";
import "./styles.scss";

const Header = () => {
	const [menuVisible, setMenuVisible] = useState(false);

	return (
		<header className="header">
			<div
				style={{
					justifySelf: "flex-end",
					marginBottom: "10px",
				}}
			>
				<button onClick={() => setMenuVisible(true)} className="menu-btn">
					Menu
					<MenuIcon />
				</button>
			</div>
			<div className={`menu ${menuVisible ? "menu--visible" : ""}`}>
				<button
					onClick={() => setMenuVisible(false)}
					className="menu__close-btn"
				>
					Close
				</button>
				<nav className="menu-nav">
					<NavLink
						onClick={() => setMenuVisible(false)}
						className={({ isActive }) =>
							`menu-nav__link ${isActive ? "menu-nav__link--active" : ""}`
						}
						to={"/"}
					>
						Home
					</NavLink>
					<NavLink
						onClick={() => setMenuVisible(false)}
						className={({ isActive }) =>
							`menu-nav__link ${isActive ? "menu-nav__link--active" : ""}`
						}
						to={"/products"}
					>
						Products
					</NavLink>
					<NavLink
						onClick={() => setMenuVisible(false)}
						className={({ isActive }) =>
							`menu-nav__link ${isActive ? "menu-nav__link--active" : ""}`
						}
						to={"/clients"}
					>
						Clients
					</NavLink>
				</nav>
			</div>
		</header>
	);
};

export default Header;
