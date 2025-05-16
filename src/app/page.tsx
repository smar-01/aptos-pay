"use client";

import { useState } from 'react';
import { AccountInfo } from "@/components/AccountInfo";
import { Header } from "@/components/Header";
import { MessageBoard } from "@/components/MessageBoard";
import { NetworkInfo } from "@/components/NetworkInfo";
import { TransferAPT } from "@/components/TransferAPT";
import { WalletDetails } from "@/components/WalletDetails";
import { FanDashboard } from "@/components/FanDashboard";
import { CreatorDashboard } from "@/components/CreatorDashboard";
import { WalletConnect } from "@/components/WalletConnect";
// Internal Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

function App() {
  const { connected, disconnect } = useWallet();
  const [isCreator, setIsCreator] = useState(false);

  const toggleMode = () => {
    setIsCreator(!isCreator);
  };

  const handleDisconnect = () => {
    disconnect();
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold">AP</span>
            </div>
            <h1 className="text-2xl font-bold">AptoPay</h1>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-gray-400">100% of your gift goes to the creator</p>
            {connected && (
              <>
                <button
                  onClick={toggleMode}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Switch to {isCreator ? 'Fan' : 'Creator'} Mode
                </button>
                <button
                  onClick={handleDisconnect}
                  className="text-sm text-red-400 hover:text-red-300"
                >
                  Disconnect
                </button>
              </>
            )}
          </div>
        </header>

        {/* Main Content */}
        {!connected ? (
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">
              Support Your Favorite Creators
            </h2>
            <p className="text-xl text-gray-400 mb-12">
              Connect your wallet to start supporting creators directly
            </p>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Connect a wallet to get started</CardTitle>
              </CardHeader>
              <CardContent>
                <WalletConnect />
              </CardContent>
            </Card>
          </div>
        ) : isCreator ? (
          <CreatorDashboard />
        ) : (
          <FanDashboard />
        )}

        {/* Footer Stats */}
        {connected && (
          <div className="mt-8 text-center text-sm text-gray-400">
            <p>Pool Size: 1,234 APT</p>
            <p>Current APY: 5.2%</p>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
