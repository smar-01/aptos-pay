module vault::vault {
    //
    // Minimal pooled-balance vault (APT only, no staking yet)
    //
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::{AptosCoin};

    /// Keeps *all* pooled APT inside the vault account (the module address).
    struct Pool has key {
        coins: coin::Coin<AptosCoin>,
    }

    /// Per-user internal ledger (how much of the pool they own).
    struct Balance has key {
        amount: u64,                    // measured in Octas (1 APT = 1e8)
    }

    ///
    /// Called once by the vault-admin account after publishing.
    public entry fun init(owner: &signer) {
        assert!(signer::address_of(owner) == @vault, 0);
        move_to(owner, Pool { coins: coin::zero<AptosCoin>() });
    }

    ///
    /// 1. Deposit APT ledger increments and coins move into the pool.
    public entry fun deposit(user: &signer, amt: u64) acquires Pool, Balance {
        let pulled = coin::withdraw<AptosCoin>(user, amt);

        // merge coins into the global pool under the module address
        let pool = borrow_global_mut<Pool>(@vault);
        coin::merge(&mut pool.coins, pulled);

        credit(user, amt);
    }

    /// 2. Gift: move ledger balance between two users (coins stay pooled).
    public entry fun gift(sender: &signer, to: address, amt: u64)
        acquires Balance
    {
        debit(sender, amt);
        credit_to_addr(to, amt);
    }

    /// 3. Withdraw: burn ledger balance & pay real APT out from the pool.
    ///    Includes a flat 0.30 % fee that stays in the pool.
    public entry fun withdraw(user: &signer, amt: u64)
        acquires Pool, Balance
    {
        //   fee = amt * 0.30 %
        let fee      = (amt * 30) / 10_000;
        let required = amt + fee;

        debit(user, required);

        // take coins out of the pool
        let pool = borrow_global_mut<Pool>(@vault);
        let coins = coin::extract(&mut pool.coins, amt);

        // send net amount to the creator / user
        coin::deposit<AptosCoin>(signer::address_of(user), coins);
        // fee remains inside pool.coins
    }

    fun credit(user: &signer, amt: u64) acquires Balance {
        credit_to_addr(signer::address_of(user), amt)
    }
fun credit_to_addr(addr: address, amt: u64) acquires Balance {
        if (!exists<Balance>(addr)) {
            move_to(&create_signer(addr), Balance { amount: amt });
        } else {
            let b = borrow_global_mut<Balance>(addr);
            b.amount = b.amount + amt;
        }
    }

    fun debit(user: &signer, amt: u64) acquires Balance {
        let b = borrow_global_mut<Balance>(signer::address_of(user));
        assert!(b.amount >= amt, 1);
        b.amount = b.amount - amt;
    }

    /// create_signer is allowed in Devnet/testnet for resource bookkeeping.
    native fun create_signer(addr: address): signer;
}