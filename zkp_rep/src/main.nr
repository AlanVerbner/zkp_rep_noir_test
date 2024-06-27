use dep::std;
use dep::ecrecover;
use dep::std::hash;
use ecrecover::secp256k1::PubKey;

type SignatureBytes = [u8; 64];
type PubKeyArray = [u8; 64];

fn main(
    root_address_bytes: pub [u8; 20],
    profile_address_hash: pub [u8; 32],
    profile_pub_key: PubKeyArray,
    sig_from_profile: SignatureBytes
) {
    let profile_hashed_message: [u8; 32] = std::hash::keccak256(root_address_bytes, 20);
    let profile_pub_key = PubKey::from_unified(profile_pub_key);
    let recovered_profile_address = profile_pub_key.ecrecover(sig_from_profile, profile_hashed_message);
    println(f"Recovered profile address is {recovered_profile_address}");
    let profile_address_bytes: [u8; 20] = recovered_profile_address.to_be_bytes(20).as_array();
    println(f"Recovered profile address: {profile_address_bytes}");
    assert(std::hash::keccak256(profile_address_bytes, 20) == profile_address_hash);
}

#[test]
fn test_main() {
    let root_address_bytes = [132, 52, 228, 162, 131, 205, 220, 150, 37, 184, 231, 8, 8, 86, 54, 85, 60, 140, 228, 129];
    let profile_address_hash = [
        236, 107, 62, 218, 77, 169, 7, 124, 82, 243, 85, 245, 215, 170, 43, 18, 78, 120, 98, 107, 112, 89, 241, 117, 33, 30, 158, 119, 9, 133, 71, 202
    ];
    let profile_pub_key = [
        180, 230, 20, 31, 225, 178, 219, 157, 64, 109, 85, 22, 202, 157, 173, 68, 176, 231, 26, 42, 110, 15, 9, 76, 86, 201, 71, 226, 102, 161, 33, 162, 1, 211, 214, 74, 208, 32, 133, 176, 172, 249, 240, 59, 118, 232, 80, 62, 52, 225, 176, 88, 105, 137, 1, 242, 173, 166, 195, 86, 84, 241, 251, 147
    ];
    let profile_signature = [
        108, 220, 41, 182, 246, 228, 35, 240, 189, 194, 208, 43, 38, 76, 26, 198, 19, 139, 61, 107, 169, 63, 57, 54, 114, 114, 213, 66, 143, 195, 178, 10, 61, 184, 151, 91, 219, 191, 105, 174, 195, 60, 86, 240, 80, 158, 28, 68, 35, 237, 104, 28, 140, 190, 81, 78, 177, 16, 249, 173, 17, 158, 36, 62
    ];
    main(
        root_address_bytes,
        profile_address_hash,
        profile_pub_key,
        profile_signature
    );
}
