import { h } from 'preact';
import * as renderSpy from 'preact-render-spy';
import chrome from 'sinon-chrome';

import Pause from '../src/components/pause.jsx';

describe('Pause', () => {

    const context = renderSpy.shallow(<header />);

    beforeAll(() => {
        global.chrome = chrome;
        expect.extend({
            toShowCooldown(context) {
                const pass = context.find('label').attr('class').includes('onCooldown');
                const message = `expected label to${pass ? ' not ' : ' '}have the CSS class "onCooldown"`;
                return {
                    message: () => message,
                    pass: pass
                };
            },

            toBeChecked(context) {
                const pass = context.find('input').attr('checked') == true;
                const message = `expected hidden input[type="checkbox"] to${pass ? ' not ' : ' '}to be checked`;
                return {
                    message: () => message,
                    pass: pass
                };
            }
        });
    });

    afterEach(() => {
        context.render(null);
        chrome.storage.local.get.resetBehavior();
        chrome.storage.local.remove.resetHistory();
        chrome.storage.local.set.reset();
    });

    it('should remove chrome.storage.onChanged handlers after being unmounted', () => {
        chrome.storage.onChanged.removeListener.reset();
        chrome.storage.local.get.callsArgWith(1, { pause: false });
        context.render(<Pause />);
        context.rerender();
        context.render(null);
        expect(chrome.storage.onChanged.removeListener.calledOnce).toBe(true);
    });

    it('should be toggled "right" when pause is false and cooldown_lock is unset', () => {
        chrome.storage.local.get.callsArgWith(1, { pause: false });
        context.render(<Pause />);
        context.rerender();
        expect(context).toBeChecked();
    });

    it('should be toggled "left" when pause is true or cooldown_lock is set', () => {
        chrome.storage.local.get.callsArgWith(1, { pause: true });
        context.render(<Pause />);
        context.rerender();
        expect(context).not.toBeChecked();
        context.render(null);

        chrome.storage.local.get.callsArgWith(1, { pause: false, cooldown_lock: 1600000000000 });
        context.render(<Pause />);
        context.rerender();
        expect(context).not.toBeChecked();
        expect(context).toShowCooldown();
    });

    it('should set pause to false when checked', () => {
        chrome.storage.local.get.callsArgWith(1, { pause: true });
        context.render(<Pause />);
        context.rerender();
        expect(context).not.toBeChecked();

        context.find('[onClick]').simulate('click');
        expect(chrome.storage.local.set.calledWith({ pause: false })).toBe(true);
    });

    it('should both unpause and clear cooldown_lock when checked', () => {
        chrome.storage.local.get.callsArgWith(1, { pause: false, cooldown_lock: 1600000000000 });
        context.render(<Pause />);
        context.rerender();

        context.find('[onClick]').simulate('click');
        expect(chrome.storage.local.set.calledWith({ pause: false })).toBe(true);
        expect(chrome.storage.local.remove.calledWith('cooldown_lock')).toBe(true);
    });

    it('should react to changes in storage.local', () => {
        chrome.storage.local.get.callsArgWith(1, {pause: false});
        context.render(<Pause />);
        context.rerender();

        chrome.storage.onChanged.trigger({
            pause: {
                oldValue: false,
                newValue: true
            }
        }, 'local');
        context.rerender();

        expect(context).toBeChecked();
        expect(chrome.storage.local.set.notCalled).toBe(true);
    });
});