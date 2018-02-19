import { h, Component } from 'preact';
import style from './styles/pause.css';

function determine(items) {
    if (items.cooldown_lock)
        return false;
    return !items.pause;
}

export default class Pause extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cooldown: null,
            checked: false
        };
    }

    componentDidMount() {
        chrome.storage.local.get(['pause', 'cooldown_lock'], items => {
            this.setState({
                cooldown: items.cooldown_lock ? true : false,
                checked: determine(items)
            });
        });
        chrome.storage.onChanged.addListener(this.toggleSynchronizer);
    }

    componentWillUnmount() {
        chrome.storage.onChanged.removeListener(this.toggleSynchronizer);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.cooldown !== nextState.cooldown
            || this.state.checked !== nextState.checked;
    }

    toggle = () => {
        let pause = this.state.checked;
        if (this.state.cooldown) {
            chrome.storage.local.remove('cooldown_lock');
            pause = false;
        }
        chrome.storage.local.set({ pause: pause });
        this.setState({
            checked: !pause,
            cooldown: false
        });
    }

    toggleSynchronizer = (changes, namespace) => {

        if (namespace !== 'local')
            return;

        let nextState = this.state;
        if (changes.pause)
            nextState.checked = !changes.pause.newValue;

        else if (changes.cooldown_lock)
            nextState.cooldown = changes.cooldown_lock.newValue ? true : false
        this.setState(nextState);            
    }

    render() {
        let labelStyle = style.switchWidget;
        if (this.state.cooldown)
            labelStyle += ' ' + style.onCooldown;

        return (
            <div class={style.switch} onClick={this.toggle}>
                <input type="checkbox" id="pause-toggle"
                    class={style.checkbox}
                    checked={this.state.checked} />
                <label class={labelStyle}>
                    <span class={style.inner}></span>
                    <span class={style.switchCircle}></span>
                </label>
            </div>
        );
    }
}
