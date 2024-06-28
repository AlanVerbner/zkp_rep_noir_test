import { fromHex, keccak256, sha256, toHex } from "viem/utils";
import { proveAccountOwnership } from "./common";
import { ACCOUNTS } from "./consts";
import { ZKP } from "./zkp";
import { Registry } from "./mock_solidity_registry";
import { logger } from "./logger";

const zkp = new ZKP();
await zkp.initialize();

const root = ACCOUNTS.ROOT;
const profile = ACCOUNTS.PROFILE;

const ownedBinding = await proveAccountOwnership(profile.pk, root.account);
const profileAddressHash = keccak256(profile.account.address);

logger.info(
  `Witness to prove ${root.account.address} owns ${profile.account.address}`
);

const proof = await zkp.generateProof({
  root_address_bytes: fromHex(root.account.address, "bytes"),
  profile_pub_key: fromHex(profile.account.publicKey, "bytes").slice(1, 65),
  profile_address_hash: fromHex(profileAddressHash, "bytes"),
  sig_from_profile: ownedBinding.sig,
});

logger.trace(
  `Proof generated ${toHex(proof.proof)} with public inputs ${
    proof.publicInputs
  }`
);

const contract = new Registry(zkp);
await contract.registerKey(
  await ACCOUNTS.ROOT.account.signMessage({ message: Registry.MSG }),
  profileAddressHash,
  proof
);

const profileOwner = contract.getOwner(profileAddressHash);
console.log(`Profile owner is: ${profileOwner}`)

// const isValid = await noir.verifyProof(proof);
// console.log(`Is proof valid? ${isValid}.`);
