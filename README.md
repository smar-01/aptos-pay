### README:

### Demo Video

### Screenshots of UI

### Description of how your interaction with the relevant blockchain works
All core flows—**deposit**, **gift**, and **withdraw**—are handled on-chain in our `vault` Move module at address `0x5ecadf08e0341796c5304f686d0272b9e467dbb321d53fc306ebffa7521e55d0`.  
Our React/Next.js front end uses the Aptos TypeScript SDK and Wallet Adapter to:  
1. **Connect a wallet**  
   ```ts
   import { useWallet } from "@aptos-labs/wallet-adapter-react";
   const { account, signAndSubmitTransaction } = useWallet();
   
Build & submit transactions

2. Deposit:
      ```ts
      const payload = {
        type: "entry_function_payload",
        function: `${VAULT_ADDR}::vault::deposit`,
        type_arguments: [],
        arguments: [String(amountOctas)], // e.g. "1000000000" for 10 APT
      };
      const tx = await signAndSubmitTransaction(payload);
      await client.waitForTransaction(tx.hash);
  
  
4. Gift:
    ```ts
    const payload = {
      type: "entry_function_payload",
      function: `${VAULT_ADDR}::vault::gift`,
      type_arguments: [],
      arguments: [
        account.address,
        recipientAddress,
        String(amountOctas), // e.g. "500000000" for 5 APT
      ],
    };
    const tx = await signAndSubmitTransaction(payload);
    await client.waitForTransaction(tx.hash);
  
6. Withdraw:
    ```ts
    const payload = {
      type: "entry_function_payload",
      function: `${VAULT_ADDR}::vault::withdraw`,
      type_arguments: [],
      arguments: [String(amountOctas)],
    };
    const tx = await signAndSubmitTransaction(payload);
    await client.waitForTransaction(tx.hash);
    // 0.3% fee automatically retained on-chain
  
  
8. Fetch on-chain state:
    ```ts
    const userRes = await client.getAccountResource(
      account.address,
      `${VAULT_ADDR}::vault::Balance`
    );
    const poolRes = await client.getAccountResource(
      VAULT_ADDR,
      `${VAULT_ADDR}::vault::Pool`
    );
    // parse userRes.data.amount and poolRes.data.coins.value to update UI
   

Network configuration:
- Default RPC: https://fullnode.devnet.aptoslabs.com
- VAULT_ADDR and keys are stored in .env.local, so you can switch networks without code changes.

### Video (With audio) explaining how demo works
