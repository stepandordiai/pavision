import { NavLink } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import "./styles.scss";

const Sidebar = () => {
	const handleLogout = async () => {
		await supabase.auth.signOut();
	};

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
				<NavLink
					className={({ isActive }) =>
						`sidebar-nav__link ${isActive ? "sidebar-nav__link--active" : ""}`
					}
					to={"/bookings"}
				>
					Bookings
				</NavLink>
			</nav>
			<button className="logout-btn" onClick={handleLogout}>
				Log out
			</button>
		</aside>
	);
};

export default Sidebar;
