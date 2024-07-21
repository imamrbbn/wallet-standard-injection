import { SolanaSignInInput, SolanaSignInOutput } from '@solana/wallet-standard-features';
import {
  PublicKey,
  SendOptions,
  Transaction,
  TransactionSignature,
  VersionedTransaction,
} from '@solana/web3.js';
import { decode, encode } from 'uint8-to-base64';

import { IUniqueNewYork, UniqueNewYorkEvent } from './window';
import base58 from 'bs58';

export class UniqueNewYork implements IUniqueNewYork {
  publicKey: PublicKey;

  constructor(address: string) {
    this.publicKey = new PublicKey(address);
  }

  private sendRequest(data: string) {
    window.ReactNativeWebView.postMessage(data);
  }

  connect(options?: { onlyIfTrusted?: boolean }): Promise<{ publicKey: PublicKey }> {
    if (!this.publicKey) {
      throw new Error('Method not implemented.');
    }

    this.sendRequest(JSON.stringify({ data: { options }, method: 'connect' }));

    return Promise.resolve({ publicKey: this.publicKey });
  }

  disconnect(): Promise<void> {
    this.sendRequest(JSON.stringify({ method: 'disconnect' }));

    return Promise.resolve();
  }

  signAndSendTransaction<T extends Transaction | VersionedTransaction>(
    transaction: T,
    options?: SendOptions,
  ): Promise<{ signature: TransactionSignature }> {
    this.sendRequest(
      JSON.stringify({ data: { options, transaction }, method: 'signAndSendTransaction' }),
    );

    throw new Error('Method not implemented.');
  }

  signTransaction<T extends Transaction | VersionedTransaction>(transaction: T): Promise<T> {
    const transactionBase64 = encode(transaction.serialize());
    const data = {
      method: 'signTransaction',
      recentBlockhash: transaction.message?.recentBlockhash,
      transactionBase64,
    };
    this.sendRequest(JSON.stringify(data));

    return new Promise<T>((resolve, reject) => {
      window.handleConnectResult = (result: { signatureBase64: string }) => {
        this.sendRequest(JSON.stringify({ result, type: 'log signTransaction' }));
        try {
          if (result.signatureBase64) {
            const pubkey = this.publicKey;
            const signature = decode(result.signatureBase64);
            transaction.addSignature(pubkey, signature);

            return resolve(transaction);
          }

          this.sendRequest(JSON.stringify({ result, type: 'error' }));

          return reject();
        } catch (error) {
          this.sendRequest(JSON.stringify({ error, type: 'error' }));

          return reject();
        }
      };
    });
  }

  signAllTransactions<T extends Transaction | VersionedTransaction>(
    transactions: T[],
  ): Promise<T[]> {
    this.sendRequest(JSON.stringify({ data: { transactions }, method: 'signAllTransactions' }));

    throw new Error('Method not implemented.');
  }

  signMessage(message: Uint8Array): Promise<{ signature: Uint8Array }> {
    const data = { messageBase64: encode(message), method: 'signMessage' };
    this.sendRequest(JSON.stringify(data));

    return new Promise<{ signature: Uint8Array }>((resolve, reject) => {
      window.handleConnectResult = (result: { signature: string }) => {
        this.sendRequest(JSON.stringify({ result, type: 'log signMessage' }));

        try {
          if (result.signature) {
            this.sendRequest(JSON.stringify({ signature: result.signature, type: '1' }));
            const buffer = base58.decode(result.signature);
            this.sendRequest(JSON.stringify({ signature: buffer, type: '2' }));
            return resolve({ signature: base58.decode(result.signature) });
          }

          this.sendRequest(JSON.stringify({ result, type: 'error' }));

          return reject();
        } catch (error) {
          this.sendRequest(JSON.stringify({ error, type: 'error' }));

          reject();
        }
      };
    });
  }

  signIn(input?: SolanaSignInInput): Promise<SolanaSignInOutput> {
    this.sendRequest(JSON.stringify({ data: input, method: 'signIn' }));

    throw new Error('Method not implemented.');
  }

  async on<E extends keyof UniqueNewYorkEvent>(
    event: E,
    listener: UniqueNewYorkEvent[E],
    context?: any,
  ): void {
    this.sendRequest(JSON.stringify({ method: 'on' }));
    throw new Error('Method not implemented.');
  }

  async off<E extends keyof UniqueNewYorkEvent>(
    event: E,
    listener: UniqueNewYorkEvent[E],
    context?: any,
  ): void {
    this.sendRequest(JSON.stringify({ method: 'off' }));
    throw new Error('Method not implemented.');
  }
}
