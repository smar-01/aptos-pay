'use client'

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useState } from "react";
import { toast } from "react-toastify";

export const WalletConnect = () => {
  const { connect, connected, disconnect, wallets } = useWallet();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async (walletName: string) => {
    setIsConnecting(true);
    try {
      const wallet = wallets.find((w) => w.name === walletName);
      if (wallet) {
        await connect(wallet.name);
        toast.success('Wallet connected successfully!');
      }
    } catch (error) {
      toast.error('Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="space-y-4">
      {wallets.map((wallet) => (
        <button
          key={wallet.name}
          onClick={() => handleConnect(wallet.name)}
          disabled={isConnecting}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isConnecting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              {wallet.icon && (
                <img
                  src={wallet.icon}
                  alt={wallet.name}
                  className="w-6 h-6"
                />
              )}
              <span>Connect {wallet.name}</span>
            </>
          )}
        </button>
      ))}
    </div>
  );
}; 