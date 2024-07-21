import { registerWallet } from './register.js';
import { UniqueNewYorkWallet } from './wallet.js';
import type { IUniqueNewYork } from './window.js';

export function initialize(uniqueNewYork: IUniqueNewYork): void {
  registerWallet(new UniqueNewYorkWallet(uniqueNewYork));
}
