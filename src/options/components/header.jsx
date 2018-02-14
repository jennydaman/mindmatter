import { h, Component } from 'preact';
import { Link } from './router.jsx';
import style from '../styles/header.css';
// TODO activeClass doesn't work with my stupid router
export default class Header extends Component {
	render() {
		return (
			<header class={style.header}>
				<h1>Preact App</h1>
				<nav>
					<Link activeClassName={style.active} href="home">Home</Link>
					<Link activeClassName={style.active} href="me">Me</Link>
				</nav>
			</header>
		);
	}
}
