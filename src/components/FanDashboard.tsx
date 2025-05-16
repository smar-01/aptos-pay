import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useToast } from "@/components/ui/use-toast";
import { WalletDetails } from './WalletDetails';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface Creator {
  id: string;
  name: string;
  avatar: string;
}

const creators: Creator[] = [
  { id: '1', name: 'CoolStreamer', avatar: '/avatars/creator1.png' },
  { id: '2', name: 'GamingPro', avatar: '/avatars/creator2.png' },
  { id: '3', name: 'TechGuru', avatar: '/avatars/creator3.png' },
];

export const FanDashboard = () => {
  const { account } = useWallet();
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [giftAmount, setGiftAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDeposit = async () => {
    if (!depositAmount) return;
    setIsProcessing(true);
    try {
      // TODO: Implement deposit logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Deposit Successful! 🎉",
        description: `${depositAmount} APT has been deposited into your account.`,
        variant: "success",
      });
      setDepositAmount('');
    } catch (error) {
      toast({
        title: "Deposit Failed",
        description: "There was an error processing your deposit. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGift = async () => {
    if (!selectedCreator || !giftAmount) return;
    setIsProcessing(true);
    try {
      // TODO: Implement gift logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast({
        title: "Gift Sent! 🎁",
        description: `${giftAmount} APT has been gifted to @${selectedCreator.name}.`,
        variant: "success",
      });
      setGiftAmount('');
      setSelectedCreator(null);
    } catch (error) {
      toast({
        title: "Gift Failed",
        description: "There was an error sending your gift. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Wallet & Deposit Panel */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Your Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <WalletDetails />
          
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Deposit Funds</h3>
            <div className="flex gap-4">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Amount in APT"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleDeposit}
                disabled={isProcessing || !depositAmount}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Deposit'}
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gift Creator Panel */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Gift a Creator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">Select Creator</label>
            <select
              value={selectedCreator?.id || ''}
              onChange={(e) => setSelectedCreator(creators.find(c => c.id === e.target.value) || null)}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a creator...</option>
              {creators.map((creator) => (
                <option key={creator.id} value={creator.id}>
                  {creator.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-gray-300">Amount to Gift</label>
            <input
              type="number"
              value={giftAmount}
              onChange={(e) => setGiftAmount(e.target.value)}
              placeholder="Amount in APT"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleGift}
            disabled={isProcessing || !selectedCreator || !giftAmount}
            className="w-full bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Gift Creator'}
          </button>
        </CardContent>
      </Card>
    </div>
  );
};
