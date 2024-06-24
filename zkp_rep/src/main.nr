use dep::std;
use dep::ecrecover;
use dep::std::hash;

fn main(
    root_pub_key: pub [u8; 64],
    profile_pub_key: [u8; 64],
    sig_from_root: pub [u8; 64],
    sig_from_profile: pub [u8; 64]
) {
    let root_pub_key = ecrecover::secp256k1::PubKey::from_unified(root_pub_key);
    let root_address = root_pub_key.to_eth_address();
    println(f"Root address: {root_address}");
    
    let profile_pub_key = ecrecover::secp256k1::PubKey::from_unified(profile_pub_key);

    // Check if root address has been signed by the profile and recover profile address
    let root_address_bytes: [u8; 20] = root_address.to_be_bytes(20).as_array();
    let profile_hashed_message: [u8; 32] = std::hash::keccak256(root_address_bytes, 20);
    println(f"Root address hash: {profile_hashed_message}");
    let recovered_profile_address = profile_pub_key.ecrecover(sig_from_profile, profile_hashed_message);
    // Check if the recovered signer (Profile) has been signed by the root 
    let profile_address_bytes: [u8; 20] = recovered_profile_address.to_be_bytes(20).as_array();
    println(f"Recovered profile address: {profile_address_bytes}");
    let root_hashed_message: [u8; 32] = std::hash::keccak256(profile_address_bytes, 20);
    println(f"Root hashed message {root_hashed_message}");
    let recovered_root_address = root_pub_key.ecrecover(sig_from_root, root_hashed_message);
    // Check if signer is the proper root address
    assert(root_address == recovered_root_address);
}

#[test]
fn test_main() {
    let root_pub_key = [
        153, 146, 91, 18, 65, 96, 6, 138, 8, 136, 69, 98, 26, 102, 212, 1, 130, 38, 86, 0, 98, 71, 31, 189, 5, 240, 165, 77, 42, 109, 177, 64, 212, 97, 239, 46, 123, 113, 62, 170, 85, 39, 7, 46, 42, 196, 203, 89, 75, 2, 93, 71, 98, 143, 172, 64, 76, 60, 209, 197, 254, 211, 173, 219
    ];
    let profile_pub_key = [
        180, 230, 20, 31, 225, 178, 219, 157, 64, 109, 85, 22, 202, 157, 173, 68, 176, 231, 26, 42, 110, 15, 9, 76, 86, 201, 71, 226, 102, 161, 33, 162, 1, 211, 214, 74, 208, 32, 133, 176, 172, 249, 240, 59, 118, 232, 80, 62, 52, 225, 176, 88, 105, 137, 1, 242, 173, 166, 195, 86, 84, 241, 251, 147
    ];
    let profile_signature = [
        108, 220, 41, 182, 246, 228, 35, 240, 189, 194, 208, 43, 38, 76, 26, 198, 19, 139, 61, 107, 169, 63, 57, 54, 114, 114, 213, 66, 143, 195, 178, 10, 61, 184, 151, 91, 219, 191, 105, 174, 195, 60, 86, 240, 80, 158, 28, 68, 35, 237, 104, 28, 140, 190, 81, 78, 177, 16, 249, 173, 17, 158, 36, 62
    ];
    let root_signature = [
        181, 248, 103, 18, 63, 66, 6, 116, 99, 15, 4, 223, 199, 105, 32, 43, 164, 150, 147, 30, 41, 131, 199, 46, 62, 19, 223, 253, 10, 18, 249, 196, 106, 240, 73, 126, 67, 80, 7, 245, 82, 32, 221, 185, 122, 237, 47, 231, 78, 123, 88, 168, 168, 230, 38, 130, 254, 123, 255, 99, 195, 137, 145, 112
    ];
    main(
        root_pub_key,
        profile_pub_key,
        root_signature,
        profile_signature
    );
}
