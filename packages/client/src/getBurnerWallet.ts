import { Wallet } from "ethers";

export const getBurnerWallet = () => {
  const privateKey = localStorage.getItem("burnerWallet");
  if (privateKey) return privateKey;

  const burnerWallet = Wallet.createRandom();
  localStorage.setItem("burnerWallet", burnerWallet.privateKey);
  return burnerWallet.privateKey;
};
