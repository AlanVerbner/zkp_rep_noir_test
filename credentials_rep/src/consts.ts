import { privateKeyToAccount, type PrivateKeyAccount } from "viem/accounts";
import type { Hex } from "./common";

export type Account = {
  pk: `0x${string}`;
  account: PrivateKeyAccount;
};

export type AccountType = "ROOT" | "PROFILE";

// Attention! The following keys are not supposed to be hardcoded, this is just a simple test
const ATTESTER_PK: Hex =
  "0x150187fcae9832c3fd29fd060768bbd7a35dea8ab05d84cffb11a8f9edc08285" as Hex;
const ROOT_IDENTITY_PK: Hex =
  "0xa936483e564f5c62208a44c31c0e8670a6446d288e2df0b0721ce30b77c0ec6a" as Hex;
const PROFILE_PK: Hex =
  "0x82b55a41d5b2fd495e9ae50c9e15cdca9f3d83e1e86248ac51fd0cd2171cc434" as Hex;

const rootAccount = privateKeyToAccount(ROOT_IDENTITY_PK);
const profileAccount = privateKeyToAccount(PROFILE_PK);

export const ACCOUNTS: Record<AccountType, Account> = {
  ROOT: {
    pk: ROOT_IDENTITY_PK,
    account: rootAccount,
  },
  PROFILE: {
    pk: PROFILE_PK,
    account: profileAccount,
  },
};
