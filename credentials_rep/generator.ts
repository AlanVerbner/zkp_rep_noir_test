import { fromHex, keccak256, sha256 } from "viem";
import { proveAccountOwnership } from "./common";
import { ACCOUNTS } from "./consts";

const accountPubKeyBytes = fromHex(ACCOUNTS.ROOT.account.publicKey, "bytes");

// https://github.com/colinnielsen/ecrecover-noir?tab=readme-ov-file#from-a-signed-message

const profileRootBinding = await proveAccountOwnership(
  ACCOUNTS.PROFILE.pk,
  ACCOUNTS.ROOT.account
);

console.log(
  `let root_address_bytes = [${fromHex(
    ACCOUNTS.ROOT.account.address,
    "bytes"
  )}];`
);

console.log(
  `let profile_address_hash = [${fromHex(
    keccak256(ACCOUNTS.PROFILE.account.address),
    "bytes"
  )}];`
);

console.log(
  `let profile_pub_key = [${fromHex(
    ACCOUNTS.PROFILE.account.publicKey,
    "bytes"
  )}`
);

console.log(`let profile_signature = [${profileRootBinding.sig}];`);


// Not a real w3c VC
// const unsignedCred = {
//   repId: "English Skills",
//   value: "C1",
// };

// const message = JSON.stringify(unsignedCred);
// const attesterAccount = privateKeyToAccount();
// const vc1 = await attesterAccount.signMessage({ message });
// console.log(vc1);

// const validSig = await verifyMessage({
//   address: ACCOUNTS.ROOT.account.address,
//   message: binding.message,
//   signature: binding.sig,
// });
