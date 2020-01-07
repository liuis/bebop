import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import {AbstractConfluxWebModule} from 'conflux-web-core';
import {SignMethod} from 'conflux-web-core-method';
import CfxSignMethod from '../../../src/methods/CfxSignMethod';

// Mocks
jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');
jest.mock('conflux-web-core');

/**
 * CfxSignMethod test
 */
describe('CfxSignMethodTest', () => {
    let method, moduleInstanceMock, accountsMock;

    beforeEach(() => {
        accountsMock = {};
        accountsMock.sign = jest.fn();
        accountsMock.wallet = {'0x0': {privateKey: '0x0', address: '0x0'}};
        accountsMock.accountsIndex = 1;

        new AbstractConfluxWebModule({}, {}, {}, {});
        moduleInstanceMock = AbstractConfluxWebModule.mock.instances[0];
        moduleInstanceMock.accounts = accountsMock;

        formatters.inputAddressFormatter.mockReturnValue('0x0');
        formatters.inputSignFormatter.mockReturnValue('string');

        method = new CfxSignMethod(Utils, formatters, moduleInstanceMock);
        method.callback = jest.fn();
        method.parameters = ['nope', '0x0'];
    });

    it('constructor check', () => {
        expect(method).toBeInstanceOf(SignMethod);
    });

    it('calls execute with wallets defined', async () => {
        accountsMock.sign.mockReturnValueOnce('0x00');

        const response = await method.execute();

        expect(response).toEqual('0x00');

        expect(method.callback).toHaveBeenCalledWith(false, '0x00');

        expect(method.parameters[0]).toEqual('0x0');

        expect(method.parameters[1]).toEqual('string');

        expect(formatters.inputAddressFormatter).toHaveBeenCalledWith('0x0');

        expect(formatters.inputSignFormatter).toHaveBeenCalledWith('nope');

        expect(accountsMock.sign).toHaveBeenCalledWith('string', '0x0');
    });

    it('calls execute with wallets defined but accounts.sign throws an error', async () => {
        const error = new Error('SIGN ERROR');
        accountsMock.sign = jest.fn(() => {
            throw error;
        });

        try {
            await method.execute();
        } catch (error2) {
            expect(error2).toEqual(error);

            expect(method.callback).toHaveBeenCalledWith(error, null);

            expect(accountsMock.sign).toHaveBeenCalledWith('string', '0x0');
        }
    });

    it('calls execute and the account does not exist in the cfx-accounts wallet', async () => {
        accountsMock.wallet = {nope: {privateKey: '0x0'}};

        moduleInstanceMock.currentProvider = {send: jest.fn()};

        method.execute();

        expect(moduleInstanceMock.currentProvider.send).toHaveBeenCalledWith('cfx_sign', method.parameters);
    });
});
