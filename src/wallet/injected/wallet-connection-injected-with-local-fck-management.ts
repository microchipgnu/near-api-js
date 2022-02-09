import {
    WalletConnectionWithKeyManagement,
    RequestSignTransactionsOptions,
    SignInOptions,
    ConnectedWalletAccount,
} from "../wallet-connection";

import {
    Near,
} from '../../near';

import {
    Account,
} from '../../account';

export class WalletConnectionInjectedWithLocalFckManagement extends WalletConnectionWithKeyManagement {

    _walletName: string;

    constructor(near: Near, appKeyPrefix: string | null, walletName: string) {
        super(near, appKeyPrefix);
        this._walletName = walletName;
    }

    requestSignTransactions({ transactions, meta, callbackUrl }: RequestSignTransactionsOptions): Promise<void> {
        throw new Error('Method not implemented.');
    }
    requestSignIn({ contractId, methodNames, successUrl, failureUrl }: SignInOptions) {
        throw new Error('Method not implemented.');
    }
    account(): Account {
        if (!this._connectedAccount) {
            this._connectedAccount = new ConnectedWalletAccountInjected(this, this._near.connection, this._authData.accountId);
        }
        return this._connectedAccount;
    }
}

export class ConnectedWalletAccountInjected extends ConnectedWalletAccount { }