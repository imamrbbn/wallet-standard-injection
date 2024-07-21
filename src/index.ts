import { initialize } from './initialize.js';
import { UniqueNewYork } from './webview.js';

const uniqueNewYork = new UniqueNewYork('SOLANA_WALLET_ADDRESS');

// Register your wallet using the Wallet Standard, passing the reference.
initialize(uniqueNewYork);

// New wallets no longer need to register wallet globals - and can
// ignore the code below. However if you have legacy apps relying on globals,
// this is the safest way to attach the reference to the window, guarding against errors.
try {
  Object.defineProperty(window, 'uniqueNewYork', { value: uniqueNewYork });
} catch (error) {
  console.error(error);
}
