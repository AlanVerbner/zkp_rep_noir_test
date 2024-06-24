import { fromHex } from "viem";
import { proveAccountOwnership } from "./common";
import { ACCOUNTS } from "./consts";

const accountPubKeyBytes = fromHex(ACCOUNTS.ROOT.account.publicKey, "bytes");

// https://github.com/colinnielsen/ecrecover-noir?tab=readme-ov-file#from-a-signed-message

const profileRootBinding = await proveAccountOwnership(
  ACCOUNTS.PROFILE.pk,
  ACCOUNTS.ROOT.account
);

const rootProfileBinding = await proveAccountOwnership(
  ACCOUNTS.ROOT.pk,
  ACCOUNTS.PROFILE.account
);

console.log(
  `Prooving ${ACCOUNTS.ROOT.account.address} and ${ACCOUNTS.PROFILE.account.address} have the same owner`
);
console.log(`let hashed_message = ${profileRootBinding.hash};`);
console.log(
  `let profile_pub_key = ${fromHex(ACCOUNTS.PROFILE.account.publicKey, "bytes")}`
);
console.log(
  `let root_pub_key = ${fromHex(ACCOUNTS.ROOT.account.publicKey, "bytes")}`
);
console.log(`let profile_signature = ${profileRootBinding.sig}`);
console.log(`let root_signature = ${rootProfileBinding.sig}`);
console.log(`Root hashed message = ${rootProfileBinding.hash}`);

// Not a real w3c VC
const unsignedCred = {
  repId: "English Skills",
  value: "C1",
};

// const message = JSON.stringify(unsignedCred);
// const attesterAccount = privateKeyToAccount();
// const vc1 = await attesterAccount.signMessage({ message });
// console.log(vc1);

// const validSig = await verifyMessage({
//   address: ACCOUNTS.ROOT.account.address,
//   message: binding.message,
//   signature: binding.sig,
// });
