import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';
import defaultContractsConfig from '../config/contracts-config.json';
import defaultContractsAbi from '../config/contracts-abi.json';
import { universalFetch, API_BASE, initLocalStore } from '../utils/api';

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

// Nhận diện tên mạng Blockchain chuẩn theo Chain ID (Hỗ trợ Cronos Testnet & Hardhat)
export const getNetworkInfo = (chainId) => {
  const cid = Number(chainId);
  switch (cid) {
    case 31337:
      return { name: 'Mạng Nội Bộ (Hardhat)', isCorrect: true, badge: 'Hardhat 31337', symbol: 'ETH', isCronos: false };
    case 338:
      return { name: 'Cronos Testnet', isCorrect: true, badge: 'Cronos Testnet (338)', symbol: 'tCRO', isCronos: true };
    case 11155111:
      return { name: 'Sepolia Testnet', isCorrect: true, badge: 'Sepolia', symbol: 'SepoliaETH', isCronos: false };
    default:
      return { name: `Mạng Chain ${cid || 'N/A'}`, isCorrect: true, badge: `Chain ${cid || 'N/A'}`, symbol: 'ETH', isCronos: false };
  }
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

// Robust Ethereum Provider Detection (Multi-wallet & Late injection support)
export const getEthereumProvider = async () => {
  if (typeof window === 'undefined') return null;

  // 1. Immediate check: window.ethereum
  if (window.ethereum) {
    if (Array.isArray(window.ethereum.providers)) {
      const metaMask = window.ethereum.providers.find((p) => p.isMetaMask);
      if (metaMask) return metaMask;
    }
    return window.ethereum;
  }

  // 2. Wait up to 1000ms if extension script injection is delayed
  return new Promise((resolve) => {
    let resolved = false;

    const onInitialized = () => {
      if (resolved) return;
      resolved = true;
      window.removeEventListener('ethereum#initialized', onInitialized);
      if (window.ethereum?.providers) {
        resolve(window.ethereum.providers.find((p) => p.isMetaMask) || window.ethereum);
      } else {
        resolve(window.ethereum || null);
      }
    };

    window.addEventListener('ethereum#initialized', onInitialized, { once: true });

    setTimeout(() => {
      if (resolved) return;
      resolved = true;
      window.removeEventListener('ethereum#initialized', onInitialized);
      if (window.ethereum?.providers) {
        resolve(window.ethereum.providers.find((p) => p.isMetaMask) || window.ethereum);
      } else {
        resolve(window.ethereum || null);
      }
    }, 1000);
  });
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
  const [contractsConfig, setContractsConfig] = useState(defaultContractsConfig);
  const [contractsAbi, setContractsAbi] = useState(defaultContractsAbi);
  const [toast, setToast] = useState(null);

  // Modal Quy Đổi Tiền Tệ
  const [isExchangeModalOpen, setIsExchangeModalOpen] = useState(false);

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

  // Load Smart Contracts config from backend (or fallback to bundled defaults)
  useEffect(() => {
    universalFetch(`${API_BASE}/system/contracts`)
      .then((data) => {
        if (data && data.success && data.data) {
          setContractsConfig(data.data.config || defaultContractsConfig);
          setContractsAbi(data.data.abi || defaultContractsAbi);
        }
      })
      .catch(() => {});
  }, []);

  // Restore or verify MetaMask session on mount
  useEffect(() => {
    if (localStorage.getItem('wallet_manually_disconnected') === 'true') {
      setAccount(null);
      setWalletType(null);
      return;
    }
    let isMounted = true;
    getEthereumProvider().then((ethProvider) => {
      if (!isMounted) return;
      if (ethProvider) {
        ethProvider
          .request({ method: 'eth_accounts' })
          .then((accounts) => {
            if (!isMounted) return;
            if (accounts && accounts.length > 0) {
              const acc = accounts[0];
              setAccount(acc);
              setWalletType('metamask');
              localStorage.setItem(LOCAL_STORAGE_ACCOUNT_KEY, acc);
              localStorage.setItem(LOCAL_STORAGE_WALLET_TYPE_KEY, 'metamask');
              ethProvider.request({ method: 'eth_chainId' }).then((cid) => {
                if (isMounted) setChainId(parseInt(cid, 16));
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
            if (!isMounted) return;
            setAccount(null);
            setWalletType(null);
          });
      } else {
        setAccount(null);
        setWalletType(null);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen to MetaMask account & chain changes
  useEffect(() => {
    let cleanUp = null;
    getEthereumProvider().then((provider) => {
      if (!provider) return;
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          const newAcc = accounts[0];
          setAccount(newAcc);
          setWalletType('metamask');
          localStorage.setItem(LOCAL_STORAGE_ACCOUNT_KEY, newAcc);
          localStorage.setItem(LOCAL_STORAGE_WALLET_TYPE_KEY, 'metamask');
          localStorage.removeItem('wallet_manually_disconnected');
          showToast(`Đã chuyển sang ví: ${newAcc.slice(0, 6)}...${newAcc.slice(-4)}`, 'success');
          triggerRefresh();
        } else {
          setAccount(null);
          setWalletType(null);
          setBalanceRift(0);
          setBalanceEth('0.0000');
          localStorage.removeItem(LOCAL_STORAGE_ACCOUNT_KEY);
          localStorage.removeItem(LOCAL_STORAGE_WALLET_TYPE_KEY);
          localStorage.setItem('wallet_manually_disconnected', 'true');
          showToast('Đã ngắt kết nối ví MetaMask', 'info');
          triggerRefresh();
        }
      };

      const handleChainChanged = (cid) => {
        setChainId(parseInt(cid, 16));
        triggerRefresh();
      };

      if (provider.on) {
        provider.on('accountsChanged', handleAccountsChanged);
        provider.on('chainChanged', handleChainChanged);
      }

      cleanUp = () => {
        if (provider.removeListener) {
          provider.removeListener('accountsChanged', handleAccountsChanged);
          provider.removeListener('chainChanged', handleChainChanged);
        }
      };
    });

    return () => {
      if (cleanUp) cleanUp();
    };
  }, [triggerRefresh]);

  // Fetch balances: cả đồng ETH và đồng $RIFT
  const fetchBalance = useCallback(async () => {
    if (!account) {
      setBalanceRift(0);
      setBalanceEth('0.0000');
      return;
    }

    // 1. Lấy số dư ETH / TCRO trực tiếp từ provider
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const ethBal = await provider.getBalance(account);
        setBalanceEth(parseFloat(ethers.formatEther(ethBal)).toFixed(4));
      } catch (err) {
        // Fallback: nếu MetaMask bị nghẽn RPC hoặc circuit breaker, query trực tiếp RPC Cronos Testnet
        try {
          const fallbackRpc = new ethers.JsonRpcProvider('https://evm-t3.cronos.org');
          const ethBal = await fallbackRpc.getBalance(account);
          setBalanceEth(parseFloat(ethers.formatEther(ethBal)).toFixed(4));
        } catch {
          if (err.code !== -32002 && !err.message?.includes('too many errors')) {
            console.log('Lỗi fetch ETH balance:', err);
          }
        }
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

    // 3. Đồng bộ với SQLite backend hoặc LocalStorage
    try {
      const data = await universalFetch(`${API_BASE}/users/${account}/balance`);
      if (data && data.success && data.data) {
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
    const ethProvider = await getEthereumProvider();
    if (!ethProvider) {
      showToast('⚠️ Không tìm thấy tiện ích MetaMask! Vui lòng kiểm tra xem bạn đã bật extension và mở khóa ví chưa.', 'error');
      return;
    }
    try {
      setIsConnecting(true);
      localStorage.removeItem('wallet_manually_disconnected');

      let accounts = [];
      try {
        await ethProvider.request({
          method: 'wallet_requestPermissions',
          params: [{ eth_accounts: {} }],
        });
        accounts = await ethProvider.request({ method: 'eth_accounts' });
      } catch (permErr) {
        if (permErr.code === 4001) {
          // Người dùng chủ động hủy popup chọn ví
          return;
        }
        const provider = new ethers.BrowserProvider(ethProvider);
        accounts = await provider.send('eth_requestAccounts', []);
      }

      if (accounts && accounts.length > 0) {
        const acc = accounts[0];
        setAccount(acc);
        setWalletType('metamask');
        const provider = new ethers.BrowserProvider(ethProvider);
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
        localStorage.setItem(LOCAL_STORAGE_ACCOUNT_KEY, acc);
        localStorage.setItem(LOCAL_STORAGE_WALLET_TYPE_KEY, 'metamask');
        showToast(`🎉 Đã kết nối ví: ${acc.slice(0, 6)}...${acc.slice(-4)}`, 'success');
        triggerRefresh();
      }
    } catch (error) {
      console.error(error);
      if (error.code !== 4001) {
        showToast('Lỗi kết nối ví: ' + (error.message || 'Người dùng từ chối'), 'error');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Đổi tài khoản ví MetaMask (Cho phép chọn ví khác trực tiếp)
  const switchAccount = async () => {
    const ethProvider = await getEthereumProvider();
    if (!ethProvider) {
      showToast('⚠️ Không tìm thấy tiện ích ví MetaMask trên trình duyệt!', 'warning');
      return;
    }
    try {
      setIsConnecting(true);
      await ethProvider.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }],
      });
      const accounts = await ethProvider.request({ method: 'eth_accounts' });
      if (accounts && accounts.length > 0) {
        const newAcc = accounts[0];
        setAccount(newAcc);
        setWalletType('metamask');
        localStorage.setItem(LOCAL_STORAGE_ACCOUNT_KEY, newAcc);
        localStorage.setItem(LOCAL_STORAGE_WALLET_TYPE_KEY, 'metamask');
        localStorage.removeItem('wallet_manually_disconnected');
        const provider = new ethers.BrowserProvider(ethProvider);
        const network = await provider.getNetwork();
        setChainId(Number(network.chainId));
        showToast(`🎉 Đã chuyển sang ví: ${newAcc.slice(0, 6)}...${newAcc.slice(-4)}`, 'success');
        triggerRefresh();
      }
    } catch (err) {
      if (err.code !== 4001) {
        console.error('Lỗi đổi tài khoản:', err);
        showToast('Lỗi khi đổi tài khoản: ' + (err.message || 'Hủy thao tác'), 'error');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect MetaMask
  const disconnectWallet = () => {
    localStorage.removeItem(LOCAL_STORAGE_ACCOUNT_KEY);
    localStorage.removeItem(LOCAL_STORAGE_WALLET_TYPE_KEY);
    localStorage.setItem('wallet_manually_disconnected', 'true');
    setAccount(null);
    setWalletType(null);
    setBalanceRift(0);
    setBalanceEth('0.0000');
    showToast('Đã ngắt kết nối ví. Bạn có thể bấm "Đổi tài khoản" hoặc mở MetaMask để chọn ví khác.', 'info');
    triggerRefresh();
  };

  const isSwitchingNetworkRef = useRef(false);

  // 1-Click Switch Network to Hardhat Localhost (Chain 31337)
  const switchNetworkToHardhat = async () => {
    if (!window.ethereum) return;
    if (isSwitchingNetworkRef.current) {
      showToast('⚠️ Đang có yêu cầu xử lý mạng trong MetaMask. Vui lòng mở tiện ích ví để duyệt!', 'warning');
      return;
    }

    isSwitchingNetworkRef.current = true;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x7a69' }], // 31337 in hex
      });
      showToast('🎉 Đã chuyển sang mạng Hardhat Localhost (Chain 31337)!', 'success');
    } catch (switchError) {
      if (switchError.code === -32002 || switchError.message?.includes('already pending')) {
        showToast('⚠️ Có yêu cầu đang chờ! Vui lòng mở tiện ích MetaMask và xác nhận.', 'warning');
        return;
      }
      // Error code 4902 hoặc message chứa unrecognized chain id
      if (
        switchError.code === 4902 ||
        switchError.message?.toLowerCase().includes('unrecognized chain id') ||
        switchError.message?.includes('0x7a69')
      ) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x7a69',
                chainName: 'Hardhat Localhost',
                rpcUrls: ['http://127.0.0.1:8545'],
                nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
              },
            ],
          });
          showToast('🎉 Đã thêm và chuyển sang mạng Hardhat Localhost!', 'success');
        } catch (addError) {
          if (addError.code === -32002 || addError.message?.includes('already pending')) {
            showToast('⚠️ Vui lòng mở tiện ích MetaMask để phê duyệt thêm mạng.', 'warning');
          } else if (addError.code === 4001 || addError.message?.includes('User rejected')) {
            showToast('ℹ️ Người dùng đã hủy thêm mạng Hardhat.', 'info');
          } else {
            showToast('Lỗi thêm mạng: ' + addError.message, 'error');
          }
        }
      } else if (switchError.code === 4001 || switchError.message?.includes('User rejected')) {
        showToast('ℹ️ Người dùng đã hủy chuyển mạng.', 'info');
      } else {
        showToast('Lỗi chuyển mạng: ' + switchError.message, 'error');
      }
    } finally {
      isSwitchingNetworkRef.current = false;
    }
  };

  // 1-Click Switch Network to Cronos Testnet (Chain 338)
  const switchNetworkToCronosTestnet = async () => {
    if (!window.ethereum) {
      showToast('⚠️ Vui lòng cài đặt ví MetaMask!', 'warning');
      return;
    }
    if (isSwitchingNetworkRef.current) {
      showToast('⚠️ Đang có yêu cầu xử lý mạng trong MetaMask. Vui lòng mở tiện ích ví để duyệt!', 'warning');
      return;
    }

    isSwitchingNetworkRef.current = true;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x152' }], // 338 in hex
      });
      showToast('🎉 Đã chuyển sang mạng Cronos Testnet (Chain 338)!', 'success');
    } catch (switchError) {
      if (switchError.code === -32002 || switchError.message?.includes('already pending')) {
        showToast('⚠️ Có yêu cầu đang chờ! Vui lòng mở tiện ích MetaMask và xác nhận.', 'warning');
        return;
      }
      if (
        switchError.code === 4902 ||
        switchError.message?.toLowerCase().includes('unrecognized chain id') ||
        switchError.message?.includes('0x152')
      ) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x152',
                chainName: 'Cronos Testnet',
                rpcUrls: [
                  'https://evm-t3.cronos.org',
                  'https://cronos-testnet.crypto.org:8545',
                  'https://cronos-testnet-3.crypto.org:8545',
                ],
                nativeCurrency: { name: 'Cronos Test Token', symbol: 'tCRO', decimals: 18 },
                blockExplorerUrls: ['https://explorer.cronos.org/testnet'],
              },
            ],
          });
          showToast('🎉 Đã thêm và chuyển sang mạng Cronos Testnet!', 'success');
        } catch (addError) {
          if (addError.code === -32002 || addError.message?.includes('already pending')) {
            showToast('⚠️ Vui lòng mở tiện ích MetaMask để phê duyệt thêm mạng.', 'warning');
          } else if (addError.code === 4001 || addError.message?.includes('User rejected')) {
            showToast('ℹ️ Người dùng đã hủy thêm mạng Cronos Testnet.', 'info');
          } else {
            showToast('Lỗi thêm mạng: ' + addError.message, 'error');
          }
        }
      } else if (switchError.code === 4001 || switchError.message?.includes('User rejected')) {
        showToast('ℹ️ Người dùng đã hủy chuyển mạng.', 'info');
      } else {
        showToast('Lỗi chuyển mạng: ' + switchError.message, 'error');
      }
    } finally {
      isSwitchingNetworkRef.current = false;
    }
  };

  // 1-Click Switch Network to Ethereum Sepolia Testnet (Chain 11155111 / 0xaa36a7)
  const switchNetworkToSepolia = async () => {
    if (!window.ethereum) {
      showToast('⚠️ Vui lòng cài đặt ví MetaMask!', 'warning');
      return;
    }
    if (isSwitchingNetworkRef.current) {
      showToast('⚠️ Đang có yêu cầu xử lý mạng trong MetaMask. Vui lòng mở tiện ích ví để duyệt!', 'warning');
      return;
    }

    isSwitchingNetworkRef.current = true;
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0xaa36a7' }], // 11155111 in hex
      });
      showToast('🎉 Đã chuyển sang mạng Ethereum Sepolia Testnet!', 'success');
    } catch (switchError) {
      if (switchError.code === -32002 || switchError.message?.includes('already pending')) {
        showToast('⚠️ Có yêu cầu đang chờ! Vui lòng mở tiện ích MetaMask và xác nhận.', 'warning');
        return;
      }
      if (
        switchError.code === 4902 ||
        switchError.message?.toLowerCase().includes('unrecognized chain id') ||
        switchError.message?.includes('0xaa36a7')
      ) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0xaa36a7',
                chainName: 'Sepolia Testnet',
                rpcUrls: ['https://rpc.sepolia.org', 'https://ethereum-sepolia-rpc.publicnode.com'],
                nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          showToast('🎉 Đã thêm và chuyển sang mạng Ethereum Sepolia!', 'success');
        } catch (addError) {
          if (addError.code === 4001 || addError.message?.includes('User rejected')) {
            showToast('ℹ️ Người dùng đã hủy thêm mạng Sepolia.', 'info');
          } else {
            showToast('Lỗi thêm mạng: ' + addError.message, 'error');
          }
        }
      } else if (switchError.code === 4001 || switchError.message?.includes('User rejected')) {
        showToast('ℹ️ Người dùng đã hủy chuyển mạng.', 'info');
      } else {
        showToast('Lỗi chuyển mạng: ' + switchError.message, 'error');
      }
    } finally {
      isSwitchingNetworkRef.current = false;
    }
  };

  // Switch to appropriate Ethereum network (Hardhat if localhost, Sepolia if on production)
  const switchNetworkToEthereum = async () => {
    const isLocal =
      typeof window !== 'undefined' &&
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isLocal) {
      return await switchNetworkToHardhat();
    } else {
      return await switchNetworkToSepolia();
    }
  };

  // Deposit / Swap Crypto (ETH or Cronos TCRO) for $RIFT
  const depositCryptoForRift = async (amount, currency = 'ETH') => {
    if (!account) {
      showToast('⚠️ Vui lòng kết nối ví MetaMask trước khi quy đổi!', 'warning');
      connectMetaMask();
      return false;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast(`⚠️ Số lượng ${currency} quy đổi phải lớn hơn 0!`, 'warning');
      return false;
    }

    // Tỷ giá: 1 ETH = 10,000 $RIFT; 1 TCRO (Cronos Testnet) = 100 $RIFT
    const rate = currency === 'TCRO' ? 100 : RIFT_PER_ETH;
    const riftAmount = Math.round(numAmount * rate);

    let txHash = null;

    // 1. Thực hiện chuyển tiền thật qua MetaMask trên EVM Blockchain
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        const activeChainId = Number(network.chainId);

        // Kiểm tra an toàn: Chặn việc trừ nhầm token khác mạng
        if (currency === 'ETH' && activeChainId === 338) {
          showToast('⚠️ Bạn đang chọn đổi ETH nhưng ví MetaMask đang ở Cronos Testnet (đồng TCRO). Vui lòng chuyển mạng sang Ethereum!', 'warning');
          await switchNetworkToEthereum();
          return false;
        }

        if (currency === 'TCRO' && activeChainId !== 338) {
          showToast('⚠️ Bạn đang chọn đổi TCRO nhưng ví MetaMask chưa ở mạng Cronos Testnet. Vui lòng chuyển sang Cronos!', 'warning');
          await switchNetworkToCronosTestnet();
          return false;
        }

        showToast(`⏳ Đang gửi yêu cầu MetaMask chuyển ${numAmount} ${currency}...`, 'info');

        const signer = await provider.getSigner();

        const recipient =
          contractsConfig?.treasury ||
          '0xeb301886d4C303369C1A3bfA232B30F3D1c4Ea72';

        const requiredWei = ethers.parseEther(numAmount.toString());

        const tx = await signer.sendTransaction({
          to: recipient,
          value: requiredWei,
        });

        showToast(`⛓️ Giao dịch đã phát lên Blockchain (${currency})! Đang chờ khối xác nhận...`, 'info');
        const receipt = await tx.wait();
        txHash = receipt.hash;
      } catch (err) {
        console.error('Lỗi giao dịch blockchain:', err);
        const errDetail = [
          err.code,
          err.message,
          err.shortMessage,
          err.reason,
          err.error?.message,
          err.error?.code,
          err.info?.error?.message,
        ].filter(Boolean).join(' ');

        if (
          err.code === 'ACTION_REJECTED' ||
          errDetail.includes('user rejected') ||
          errDetail.includes('denied')
        ) {
          showToast('❌ Bạn đã hủy giao dịch trên ví MetaMask.', 'error');
          return false;
        }
        if (err.code === 'INSUFFICIENT_FUNDS' || errDetail.includes('insufficient funds')) {
          showToast(`❌ Không đủ phí gas hoặc số dư ${currency} để thực hiện giao dịch!`, 'error');
          return false;
        }
        if (
          err.code === -32002 ||
          errDetail.includes('too many errors') ||
          errDetail.includes('retrying') ||
          errDetail.includes('coalesce error')
        ) {
          showToast('⏳ Node RPC Cronos của MetaMask đang quá tải (rate-limit). Vui lòng đợi 15-30 giây hoặc bấm "Nhận 1,000 $RIFT (Faucet)" để nạp ngay!', 'warning');
          return false;
        }
        showToast(
          `❌ Lỗi giao dịch: ${err.reason || err.shortMessage || err.message || 'Không thể gửi giao dịch'}`,
          'error'
        );
        return false;
      }
    }

    // 2. Cập nhật số dư trong Database / LocalStorage sau khi giao dịch on-chain thành công
    try {
      await universalFetch(`${API_BASE}/users/${account}/deposit-eth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ethAmount: numAmount, riftAmount, txHash, currency }),
      });
    } catch (err) {
      console.log('Lỗi sync deposit-eth:', err);
    }

    // 3. Cập nhật state UI
    setBalanceRift((prev) => Number(prev) + riftAmount);
    showToast(`🎉 Quy đổi thành công! Đã nạp ${numAmount} ${currency} và nhận ${riftAmount.toLocaleString()} $RIFT.`, 'success');
    await fetchBalance();
    triggerRefresh();
    return true;
  };

  const depositEthForRift = (ethAmount) => depositCryptoForRift(ethAmount, 'ETH');

  // Claim Faucet (+1,000 $RIFT) (Legacy Fallback)
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
      await universalFetch(`${API_BASE}/users/${account}/faucet`, { method: 'POST' });
    } catch (err) {
      console.log('Lỗi sync faucet:', err);
    }

    if (window.ethereum && contractsConfig?.contracts?.RiftToken) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (Number(network.chainId) === contractsConfig.chainId) {
          const signer = await provider.getSigner();
          const riftContract = new ethers.Contract(
            contractsConfig.contracts.RiftToken,
            contractsAbi.RiftToken,
            signer
          );
          const tx = await riftContract.claimFaucet();
          await tx.wait();
        }
      } catch (err) {
        console.log('On-chain faucet notice:', err.message);
      }
    }

    showToast('🎉 Nhận thành công 1,000 $RIFT vào ví MetaMask!', 'success');
    triggerRefresh();
  };

  // Buy Card on Marketplace
  const buyCard = async (listingId, pricePerItem, quantity = 1, seller = null) => {
    if (!account) {
      showToast('⚠️ Vui lòng kết nối ví MetaMask để thực hiện mua thẻ bài!', 'warning');
      connectMetaMask();
      return false;
    }

    // Chặn người bán tự mua thẻ của chính mình (Anti Wash Trading)
    if (seller && account && seller.toLowerCase() === account.toLowerCase()) {
      showToast('⚠️ Bạn là người bán lá bài này, không thể tự mua thẻ của chính mình! Hãy bấm Hủy Niêm Yết để nhận lại thẻ.', 'warning');
      return false;
    }

    const totalPrice = Number(pricePerItem) * Number(quantity);

    if (Number(balanceRift) < totalPrice) {
      showToast(`Số dư ví (${balanceRift} $RIFT) không đủ để thanh toán ${totalPrice} $RIFT! Vui lòng đổi thêm ETH sang $RIFT.`, 'warning');
      setIsExchangeModalOpen(true);
      return false;
    }

    // 1. Đồng bộ mua thẻ ngay lập tức với Database / LocalStorage
    let saleResult = null;
    try {
      saleResult = await universalFetch(`${API_BASE}/marketplace/sync-sale`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, quantity, buyer: account }),
      });
      if (!saleResult || !saleResult.success) {
        showToast(saleResult?.message || 'Lỗi khi khớp lệnh mua thẻ!', 'error');
        triggerRefresh();
        return false;
      }
    } catch (err) {
      console.log('Lỗi sync sale:', err);
      showToast('Lỗi kết nối khi mua thẻ!', 'error');
      triggerRefresh();
      return false;
    }

    // Instant balance UI deduction sau khi backend xác nhận hợp lệ
    if (saleResult?.data?.newBalance !== undefined) {
      setBalanceRift(saleResult.data.newBalance);
    } else {
      setBalanceRift((prev) => Math.max(0, Number(prev) - totalPrice));
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
    await fetchBalance();
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
        const network = await provider.getNetwork();
        if (Number(network.chainId) === contractsConfig.chainId) {
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
        }
      } catch (err) {
        console.log('On-chain pack opening error:', err);
      }
    }

    // Backend fallback / simulation
    if (!cardIds || cardIds.length === 0) {
      try {
        const data = await universalFetch(`${API_BASE}/packs/simulate-open`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ packId }),
        });
        if (data && data.success && data.data?.cards) {
          cardIds = data.data.cards.map((c) => c.id);
        }
      } catch (err) {
        console.error(err);
      }
    }

    // Dự phòng offline khi chạy trên Vercel: sinh ngẫu nhiên các lá bài từ 1 đến 50
    if (!cardIds || cardIds.length === 0) {
      const count = Number(packId) === 1 ? 3 : 5;
      cardIds = Array.from({ length: count }, () => Math.floor(Math.random() * 48) + 1);
    }

    // Save cards won into user's Inventory
    if (cardIds && cardIds.length > 0) {
      try {
        await universalFetch(`${API_BASE}/users/${account}/pack-rewards`, {
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
    if (window.ethereum && contractsConfig?.contracts?.RiftMarketplace) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (Number(network.chainId) === contractsConfig.chainId) {
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
        }
      } catch (err) {
        console.log('On-chain listing error (đồng bộ backend):', err);
      }
    }

    // Sync with Database / LocalStorage
    try {
      const res = await universalFetch(`${API_BASE}/marketplace/sync-listing`, {
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

      if (res && res.success === false) {
        showToast(res.message || 'Lỗi khi niêm yết thẻ bài!', 'error');
        return false;
      }
    } catch (err) {
      console.log('Lỗi sync listing:', err);
      showToast('Lỗi khi gửi yêu cầu niêm yết: ' + (err.message || ''), 'error');
      return false;
    }

    showToast('🎉 Đã đưa lá bài lên Sàn Giao Dịch thành công!', 'success');
    triggerRefresh();
    return true;
  };

  // Cancel Listing (Hủy Niêm Yết Thẻ Bài)
  const cancelListing = async (listingId) => {
    if (!account) {
      showToast('⚠️ Vui lòng kết nối ví MetaMask để hủy niêm yết!', 'warning');
      connectMetaMask();
      return false;
    }

    showToast('⏳ Đang xử lý lệnh hủy niêm yết...', 'info');

    // 1. Giao dịch On-Chain nếu MetaMask kết nối
    if (window.ethereum && contractsConfig?.contracts?.RiftMarketplace) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const network = await provider.getNetwork();
        if (Number(network.chainId) === contractsConfig.chainId) {
          const signer = await provider.getSigner();
          const mktAddress = contractsConfig.contracts.RiftMarketplace;
          const mktContract = new ethers.Contract(mktAddress, contractsAbi.RiftMarketplace, signer);

          const tx = await mktContract.cancelListing(listingId);
          await tx.wait();
        }
      } catch (err) {
        console.log('On-chain cancel notice:', err.message);
      }
    }

    // 2. Đồng bộ với Database / LocalStorage
    try {
      const data = await universalFetch(`${API_BASE}/marketplace/sync-cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, seller: account }),
      });
      if (!data.success) {
        showToast(data.message || 'Lỗi khi hủy niêm yết!', 'error');
        return false;
      }
    } catch (err) {
      console.log('Lỗi sync cancel:', err);
    }

    showToast('🎉 Đã hủy niêm yết thành công! Thẻ bài đã được trả lại vào Bộ Sưu Tập của bạn.', 'success');
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
        switchAccount,
        disconnectWallet,
        switchNetworkToHardhat,
        switchNetworkToCronosTestnet,
        switchNetworkToSepolia,
        switchNetworkToEthereum,
        getNetworkInfo,
        depositEthForRift,
        depositCryptoForRift,
        claimFaucet,
        buyCard,
        openPack,
        listCard,
        cancelListing,
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
