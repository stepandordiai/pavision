import { NavLink } from "react-router-dom";
import "./styles.scss";

const Sidebar = () => {
	return (
		<aside className="sidebar">
			<NavLink style={{ fontSize: "1.5rem" }} to="/">
				P&A Vision
			</NavLink>
			<nav className="sidebar-nav">
				<NavLink
					className={({ isActive }) =>
						`sidebar-nav__link ${isActive ? "sidebar-nav__link--active" : ""}`
					}
					to={"/"}
				>
					Home
				</NavLink>
				<NavLink
					className={({ isActive }) =>
						`sidebar-nav__link ${isActive ? "sidebar-nav__link--active" : ""}`
					}
					to={"/products"}
				>
					Products
				</NavLink>
				<NavLink
					className={({ isActive }) =>
						`sidebar-nav__link ${isActive ? "sidebar-nav__link--active" : ""}`
					}
					to={"/clients"}
				>
					Clients
				</NavLink>
			</nav>
		</aside>
	);
};

export default Sidebar;
