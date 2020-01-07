import * as Utils from 'conflux-web-utils';
import {formatters} from 'conflux-web-core-helpers';
import AbstractGetTransactionFromBlockMethod from '../../../../lib/methods/transaction/AbstractGetTransactionFromBlockMethod';

// Mocks
jest.mock('conflux-web-utils');
jest.mock('conflux-web-core-helpers');

/**
 * AbstractGetTransactionFromBlockMethod test
 */
describe('AbstractGetTransactionFromBlockMethodTest', () => {
    let method;

    beforeEach(() => {
        method = new AbstractGetTransactionFromBlockMethod('rpcMethod', Utils, formatters, {});
        method.parameters = [{}, 1];
    });

    it('constructor check', () => {
        expect(method.rpcMethod).toEqual('rpcMethod');

        expect(method.utils).toEqual(Utils);

        expect(method.formatters).toEqual(formatters);

        expect(method.moduleInstance).toEqual({});
    });

    it('calls beforeExecution and executes the inputBlockAddressFormatter and the numberToHex method', () => {
        Utils.numberToHex.mockReturnValueOnce('0x0');

        formatters.inputBlockAddressFormatter.mockReturnValueOnce('blockNumber');

        method.beforeExecution({});

        expect(method.parameters[0]).toEqual('blockNumber');
        expect(method.parameters[1]).toEqual('0x0');

        expect(formatters.inputBlockAddressFormatter).toHaveBeenCalledWith({});

        expect(Utils.numberToHex).toHaveBeenCalledWith(1);
    });

    it('calls afterExecution and executes the outputTransactionFormatter', () => {
        Utils.numberToHex.mockReturnValueOnce('0x0');

        formatters.outputTransactionFormatter.mockReturnValueOnce(true);

        expect(method.afterExecution({})).toEqual(true);

        expect(formatters.outputTransactionFormatter).toHaveBeenCalledWith({});
    });
});
