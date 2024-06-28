import type { ProofData } from "@noir-lang/noir_js";
import type { ZKP } from "./zkp";
import { recoverMessageAddress } from "viem";
import { logger } from "./logger";

type Proof = {};

export class Registry {
  private registered: Map<string, string> = new Map<string, string>();
  private zkp: ZKP;

  // Fake to simulate transaction signing
  static MSG = "hello world";

  constructor(zkp: ZKP) {
    this.zkp = zkp;
  }

  public async registerKey(
    fakeTxSignature: `0x${string}`,
    profileAddressHash: `0x${string}`,
    proof: ProofData
  ) {
    const msgSender = await recoverMessageAddress({
      message: Registry.MSG,
      signature: fakeTxSignature,
    });
    // 1. Nullifier set verification
    if (this.registered.has(profileAddressHash))
      throw new Error("Profile already registered");
    // 2. Verify the
    logger.debug("Verifying proof");
    if (!(await this.zkp.verifyProof(proof))) {
      throw new Error("Proof not valid, reverting");
    }
    logger.debug("Proof is ok");
    // 3. Add the address to the 'nullifier set' aka registration map
    this.registered.set(profileAddressHash, msgSender);
    logger.debug(`${profileAddressHash} -> ${msgSender}`);
  }

  public getOwner(profileAddressHash: `0x${string}`) {
    return this.registered.get(profileAddressHash);
  }
}
