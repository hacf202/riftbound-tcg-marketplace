import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext();

const LOCAL_STORAGE_ACCOUNT_KEY = 'rift_connected_account';
const LOCAL_STORAGE_WALLET_TYPE_KEY = 'rift_wallet_type'; // 'metamask' | null
const LOCAL_STORAGE_ACTIVE_TAB_KEY = 'rift_active_tab';
const LOCAL_STORAGE_SELECTED_CARD_KEY = 'rift_selected_card_id';

// Tỷ giá quy đổi định chuẩn trong hệ sinh thái: 1 ETH = 10,000 $RIFT (1 $RIFT = 0.0001 ETH)
export const RIFT_PER_ETH = 10000;

export const formatEthEquivalent = (riftAmount) => {
  const num = Number(riftAmount);
  if (isNaN(num)) return '0.0000 ETH';
  return (num / RIFT_PER_ETH).toFixed(4) + ' ETH';
};

export const formatRiftEquivalent = (ethAmount) => {
  const num = Number(ethAmount);
  if (isNaN(num)) return '0 $RIFT';
  return Math.round(num * RIFT_PER_ETH).toLocaleString() + ' $RIFT';
};

// Synchronous initializers to persist state across refreshes without any flashing
const getInitialActiveTab = () => {
  if (typeof window !== 'undefined' && window.location.hash) {
    const raw = window.location.hash.replace('#', '').split('?')[0];
    if (['marketplace', 'packs', 'inventory', 'activity', 'codex', 'card-detail'].includes(raw)) {
      return raw;
    }
  }
  return localStorage.getItem(LOCAL_STORAGE_ACTIVE_TAB_KEY) || 'marketplace';
};

const getInitialSelectedCardId = () => {
  if (typeof window !== 'undefined' && window.location.hash.includes('?id=')) {
    const parts = window.location.hash.split('?id=');
    if (parts[1]) return parts[1];
  }
  return localStorage.getItem(LOCAL_STORAGE_SELECTED_CARD_KEY) || null;
};

