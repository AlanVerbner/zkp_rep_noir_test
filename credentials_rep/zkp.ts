import {
	BarretenbergBackend,
	type CompiledCircuit,
	type ProofData,
} from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import zkp_rep from "../zkp_rep/target/zkp_rep.json";
import { logger } from "./logger";

const circuit = zkp_rep as CompiledCircuit;

type ProfileBindingWitness = {
  root_address_bytes: Uint8Array;
  profile_pub_key: Uint8Array;
  profile_address_hash: Uint8Array;
  sig_from_profile: Uint8Array;
};

export class ZKP {
  private backend: BarretenbergBackend | undefined;
  private noir: Noir | undefined;

  constructor() {}

  async initialize() {
    this.backend = new BarretenbergBackend(circuit);
    this.noir = new Noir(circuit, this.backend);
  }

  async generateProof(witness: ProfileBindingWitness): Promise<ProofData> {
    if (!this.noir) {
      throw new Error("Noir instance is not initialized");
    }
    const inputMap = {
      root_address_bytes: ZKP.asParam(witness.root_address_bytes),
      profile_pub_key: ZKP.asParam(witness.profile_pub_key),
      profile_address_hash: ZKP.asParam(witness.profile_address_hash),
      sig_from_profile: ZKP.asParam(witness.sig_from_profile),
    };
		logger.debug("Generating proof")
    const proof = await this.noir.generateProof(inputMap);
		logger.debug("Proof generated");
		return proof;
  }

  async verifyProof(proof: ProofData): Promise<boolean> {
    if (!this.noir) {
      throw new Error("Noir instance is not initialized");
    }
    return this.noir.verifyProof(proof);
  }

  // We cannot send Uint8Array as it is, it needs to be an array of strings
  private static asParam(array: Uint8Array): string[] {
    return Array.from(array, (byte) => byte.toString());
  }
}
