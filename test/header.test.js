import { h, render } from 'preact';
import * as renderSpy from 'preact-render-spy';

import { Link, FakeRouter as Router } from '../src/options/components/router.jsx';
import Header from '../src/options/components/header.jsx';

//import sinon from 'sinon';
//import ''

describe('Header', () => {

    var e;

    beforeAll(() => {
        e = {
            href: 'page',
            button: 0,
            currentTarget: {
                getAttribute: attr => attr === 'href' ? e.href : undefined
            },
            preventDefault: jest.fn()
        };
    });

    beforeEach(() => {
        e.preventDefault.mockReset();
    })

    it('Link should call its onClick function', () => {
        let mock = jest.fn();
        let link = renderSpy.shallow(<Link onClick={mock} href='page'>Sample Text</Link>);
        link.find('[onClick]').simulate('click', e);
        expect(mock).toHaveBeenCalled();
        expect(e.preventDefault).toHaveBeenCalled();
    });

    it('clicking on a tab should change Header h1 title', () => {

        let header = renderSpy.deep(<Header />);
        let target = header.find(<Link id='options-tab1'></Link>);

        e.href = target.attr('href');
        e.currentTarget.innerText = target.text();

        target.simulate('click', e);
        // avoid stale result
        let targetTitle = header.find(<Link id='options-tab1'></Link>).text();

        expect(header.state('pageTitle')).toBe(targetTitle);
        expect(header.find('h1').text()).toBe(targetTitle);
    });

    it('Router should render the correct component', () => {

        let FriendComponent = () => (<b>WHO DID THIS</b>);
        let NiceComponent = () => (<i>IM DED</i>);
        let app = renderSpy.deep(
            <div>
                <Link href='friend'>Hello friend</Link>
                <Link href='nice'>That is nice</Link>
                <Router firstPage="friend">
                    <FriendComponent path="friend" />
                    <NiceComponent path="nice" />
                </Router>
            </div>
        );

        expect(app.find('b').exists()).toBe(true);
        expect(app.find('i').exists()).toBe(false);

        let target = app.find(<a href="nice"></a>);
        e.href = target.attr('href');
        e.currentTarget.innerText = target.text();
        target.simulate('click', e);

        expect(app.find('b').exists()).toBe(false);
        expect(app.find('i').exists()).toBe(true);
    });
});