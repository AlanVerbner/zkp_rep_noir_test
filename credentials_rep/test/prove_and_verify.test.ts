import { beforeAll, afterAll, expect, test, describe } from "bun:test";
import { ZKP } from "../src/zkp";
import { proveAccountOwnership } from "../src/common";
import { ACCOUNTS, type Account } from "../src/consts";
import { fromHex, keccak256 } from "viem/utils";
import { Registry } from "../src/mock_solidity_registry";

describe("arithmetic", () => {
  let zkp: ZKP;
  let contract: Registry;

  beforeAll(async () => {
    zkp = new ZKP();
    await zkp.initialize();
    contract = new Registry(zkp);
  });

  afterAll(async () => {
    await zkp.destroy();
  });

  test("Register single profile", async () => {
    const root = ACCOUNTS.ROOT;
    const profile = ACCOUNTS.PROFILE;

    const witness = await generateWitness(root, profile);
    const proof = await zkp.generateProof(witness.witness);

    await contract.registerKey(
      await ACCOUNTS.ROOT.account.signMessage({ message: Registry.MSG }),
      witness.profileAddressHash,
      proof
    );

    const profileOwner = contract.getOwner(witness.profileAddressHash);
    expect(profileOwner).toBe(root.account.address);
  });

	test("If it doesn't exist, it should fail", async () => {
    const root = ACCOUNTS.ROOT;
    const profile = ACCOUNTS.PROFILE;

    const witness = await generateWitness(root, profile);
    const proof = await zkp.generateProof(witness.witness);

    const profileOwner = contract.getOwner(witness.profileAddressHash);
    expect(profileOwner).toBeUndefined;
  });

  test("Register the same profile twice fails", async () => {
    const root = ACCOUNTS.ROOT;
    const profile = ACCOUNTS.PROFILE;

    const witness = await generateWitness(root, profile);
    const proof = await zkp.generateProof(witness.witness);

    await contract.registerKey(
      await ACCOUNTS.ROOT.account.signMessage({ message: Registry.MSG }),
      witness.profileAddressHash,
      proof
    );

    expect(
      await contract.registerKey(
        await ACCOUNTS.ROOT.account.signMessage({ message: Registry.MSG }),
        witness.profileAddressHash,
        proof
      )
    ).toThrow("Profile already registered");
  });
});

const generateWitness = async (root: Account, profile: Account) => {
  const profileAddressHash = keccak256(profile.account.address);
  const ownedBinding = await proveAccountOwnership(profile.pk, root.account);
  return {
    profileAddressHash,
    witness: {
      root_address_bytes: fromHex(root.account.address, "bytes"),
      profile_pub_key: fromHex(profile.account.publicKey, "bytes").slice(1, 65),
      profile_address_hash: fromHex(profileAddressHash, "bytes"),
      sig_from_profile: ownedBinding.sig,
    },
  };
};
