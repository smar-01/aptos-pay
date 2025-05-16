import { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface CreatorStats {
  totalReceived: number;
  pendingWithdrawals: number;
}

export const CreatorDashboard = () => {
  const { account } = useWallet();
  const { toast } = useToast();
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [stats, setStats] = useState<CreatorStats>({ totalReceived: 0, pendingWithdrawals: 0 });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleWithdraw = async () => {
    if (!withdrawAmount) return;
    setIsProcessing(true);
    try {
      // TODO: Implement withdraw logic
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      const fee = parseFloat(withdrawAmount) * 0.003; // 0.3% fee
      const netAmount = parseFloat(withdrawAmount) - fee;
      toast({
        title: "Withdrawal Successful! 💰",
        description: `${netAmount.toFixed(3)} APT has been withdrawn (${fee.toFixed(3)} APT fee).`,
      });
      setWithdrawAmount('');
    } catch (error) {
      toast({
        title: "Withdrawal Failed",
        description: "There was an error processing your withdrawal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Creator Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="p-6 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold text-blue-400 mb-2">Total Received</h3>
            <p className="text-3xl font-bold text-white">{stats.totalReceived} APT</p>
          </div>
          <div className="p-6 bg-gray-700 rounded-lg">
            <h3 className="text-xl font-semibold text-green-400 mb-2">Available to Withdraw</h3>
            <p className="text-3xl font-bold text-white">{stats.pendingWithdrawals} APT</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-gray-300">Withdraw Amount</label>
          <div className="flex gap-4">
            <input
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              placeholder="Amount in APT"
              className="flex-1 px-4 py-2 rounded-lg bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleWithdraw}
              disabled={isProcessing || !withdrawAmount}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700">
          <h3 className="text-xl font-semibold mb-4 text-white">Pool Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Pool Size</h4>
              <p className="text-2xl font-bold text-white">10,000 APT</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-2">Current APY</h4>
              <p className="text-2xl font-bold text-white">5.2%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
