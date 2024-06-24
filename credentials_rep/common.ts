import type { PrivateKeyAccount } from "viem";
import { sign } from "viem/accounts";
import { fromHex, keccak256 } from "viem/utils";

export type Hex = `0x{string}`;

export type AccountOwnership = {
  sig: Uint8Array;
  hash: Uint8Array;
};

export async function proveAccountOwnership(
  root: `0x${string}`,
  profile: PrivateKeyAccount
): Promise<AccountOwnership> {
  const hash = keccak256(profile.address);
  const sig = await sign({
    hash,
    privateKey: root,
  });

  const unifiedSig = new Uint8Array([
    ...fromHex(sig.r, "bytes"),
    ...fromHex(sig.s, "bytes"),
  ]);
  return {
    sig: unifiedSig,
    hash: fromHex(hash, "bytes"),
  };
}