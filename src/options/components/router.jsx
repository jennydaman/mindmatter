/*
 * A simple link handler that works independent of the
 * address bar.
 * 
 * Based on preact-router (MIT)
 * https://github.com/developit/preact-router
 */
import { h, Component } from 'preact';

var routerInstance;

const Link = (props) => {
    if (props.onClick) {
        let originalFunction = props.onClick;
        props.onClick = (e) => {
            originalFunction(e);
            return handleLinkClick(e);
        }
    }
    else
        props.onClick = handleLinkClick;
    return h('a', props);
};

function handleLinkClick(e) {
    if (e.button == 0) {
        let node = e.currentTarget || e.target || this;
        if (!node || !node.getAttribute) return;
        routerInstance && routerInstance.routeTo(node.getAttribute('href'));
        return prevent(e);
    }
}

function prevent(e) {
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    if (e.stopPropagation) e.stopPropagation();
    e.preventDefault();
    return false;
}

class FakeRouter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: props.firstPage
        }
    }

    componentWillMount() {
        routerInstance = this;
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextState.page !== this.state.page;
    }

    routeTo(page) {
        this.setState({ page });
    }

    getMatchingChild(children, target) {

        for (let child of children) {
            if (child.attributes.path === target)
                return child;
        }
    }

    render({ children, onChange }, {page}) {
        let active = this.getMatchingChild(children, page);
        if (typeof onChange === 'function')
            onChange(page);
        return active;
    }
}

export { FakeRouter, Link };
