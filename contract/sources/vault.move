address vault {
  module vault {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    #[test_only]
    use aptos_framework::aptos_coin::initialize_for_test;
    #[test_only]
    use aptos_framework::account::create_signer_for_test;
    #[test_only]
    use aptos_framework::account::create_account_for_test;

    //all APT that the user deposits goes into this single on-chain coin bucket.
    struct Pool has key {
      coins: coin::Coin<AptosCoin>,
    }

    //tracks each users share of the pooled coins. (so all coins depositted go into a single coin bucket)
    struct Balance has key {
      amount: u64,
    }

    //
    public entry fun init(admin: &signer) {
      assert!(signer::address_of(admin) == @vault, 0);
      move_to(admin, Pool { coins: coin::zero<AptosCoin>() })
    }

    public entry fun deposit(user: &signer, amt: u64)
      acquires Pool, Balance
    {
      let pulled = coin::withdraw<AptosCoin>(user, amt);
      let pool   = borrow_global_mut<Pool>(@vault);
      coin::merge(&mut pool.coins, pulled);

      let addr = signer::address_of(user);
      if (!exists<Balance>(addr)) {
        move_to(user, Balance { amount: amt });
      } else {
        let b = borrow_global_mut<Balance>(addr);
        b.amount = b.amount + amt;
      }
    }

    public entry fun gift(from: &signer, to: &signer, amt: u64)
      acquires Balance
    {
      let from_addr = signer::address_of(from);
      let to_addr   = signer::address_of(to);

      let b_from = borrow_global_mut<Balance>(from_addr);
      assert!(b_from.amount >= amt, 1);
      b_from.amount = b_from.amount - amt;

      let b_to = borrow_global_mut<Balance>(to_addr);
      b_to.amount = b_to.amount + amt;
    }

    public entry fun withdraw(user: &signer, amt: u64)
      acquires Pool, Balance
    {
      let fee      = (amt * 30) / 10_000;
      let required = amt + fee;

      let user_addr = signer::address_of(user);
      let b = borrow_global_mut<Balance>(user_addr);
      assert!(b.amount >= required, 2);
      b.amount = b.amount - required;

      let pool_ref = borrow_global_mut<Pool>(@vault);
      let coins    = coin::extract(&mut pool_ref.coins, amt);
      coin::deposit<AptosCoin>(user_addr, coins);
    }

    // Test for deposit and gift logic
    #[test]
    public fun test_deposit_and_gift() acquires Pool, Balance {
      let admin = create_signer_for_test(@vault);
      init(&admin);

      let core = create_signer_for_test(@0x1);
      let (burn_cap, mint_cap) = initialize_for_test(&core);
      let coins = coin::mint<AptosCoin>(100, &mint_cap);
      coin::destroy_mint_cap(mint_cap);
      coin::destroy_burn_cap(burn_cap);

      let alice = create_signer_for_test(@0x2);
      create_account_for_test(signer::address_of(&alice));
      coin::register<AptosCoin>(&alice);
      coin::deposit<AptosCoin>(signer::address_of(&alice), coins);

      let bob = create_signer_for_test(@0x3);
      create_account_for_test(signer::address_of(&bob));
      coin::register<AptosCoin>(&bob);
      // Initialize bob's Balance so gift will work
      deposit(&bob, 0);

      deposit(&alice, 100);
      let a1 = borrow_global<Balance>(signer::address_of(&alice));
      assert!(a1.amount == 100, 1);

      gift(&alice, &bob, 30);
      let a2 = borrow_global<Balance>(signer::address_of(&alice));
      let b1 = borrow_global<Balance>(signer::address_of(&bob));
      assert!(a2.amount == 70, 2);
      assert!(b1.amount == 30, 3);

      let pool_ref = borrow_global<Pool>(@vault);
      let total    = coin::value(&pool_ref.coins);
      assert!(total == 100, 4);
    }

    // Test for deposit and withdraw logic
    #[test]
    public fun test_withdraw_and_pool() acquires Pool, Balance {
      let admin = create_signer_for_test(@vault);
      init(&admin);

      let core = create_signer_for_test(@0x1);
      let (burn_cap, mint_cap) = initialize_for_test(&core);
      let coins = coin::mint<AptosCoin>(50, &mint_cap);
      coin::destroy_mint_cap(mint_cap);
      coin::destroy_burn_cap(burn_cap);

      let carol = create_signer_for_test(@0x4);
      create_account_for_test(signer::address_of(&carol));
      coin::register<AptosCoin>(&carol);
      coin::deposit<AptosCoin>(signer::address_of(&carol), coins);

      deposit(&carol, 50);
      withdraw(&carol, 20);

      let c = borrow_global<Balance>(signer::address_of(&carol));
      assert!(c.amount == 30, 5);

      let pool_ref = borrow_global<Pool>(@vault);
      let total    = coin::value(&pool_ref.coins);
      assert!(total == 30, 6);
    }
  }
}
