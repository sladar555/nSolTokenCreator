import { PublicKey } from "@solana/web3.js";

export function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(" ");
}

export const isLocalhost = (url: string) => {
  return url.includes("localhost") || url.includes("127.0.0.1");
};

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}

export function getShortHash(text: string) {
  if (text.length > 10)
    return text.slice(0,10) + '...' + text.slice(text.length - 10, text.length);
  else 
    return text;
}

export function getShortLink(text: string) {
  if (text.length > 10)
    return text.slice(0,25) + '...' + text.slice(text.length - 20, text.length);
  else 
    return text;
}

export function getAccountLink(account: string) {
  return `https://explorer.solana.com/address/${account}`;
}