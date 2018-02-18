import { h, Component } from 'preact';
import style from './styles/pause.css';
export default class Pause extends Component {

    render() {
        return (
            <div class={style.switch}>
                <input type="checkbox" id="pause-toggle" class={style.checkbox}/>
                <label class={style.switchWidget} for="pause-toggle">
                    <span class={style.inner}></span>
                    <span class={style.switchCircle}></span>
                </label>
            </div>
        );
    }
}
