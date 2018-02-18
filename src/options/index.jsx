import { h, Component, render } from 'preact';
import '../global.css';
import style from './styles/index.css';

import { FakeRouter as Router } from './components/router.jsx';
import Header from './components/header.jsx';
import Home from './routes/home.jsx';
import Profile from './routes/profile.jsx';

class App extends Component {

    render() {
        return (
            <div class={style.window}>
                <Header />
                <Router firstPage="home" onChange={this.routeChanged} class={style.body}>
                    <Home path="home" />
                    <Profile path="me" user="me" />
                </Router>
            </div>
        );
    }
}



render(<App />, document.body);