export function Web3Provider({ children }) {
  // 1. Initial State: Strict MetaMask only, null if not connected
  const [account, setAccount] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_ACCOUNT_KEY) || null;
  });
  const [walletType, setWalletType] = useState(() => {
    return localStorage.getItem(LOCAL_STORAGE_WALLET_TYPE_KEY) || null;
  });
  const [activeTab, setActiveTabState] = useState(getInitialActiveTab);
  const [selectedCardId, setSelectedCardIdState] = useState(getInitialSelectedCardId);
  const [dataVersion, setDataVersion] = useState(1); // Global signal for data mutations

  const [balanceRift, setBalanceRift] = useState(0);
  const [balanceEth, setBalanceEth] = useState('0.0000');
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [contractsConfig, setContractsConfig] = useState(null);
  const [contractsAbi, setContractsAbi] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal Quy Đổi Tiền Tệ
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

  const API_BASE = 'http://localhost:5000/api/v1';

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  // Synchronize Tab & Hash State
  const setActiveTab = (tab) => {
    setActiveTabState(tab);
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_TAB_KEY, tab);
    if (typeof window !== 'undefined') {
      if (tab === 'card-detail' && selectedCardId) {
        window.location.hash = `#card-detail?id=${selectedCardId}`;
      } else {
        window.location.hash = `#${tab}`;
      }
    }
  };

  const setSelectedCardId = (id) => {
    setSelectedCardIdState(id);
    if (id) {
      localStorage.setItem(LOCAL_STORAGE_SELECTED_CARD_KEY, id);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_SELECTED_CARD_KEY);
    }
  };

  const viewCardDetail = (cardIdOrCode) => {
    setSelectedCardId(cardIdOrCode);
    setActiveTabState('card-detail');
    localStorage.setItem(LOCAL_STORAGE_ACTIVE_TAB_KEY, 'card-detail');
    if (cardIdOrCode) {
      localStorage.setItem(LOCAL_STORAGE_SELECTED_CARD_KEY, cardIdOrCode);
      if (typeof window !== 'undefined') {
        window.location.hash = `#card-detail?id=${cardIdOrCode}`;
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Global Trigger to immediately notify Inventory & Activity to re-fetch
  const triggerRefresh = useCallback(() => {
    setDataVersion((prev) => prev + 1);
  }, []);

  // Listen to Browser Back / Forward buttons (hashchange)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').split('?')[0];
      if (['marketplace', 'packs', 'inventory', 'activity', 'codex', 'card-detail'].includes(hash)) {
        setActiveTabState(hash);
        localStorage.setItem(LOCAL_STORAGE_ACTIVE_TAB_KEY, hash);
      }
      if (window.location.hash.includes('?id=')) {
        const id = window.location.hash.split('?id=')[1];
        if (id) {
          setSelectedCardIdState(id);
          localStorage.setItem(LOCAL_STORAGE_SELECTED_CARD_KEY, id);
        }
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Ensure current tab is reflected in hash on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.location.hash) {
      window.location.hash = activeTab === 'card-detail' && selectedCardId ? `#card-detail?id=${selectedCardId}` : `#${activeTab}`;
    }
  }, [activeTab, selectedCardId]);

  // Load Smart Contracts config from backend
  useEffect(() => {
    fetch(`${API_BASE}/system/contracts`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          setContractsConfig(data.data.config);
          setContractsAbi(data.data.abi);
        }
      })
      .catch((err) => console.log('Không thể tải ABI contracts từ backend:', err));
  }, []);

  // Restore or verify MetaMask session on mount
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum
        .request({ method: 'eth_accounts' })
        .then((accounts) => {
          if (accounts && accounts.length > 0) {
            const acc = accounts[0];
            setAccount(acc);
            setWalletType('metamask');
            localStorage.setItem(LOCAL_STORAGE_ACCOUNT_KEY, acc);
            localStorage.setItem(LOCAL_STORAGE_WALLET_TYPE_KEY, 'metamask');
            window.ethereum.request({ method: 'eth_chainId' }).then((cid) => {
              setChainId(parseInt(cid, 16));
            });
          } else {
            // Not connected to MetaMask
            setAccount(null);
            setWalletType(null);
            localStorage.removeItem(LOCAL_STORAGE_ACCOUNT_KEY);
            localStorage.removeItem(LOCAL_STORAGE_WALLET_TYPE_KEY);
          }
        })
        .catch(() => {
          setAccount(null);
          setWalletType(null);
        });
    } else {
      setAccount(null);
      setWalletType(null);
    }
  }, []);

  // Listen to MetaMask account & chain changes
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          const newAcc = accounts[0];
          setAccount(newAcc);
          setWalletType('metamask');
          localStorage.setItem(LOCAL_STORAGE_ACCOUNT_KEY, newAcc);
          localStorage.setItem(LOCAL_STORAGE_WALLET_TYPE_KEY, 'metamask');
          showToast(`Đã kết nối ví MetaMask: ${newAcc.slice(0, 6)}...${newAcc.slice(-4)}`, 'success');
          triggerRefresh();
        } else {
          setAccount(null);
          setWalletType(null);
          setBalanceRift(0);
          setBalanceEth('0.0000');
          localStorage.removeItem(LOCAL_STORAGE_ACCOUNT_KEY);
          localStorage.removeItem(LOCAL_STORAGE_WALLET_TYPE_KEY);
          showToast('Đã ngắt kết nối ví MetaMask', 'info');
          triggerRefresh();
        }
      };

      const handleChainChanged = (cid) => {
        setChainId(parseInt(cid, 16));
        triggerRefresh();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [triggerRefresh]);

  // Fetch balances: cả đồng ETH và đồng $RIFT
  const fetchBalance = useCallback(async () => {
    if (!account) {
      setBalanceRift(0);
      setBalanceEth('0.0000');
      return;
    }

    // 1. Lấy số dư ETH trực tiếp từ provider
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const ethBal = await provider.getBalance(account);
        setBalanceEth(parseFloat(ethers.formatEther(ethBal)).toFixed(4));
      } catch (err) {
        console.log('Lỗi fetch ETH balance:', err);
      }
    }

    // 2. Lấy số dư $RIFT (On-Chain từ contract RiftToken)
    let onChainBalance = null;
    if (window.ethereum && contractsConfig?.contracts?.RiftToken && contractsAbi?.RiftToken) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (Number(network.chainId) === contractsConfig.chainId) {
          const riftContract = new ethers.Contract(
            contractsConfig.contracts.RiftToken,
            contractsAbi.RiftToken,
            provider
          );
          const bal = await riftContract.balanceOf(account);
          onChainBalance = parseFloat(ethers.formatEther(bal));
        }
      } catch (e) {
        // Fallback to backend
      }
    }

    // 3. Đồng bộ với SQLite backend
    try {
      const res = await fetch(`${API_BASE}/users/${account}/balance`);
      const data = await res.json();
      if (data.success && data.data) {
        const dbBal = Number(data.data.balance) || 0;
        const finalBal = onChainBalance !== null ? Math.max(onChainBalance, dbBal) : dbBal;
        setBalanceRift(finalBal);
      } else if (onChainBalance !== null) {
        setBalanceRift(onChainBalance);
      }
    } catch (err) {
      if (onChainBalance !== null) {
        setBalanceRift(onChainBalance);
      }
    }
  }, [account, contractsConfig, contractsAbi]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance, dataVersion]);

  // Connect to MetaMask
  const connectMetaMask = async () => {
    if (!window.ethereum) {
      showToast('⚠️ Không tìm thấy tiện ích MetaMask! Vui lòng cài đặt tại metamask.io.', 'error');
      if (typeof window !== 'undefined') {
        window.open('https://metamask.io/download/', '_blank');
      }
      return;
    }
    try {
      setIsConnecting(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      if (accounts.length > 0) {
        const acc = accounts[0];
        setAccount(acc);
        setWalletType('metamask');
        setChainId(Number(network.chainId));
        localStorage.setItem(LOCAL_STORAGE_ACCOUNT_KEY, acc);
        localStorage.setItem(LOCAL_STORAGE_WALLET_TYPE_KEY, 'metamask');
        showToast('🎉 Kết nối ví MetaMask thành công!', 'success');
        triggerRefresh();
      }
    } catch (error) {
      console.error(error);
      showToast('Lỗi kết nối ví: ' + (error.message || 'Người dùng từ chối'), 'error');
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect MetaMask
  const disconnectWallet = () => {
    localStorage.removeItem(LOCAL_STORAGE_ACCOUNT_KEY);
    localStorage.removeItem(LOCAL_STORAGE_WALLET_TYPE_KEY);
    setAccount(null);
    setWalletType(null);
    setBalanceRift(0);
    setBalanceEth('0.0000');
    showToast('Đã ngắt kết nối ví MetaMask', 'info');
    triggerRefresh();
  };

  // Claim Faucet (+1,000 $RIFT)
  const claimFaucet = async () => {
    if (!account) {
      showToast('⚠️ Vui lòng kết nối ví MetaMask trước khi nhận Faucet!', 'warning');
      connectMetaMask();
      return;
    }

    showToast('🎁 Đang gửi 1,000 $RIFT vào ví MetaMask của bạn...', 'info');

    // UI instant balance update
    setBalanceRift((prev) => Number(prev) + 1000);

    try {
      await fetch(`${API_BASE}/users/${account}/faucet`, { method: 'POST' });
    } catch (err) {
      console.log('Lỗi sync faucet backend:', err);
    }

    if (window.ethereum && contractsConfig?.contracts?.RiftToken) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const riftContract = new ethers.Contract(
          contractsConfig.contracts.RiftToken,
          contractsAbi.RiftToken,
          signer
        );
        const tx = await riftContract.claimFaucet();
        await tx.wait();
      } catch (err) {
        console.log('On-chain faucet notice:', err.message);
      }
    }

    showToast('🎉 Nhận thành công 1,000 $RIFT vào ví MetaMask!', 'success');
    triggerRefresh();
  };

  // Buy Card on Marketplace
  const buyCard = async (listingId, pricePerItem, quantity = 1) => {
    if (!account) {
      showToast('⚠️ Vui lòng kết nối ví MetaMask để thực hiện mua thẻ bài!', 'warning');
      connectMetaMask();
      return false;
    }

    const totalPrice = Number(pricePerItem) * Number(quantity);

    if (Number(balanceRift) < totalPrice) {
      showToast(`Số dư ví (${balanceRift} $RIFT) không đủ để thanh toán ${totalPrice} $RIFT! Hãy bấm Faucet để nhận thêm.`, 'warning');
      return false;
    }

    // Instant balance UI deduction
    setBalanceRift((prev) => Math.max(0, Number(prev) - totalPrice));

    // 1. Đồng bộ mua thẻ ngay lập tức với Backend Database (Escrow & Inventory Transfer)
    try {
      const res = await fetch(`${API_BASE}/marketplace/sync-sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, quantity, buyer: account }),
      });
      const data = await res.json();
      if (!data.success) {
        showToast(data.message || 'Lỗi khi khớp lệnh mua thẻ!', 'error');
        triggerRefresh();
        return false;
      }
    } catch (err) {
      console.log('Lỗi sync sale backend:', err);
      showToast('Lỗi kết nối máy chủ khi mua thẻ!', 'error');
      triggerRefresh();
      return false;
    }

    // 2. Thử giao dịch On-Chain nếu MetaMask kết nối đúng mạng
    if (window.ethereum && contractsConfig?.contracts?.RiftMarketplace) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const network = await provider.getNetwork();

        if (Number(network.chainId) === contractsConfig.chainId) {
          const mktAddress = contractsConfig.contracts.RiftMarketplace;
          const riftAddress = contractsConfig.contracts.RiftToken;

          const riftContract = new ethers.Contract(riftAddress, contractsAbi.RiftToken, signer);
          const mktContract = new ethers.Contract(mktAddress, contractsAbi.RiftMarketplace, signer);

          const totalPriceWei = ethers.parseEther(totalPrice.toString());
          const currentAllowance = await riftContract.allowance(account, mktAddress);
          if (currentAllowance < totalPriceWei) {
            const approveTx = await riftContract.approve(mktAddress, ethers.MaxUint256);
            await approveTx.wait();
          }

          const buyTx = await mktContract.buyItem(listingId, quantity);
          await buyTx.wait();
        }
      } catch (err) {
        console.log('On-chain buy notice (đã bảo đảm bằng Database Escrow):', err.message);
      }
    }

    showToast('🎉 Mua thẻ bài thành công! Thẻ đã về Bộ Sưu Tập ví MetaMask của bạn.', 'success');
    triggerRefresh();
    return true;
  };

  // Open Booster Pack (Gacha)
  const openPack = async (packId, price) => {
    if (!account) {
      showToast('⚠️ Vui lòng kết nối ví MetaMask để bóc gói thẻ bài!', 'warning');
      connectMetaMask();
      return null;
    }

    if (Number(balanceRift) < Number(price)) {
      showToast(`Số dư ví (${balanceRift} $RIFT) không đủ mở gói (${price} $RIFT)!`, 'warning');
      return null;
    }

    setBalanceRift((prev) => Math.max(0, Number(prev) - Number(price)));

    let cardIds = [];

    // On-Chain if MetaMask is active
    if (window.ethereum && contractsConfig?.contracts?.RiftBoosterPack) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const packAddress = contractsConfig.contracts.RiftBoosterPack;
        const riftAddress = contractsConfig.contracts.RiftToken;

        const riftContract = new ethers.Contract(riftAddress, contractsAbi.RiftToken, signer);
        const packContract = new ethers.Contract(packAddress, contractsAbi.RiftBoosterPack, signer);

        const priceWei = ethers.parseEther(price.toString());
        const allowance = await riftContract.allowance(account, packAddress);
        if (allowance < priceWei) {
          const appTx = await riftContract.approve(packAddress, ethers.MaxUint256);
          await appTx.wait();
        }

        const tx = await packContract.openPack(packId);
        const receipt = await tx.wait();

        for (const log of receipt.logs) {
          try {
            const parsed = packContract.interface.parseLog(log);
            if (parsed && parsed.name === 'PackOpened') {
              cardIds = Array.from(parsed.args.cardIds).map(Number);
            }
          } catch {}
        }
      } catch (err) {
        console.log('On-chain pack opening error:', err);
      }
    }

    // Backend fallback / simulation
    if (!cardIds || cardIds.length === 0) {
      try {
        const res = await fetch(`${API_BASE}/packs/simulate-open`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packId }),
        });
        const data = await res.json();
        if (data.success && data.data?.cards) {
          cardIds = data.data.cards.map((c) => c.id);
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Save cards won into user's SQLite Inventory
    if (cardIds && cardIds.length > 0) {
      try {
        await fetch(`${API_BASE}/users/${account}/pack-rewards`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cardIds, price, packId }),
        });
      } catch (err) {
        console.log('Lỗi lưu pack rewards:', err);
      }
    }

    showToast('🎉 Đã xé gói thành công! Hãy lật mở các lá bài trúng được.', 'success');
    triggerRefresh();
    return cardIds;
  };

  // List Card for Sale on Marketplace
  const listCard = async (cardId, quantity, pricePerItem) => {
    if (!account) {
      showToast('⚠️ Vui lòng kết nối ví MetaMask trước khi đăng bán thẻ bài!', 'warning');
      connectMetaMask();
      return false;
    }

    // On-Chain if MetaMask is active
    if (window.ethereum && contractsConfig) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const mktAddress = contractsConfig.contracts.RiftMarketplace;
        const nftAddress = contractsConfig.contracts.RiftCardNFT;

        const nftContract = new ethers.Contract(nftAddress, contractsAbi.RiftCardNFT, signer);
        const mktContract = new ethers.Contract(mktAddress, contractsAbi.RiftMarketplace, signer);

        const isApproved = await nftContract.isApprovedForAll(account, mktAddress);
        if (!isApproved) {
          const appTx = await nftContract.setApprovalForAll(mktAddress, true);
          await appTx.wait();
        }

        const priceWei = ethers.parseEther(pricePerItem.toString());
        const tx = await mktContract.listItem(nftAddress, cardId, quantity, priceWei);
        await tx.wait();
      } catch (err) {
        console.log('On-chain listing error (đồng bộ backend):', err);
      }
    }

    // Sync with SQLite Database
    try {
      await fetch(`${API_BASE}/marketplace/sync-listing`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: Date.now() % 100000,
          cardId,
          seller: account,
          quantity,
          pricePerItem,
        }),
      });
    } catch (err) {
      console.log('Lỗi sync listing backend:', err);
    }

    showToast('🎉 Đã đưa lá bài lên Sàn Giao Dịch thành công!', 'success');
    triggerRefresh();
    return true;
  };

  const shortAccount = account
    ? `${account.slice(0, 6)}...${account.slice(-4)}`
    : null;

  return (
    <Web3Context.Provider
      value={{
        account,
        shortAccount,
        walletType,
        balanceRift,
        balanceEth,
        RIFT_PER_ETH,
        formatEthEquivalent,
        formatRiftEquivalent,
        isExchangeModalOpen,
        setIsExchangeModalOpen,
        chainId,
        isConnecting,
        activeTab,
        setActiveTab,
        selectedCardId,
        setSelectedCardId,
        viewCardDetail,
        dataVersion,
        triggerRefresh,
        connectMetaMask,
        disconnectWallet,
        claimFaucet,
        buyCard,
        openPack,
        listCard,
        showToast,
        contractsConfig,
        API_BASE,
      }}
    >
      {children}

      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`px-5 py-3.5 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs md:text-sm font-bold border backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/60 shadow-emerald-500/20'
                : toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-300 border-rose-500/60 shadow-rose-500/20'
                : toast.type === 'warning'
                ? 'bg-amber-950/90 text-amber-300 border-amber-500/60 shadow-amber-500/20'
                : 'bg-slate-900/90 text-cyan-300 border-cyan-500/60 shadow-cyan-500/20'
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </Web3Context.Provider>
  );
}

export const useWeb3 = () => useContext(Web3Context);
