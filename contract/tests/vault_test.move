#[test_only]
module vault::vault_test {
    use std::signer;
    use aptos_framework::aptos_coin;
    use vault::vault;

    native fun create_signer(addr: address): signer;

    #[test]
    fun deposit_and_gift() {
        // fake users
        let alice = create_signer(@0x1);
        let bob   = create_signer(@0x2);

        // initialise global pool under the modules address
        vault::init(&create_signer(@vault));

        // give Alice 5 APT so she can deposit
        let root = create_signer(@0x1);                       // has MintCap
        aptos_coin::mint(&root, signer::address_of(&alice), 500_000_000);

        // Alice deposits 3 APT
        vault::deposit(&alice, 300_000_000);

        // Alice gifts 1 APT to Bob (ledger-only)
        vault::gift(&alice, signer::address_of(&bob), 100_000_000);

        // Check internal balances
        assert!(vault::balance_of(@0x1) == 200_000_000, 101);
        assert!(vault::balance_of(@0x2) == 100_000_000, 102);
    }
}
