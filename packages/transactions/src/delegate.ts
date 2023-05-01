import { PublicKey } from '@near-js/crypto';
import { Assignable } from '@near-js/types';
import BN from 'bn.js';

import { actionCreators } from './action_creators';
import { Action } from './actions';

const {
    addKey,
    createAccount,
    deleteAccount,
    deleteKey,
    deployContract,
    functionCall,
    stake,
    transfer,
} = actionCreators;

export class DelegateAction extends Assignable {
    senderId: string;
    receiverId: string;
    actions: Array<Action>;
    nonce: BN;
    maxBlockHeight: BN;
    publicKey: PublicKey;
}

// TODO deprecate usage of (undocumented?) POJO interface for actions and remove this method
function parseActions(actions: Array<Action> | Array<{ type: string, params: any }>): Array<Action> {
    return actions.map((action) => {
        if (action.params && action.type) {
            const { params } = action;
            switch (action.type) {
                case 'AddKey': {
                    return addKey(params.publicKey, params.accessKey);
                }
                case 'CreateAccount': {
                    return createAccount();
                }
                case 'DeleteAccount': {
                    return deleteAccount(params.deleteAccount);
                }
                case 'DeleteKey': {
                    return deleteKey(params.publicKey);
                }
                case 'DeployContract': {
                    return deployContract(params.code);
                }
                case 'FunctionCall': {
                    return functionCall(params.methodName, params.args, params.gas, params.deposit);
                }
                case 'Stake': {
                    return stake(params.stake, params.publicKey);
                }
                case 'Transfer': {
                    return transfer(params.deposit);
                }
            }
        }

        return action;
    });
}

/**
 * Compose a delegate action for inclusion with a meta transaction signed on the sender's behalf
 * @params.actions The set of actions to be included in the meta transaction
 * @params.maxBlockHeight The maximum block height for which this action can be executed as part of a transaction
 * @params.nonce Current nonce on the access key used to sign the delegate action
 * @params.publicKey Public key for the access key used to sign the delegate action
 * @params.receiverId Account ID for the intended receiver of the meta transaction
 * @params.senderId Account ID for the intended signer of the delegate action
 */
export function buildDelegateAction({
    actions,
    maxBlockHeight,
    nonce,
    publicKey,
    receiverId,
    senderId,
}: DelegateAction): DelegateAction {
    return new DelegateAction({
        senderId,
        receiverId,
        actions: parseActions(actions),
        nonce,
        maxBlockHeight,
        publicKey,
    });
}
