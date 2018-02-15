import { h, Component } from 'preact';
import { Link } from './router.jsx';
import style from '../styles/header.css';
// TODO activeClass doesn't work with my stupid router
export default class Header extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'Settings'
		}
		this.tabs = [
			{ href: 'home', pageTitle: 'Home' },
			{ href: 'me', pageTitle: 'Me' }
		]
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.pageTitle !== this.state.pageTitle;
	}

	changeHeader = (e) => {
		let node = e.currentTarget || e.target || this;
		this.setState({ pageTitle: node.innerText });
	}

	render() {

		let links = this.tabs.map(tab => {
			return (<Link onClick={this.changeHeader}
				href={tab.href}
				class={tab.pageTitle === this.state.pageTitle ? style.active : ''}>
				{tab.pageTitle}</Link>);
		});
		
		return (
			<header class={style.header}>
				<h1>{this.state.pageTitle}</h1>
				<nav>{links}</nav>
			</header>
		);
	}
}
