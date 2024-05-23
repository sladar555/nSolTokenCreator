import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getAccountLink, getShortHash, getShortLink } from "../../utils/general";
import { validateMint } from "../../utils/token";
import getTokens from "../../utils/libMetadata";
import { tokenTransfer } from "../../utils/libAirdrop";

const Airdrop = () => {
    const wallet = useWallet();
    const { connection } = useConnection();

    const [destWallet, setDestWallet] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [amounts, setAmounts] = useState(100);

    const [tokens, setTokens] = useState([]);
    const [currentToken, setCurrentToken] = useState("");

    const copyClipboard = async (addr: string) => {
        try {
            await navigator.clipboard.writeText(addr);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    };

    const chooseToken = (e: any) => {
        console.log(tokens[e.target.selectedIndex].address);
        copyClipboard(tokens[e.target.selectedIndex].address);
        setCurrentToken(tokens[e.target.selectedIndex]);
    };

    const fetchTokens = async () => {
        let tokens = await getTokens(wallet.publicKey.toBase58(), connection); 
        setTokens(tokens);
        if (tokens.length > 0) {
            setCurrentToken(tokens[0].address);
        }
    };

    useEffect(() => {
        if (wallet.connected)
            fetchTokens();
    }, [wallet]);

    useEffect(() => {
        if (tokens.length > 0) {
            copyClipboard(tokens[0].address);
            setCurrentToken(tokens[0]);
        }
    }, [tokens]);

    const airdrop = async (e: any) => {
        e.preventDefault();
        if (isSending) return;

        setIsSending(true);

        if (destWallet == "") {
            alert("Invalid Parameter!");
            setIsSending(false);
            return;
        }

        console.log("currentToken: ", currentToken);

        // @ts-ignore
        const { txLink, error } = await tokenTransfer(currentToken.address, currentToken.decimals, wallet, destWallet, connection, amounts);

        console.log(txLink, error);

        if (!error) {
            copyClipboard(txLink);
            alert(txLink);
        } else {
            alert(error);  
        }
        
        setIsSending(false);
    };

    return (
        <div className="container min-h-screen flex items-start justify-center px-[40px]">
            <div className="w-full py-[20px] lg:!py-[20px] flex flex-col mt-[60px] items-center justify-center">
                <div className="max-w-[600px] w-full flex flex-col items-center justify-center gap-[20px]">
                    <div className="create__container w-full p-0 w-full mb-[40px]">
                        <div className="create__form-container">
                            <h2 className="create__heading">
                                <img className="create__heading-icon" src="assets/images/create_lp_icon.svg" alt="Feature Create Icon" />
                                <span>Airdrop Tokens</span>
                            </h2>
                            <h3 className="create__subheading">Send Tokens with one transaction to multiple wallets at once.</h3>
                            <form className="create__form" noValidate={false}>
                                <h4 className="create__input-name">Choose Token</h4>

                                <select className="w-full text-sm bg-transparent h-[40px] border-gray-500 border-b-[1px] mb-4 focus:border-[#8A52EB] focus:outline-none focus:ring-0"  onChange={chooseToken}>
                                    {
                                        tokens.map((value, index) => 
                                            <option className="bg-[#000000]" key={index} data-address={value.address}>
                                                {(value.name)? `${value.name}`: ""}&nbsp;({getShortHash(value.address)})
                                            </option>
                                        )
                                    }
                                </select>

                                <div id="dropdown" className="z-10 hidden divide-y divide-gray-100 rounded-lg shadow w-44 bg-gray-700">
                                    <ul className="py-2 text-sm text-gray-200" aria-labelledby="dropdownDefaultButton">
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Dashboard</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Settings</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Earnings</a>
                                        </li>
                                        <li>
                                            <a href="#" className="block px-4 py-2 hover:bg-gray-600 hover:text-white">Sign out</a>
                                        </li>
                                    </ul>
                                </div>

                                <div className="flex flex-row justify-between items-center w-full gap-[20px]">
                                    <div className="relative z-0 w-full mb-4 group">
                                        <input type="text" name="wallet" id="wallet" onChange={(e: any) => setDestWallet(e.target.value)} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                        <label htmlFor="wallet" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter wallet to airdrop</label>
                                    </div>
                                    <div className="relative z-0 w-full mb-4 group">
                                        <input type="text" name="amount" id="amount" onChange={(e: any) => setAmounts(e.target.value)} defaultValue={amounts} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                        <label htmlFor="amount" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Enter amount to airdrop</label>
                                    </div>
                                </div>
                            
                                <button onClick={airdrop} type="button" className="create__deploy uppercase focus:outline-0 focus:ring-0">
                                    { isSending? "Transfering Now...": "Airdrop (0.01 SOL)" }
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Airdrop;