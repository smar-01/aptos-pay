import { useState } from 'react';
import { useWallet } from '../WalletProvider';
import { Header } from '../Header';
import { WalletSelector } from '../WalletSelector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { isConnected } = useWallet();
  const [isWalletConnectModalOpen, setIsWalletConnectModalOpen] = useState(false);

  const handleConnectWallet = () => {
    setIsWalletConnectModalOpen(true);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">FanFund</h1>
          <p className="text-xl text-gray-600 mb-8">100% of your gift goes to the creator</p>
          <button
            onClick={handleConnectWallet}
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {children}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
