import { h, Component } from 'preact';
import { Link } from './router.jsx';
import Pause from '../../components/pause.jsx'
import style from '../styles/header.css';
export default class Header extends Component {

	constructor(props) {
		super(props);
		this.state = {
			pageTitle: 'Settings'
		}
		this.tabs = [
			{ href: 'settings', pageTitle: 'Settings' },
			{ href: 'me', pageTitle: 'Me' }
		]
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState.pageTitle && nextState.pageTitle !== this.state.pageTitle;
	}

	changeHeader = (e) => {
		let node = e.currentTarget || e.target || this;
		this.setState({ pageTitle: node.innerText });
	}

	render() {
		let links = this.tabs.map((tab, index) => {
			return (<Link onClick={this.changeHeader}
				id={'options-tab' + index}
				href={tab.href}
				class={tab.pageTitle === this.state.pageTitle ? style.active : ''}>
				{tab.pageTitle}</Link>);
		});
		
		return (
			<header class={style.header}>
			<div class={style.space}></div>
				<Pause />
				<h1>{this.state.pageTitle}</h1>
				<nav>{links}</nav>
			</header>
		);
	}
}
