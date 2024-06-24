import zkp_rep from "../zkp_rep/target/zkp_rep.json";

import {
  BarretenbergBackend,
  type CompiledCircuit,
} from "@noir-lang/backend_barretenberg";
import { Noir } from "@noir-lang/noir_js";
import { fromHex, toHex } from "viem/utils";
import { proveAccountOwnership } from "./common";
import { ACCOUNTS } from "./consts";

const circuit = zkp_rep as CompiledCircuit;

const root = ACCOUNTS.ROOT;
const profile = ACCOUNTS.PROFILE;

const ownerBinding = await proveAccountOwnership(root.pk, profile.account);
const ownedBinding = await proveAccountOwnership(profile.pk, root.account);

const backend = new BarretenbergBackend(circuit);
const noir = new Noir(circuit, backend);

// We cannot send Uint8Array as it is, it needs to be an array of strings 🤷
const asParam = (array: Uint8Array) => [...array].map(v => v.toString());

const witness = {
  root_pub_key: asParam(fromHex(root.account.publicKey, "bytes").slice(1, 65)), 
  profile_pub_key: asParam(fromHex(profile.account.publicKey, "bytes").slice(1, 65)), 
  sig_from_root: asParam(ownerBinding.sig),
  sig_from_profile: asParam(ownedBinding.sig),
};
console.log(
  `Witness to prove ${root.account.address} owns ${profile.account.address}`
);

const proof = await noir.generateProof(witness);
console.log(
  `Proof generated ${toHex(proof.proof)} with public inputs ${
    proof.publicInputs.length
  }`
);

const isValid = await noir.verifyProof(proof);
console.log(`Is proof valid? ${isValid}.`);
