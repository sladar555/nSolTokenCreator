import { useLayoutEffect, useMemo, useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useThemeStore } from "./app/store/theme-store";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
} from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import '@solana/wallet-adapter-react-ui/styles.css';
import "./App.css";

import Home from "./pages/Home";

import Header from "./layouts/Header";
import Footer from "./layouts/Footer";

const App = () => {
  const loadPreferences = useThemeStore((state) => state.loadPreferences);
  const theme = useThemeStore((state) => state.theme);
  const setPreferrence = useThemeStore((state) => state.setPreference);
  useLayoutEffect(() => {
      loadPreferences();
  }, []);
  
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(darkModeMediaQuery.matches);

    const darkModeListener = (event: any) => {
      setDarkMode(event.matches);
      if (event.matches) {
        setPreferrence("dark");
      } else {
        setPreferrence("light");
      }
    };

    darkModeMediaQuery.addEventListener('change', darkModeListener);

    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeListener);
    };
  }, []);

  // const [network, setNetwork] = useState(WalletAdapterNetwork.Devnet);

  // // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint = "https://quaint-clean-forest.solana-devnet.quiknode.pro/c30bc0da3eb1ce797f00572413e0d8e01dd1451a/";

  const [network, setNetwork] = useState(WalletAdapterNetwork.Mainnet);

  // const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  // const endpoint = "https://orbital-blissful-wind.solana-mainnet.quiknode.pro/5b5d9ebef61f09cb6e071557269da4cc01fe43c3/";

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter()
    ],
    [network]
  );

  const handleChange = (event: any) => {
    switch (event.target.value) {
      case "devnet":
        setNetwork(WalletAdapterNetwork.Devnet);
        break;
      case "mainnet":
        setNetwork(WalletAdapterNetwork.Mainnet);
        break;
      case "testnet":
        setNetwork(WalletAdapterNetwork.Testnet);
        break;
      default:
        setNetwork(WalletAdapterNetwork.Mainnet);
        break;
    }
  };

  return ( 
    <>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className="flex flex-col min-h-screen items-center justify-start h-full bg-black">
              <Header />
              <Router>
                <Routes>  
                  <Route path="/" element={<Home />} /> 
                </Routes>
              </Router>
              <Footer /> 
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </>
  );
}

export default App;
