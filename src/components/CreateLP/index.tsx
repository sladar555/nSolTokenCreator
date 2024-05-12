import React, { useState, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import getTokens from "../../utils/libMetadata";
import { token } from "@metaplex-foundation/js";
import { getShortHash, getShortLink, sleep } from "../../utils/general";
import { revokeMintAuthority, revokeFreezeAuthority } from "../../utils/libRevoke";

const CreateLPComponent = () => {
    const wallet = useWallet();
    const { connection } = useConnection();

    const [isModalOpened, setIsModalOpened] = useState(false);
    const [isModalLoading, setIsModalLoading] = useState(false);

    const [tokens, setTokens] = useState([]);
    const [currentToken, setCurrentToken] = useState("");

    const [revokeTx, setRevokeTx] = useState("");

    const [isMintRevoking, setIsMintRevoking] = useState(false);
    const [isFreezeRevoking, setIsFreezeRevoking] = useState(false);

    const copyClipboard = async (addr: string) => {
        try {
            await navigator.clipboard.writeText(addr);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    const showModal = async (e: any) => {
        e.preventDefault();      
        setIsModalLoading(true);

        await fetchTokens();
        
        setIsModalOpened(true);
        setIsModalLoading(false);
    };

    const closeModal = () => {
        setIsModalOpened(false);
    };

    const chooseToken = (tokenInfo: any) => {
        setCurrentToken(tokenInfo.address);
        setIsModalOpened(false);
    };
    
    const revokeFreeze = async (e: any) => {
        console.log("revokeFreeze start!");

        if (isFreezeRevoking || isMintRevoking) return;

        setIsFreezeRevoking(true);

        const { txLink, error } = await revokeFreezeAuthority(wallet, connection, currentToken);

        console.log(txLink, error);

        if (!error) {
            setRevokeTx(txLink);    
        } else {
            alert("Error! Please check SOL Balance or Network Connection!");
            setRevokeTx("");
        }

        setIsFreezeRevoking(false);
    };

    const revokeMint = async (e: any) => {
        console.log("revokeMint start!");

        if (isFreezeRevoking || isMintRevoking) return;

        setIsMintRevoking(true);

        const { txLink, error } = await revokeMintAuthority(wallet, connection, currentToken);

        console.log(txLink, error);

        if (!error) {
            setRevokeTx(txLink);    
        } else {
            alert("Error! Please check SOL Balance or Network Connection!");
            setRevokeTx("");
        }

        setIsMintRevoking(false);
    };

    const fetchTokens = async () => {
        let tokens = await getTokens(wallet.publicKey.toBase58(), connection); 
        setTokens(tokens);
    };

    const getSearchBarTxt = () => {
        if (!isModalLoading) {
            if (currentToken == "") {
                return "Select a token";
            } else {
                return currentToken;
            }
        } else {
            return "Loading Token List. Please wait a few seconds...";
        }
    }
    
    useEffect(() => {
        if (wallet.connected)
            fetchTokens();
    }, [wallet]);

    return (
        <div className="container mt-[85px]">
            <h1 className="text-[32px] sm:text-[40px] font-bold mb-[30px]">Liquidity Pool Creation Requirements</h1>
            <div className="relative w-full gradient rounded-[20px] mb-6"> 
                <div className="absolute w-full h-full flex rounded-[20px] bg-transparent p-4">
                    <div className="w-1/2 shadow1 rounded-[20px] bg-transparent"></div>
                    <div className="w-1/2 shadow2 rounded-[20px] bg-transparent"></div>
                </div>
                <div className="row relative z-10 bg-[#18225D] p-[20px] sm:p-[30px] rounded-[20px] flex flex-col gap-[20px]">
                    <div className="mb-[10px] text-[18px] opacity-70">To set up a liquidity pool, you must first "Revoke Freeze Authority" for your token, which can be done here at a cost of 0.1 SOL.</div>
                    <div className="text-[18px] opacity-70">Additionally, revoking the Mint Authority enhances security for buyers. You can perform this action here, also for a fee of 0.1 SOL.</div>
                    <div className="text-[18px] opacity-70">If your token doesn't show up, refresh the page. (Don't forget to save your Openbook Market ID)</div>

                    <div className="w-full flex flex-col gap-[20px] items-center">
                        <button id="dropdownUsersButton" onClick={showModal} data-dropdown-toggle="dropdownUsers" data-dropdown-placement="bottom" className="flex flex-row justify-between w-full bg-[#0D0A28] rounded-[10px] py-[15px] px-[15px] text-white focus:ring-2 focus:outline-none focus:ring-blue-300 font-medium text-center inline-flex items-center" type="button">
                            <div className="flex flex-row items-center gap-[10px]">
                                <svg xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 24 24"><path fill="currentColor" d="M9.538 15.23q-2.398 0-4.064-1.666T3.808 9.5q0-2.398 1.666-4.064t4.064-1.667q2.399 0 4.065 1.667q1.666 1.666 1.666 4.064q0 1.042-.369 2.017q-.37.975-.97 1.668l5.908 5.907q.14.14.15.345q.01.203-.15.363q-.16.16-.353.16q-.195 0-.354-.16l-5.908-5.908q-.75.639-1.725.989q-.975.35-1.96.35m0-1q1.99 0 3.361-1.37q1.37-1.37 1.37-3.361q0-1.99-1.37-3.36q-1.37-1.37-3.36-1.37q-1.99 0-3.361 1.37q-1.37 1.37-1.37 3.36q0 1.99 1.37 3.36q1.37 1.37 3.36 1.37"/></svg>
                                { getSearchBarTxt() }
                            </div>
                            <svg className="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4"/>
                            </svg>
                        </button>
                        
                        <div className="w-full lg:w-1/2 flex flex-col sm:flex-row gap-[20px] justify-between">
                            <div className="flex flex-col gap-[5px] w-full">
                                <button onClick={revokeFreeze} className="min-w-[250px] rounded-[15px] px-[20px] py-[10px] border-[1px] text-[#3bd0d8] border-[#58f3cd] bg-gradient-to-r from-[rgba(59,208,216,.2)] to-[rgb(59,208,216,0)]">
                                    { isFreezeRevoking? "Revoking Now...": "Revoke Freeze Authority" }
                                </button>
                            </div>
                            <div onClick={revokeMint} className="flex flex-col gap-[5px] w-full">
                                <button className="min-w-[250px] rounded-[15px] px-[20px] py-[10px] border-[1px] text-[#3bd0d8] border-[#58f3cd] bg-gradient-to-r from-[rgba(59,208,216,.2)] to-[rgb(59,208,216,0)]">
                                    { isMintRevoking? "Revoking Now...": "Revoke Mint Authority" }
                                </button>                                
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div aria-hidden="true" className={isModalOpened? "bg-[rgba(0,0,0,0.8)] rounded-[20px] flex items-center justify-center overflow-y-auto overflow-x-hidden fixed top-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-screen max-h-full": "hidden"} style={{ fontFamily: "Gilroy-Bold" }}>
                <div className="relative p-4 w-full max-w-2xl max-h-full">
                    <div className="relative rounded-[20px] shadow bg-gray-900 h-[400px]">
                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t border-gray-600">
                            <h3 className="text-xl font-semibold text-white">
                                Select a token
                            </h3>
                            <button type="button" onClick={closeModal} className="text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white" data-modal-hide="default-modal">
                                <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                                </svg>
                                <span className="sr-only">Close modal</span>
                            </button>
                        </div>
                        <div className="p-3 md:p-5 space-y-4">
                            <div className="pr-2 flex flex-col w-full h-[250px] overflow-y-scroll">
                                {
                                    (tokens.length > 0)? 
                                        tokens.map((value, index) => 
                                            <div key={index} onClick={(e: any) => chooseToken(value)} className="hover:bg-[#36d1ab] cursor-pointer px-[10px] py-[4px] flex flex-row justify-between items-center w-full border-b-[1px] border-solid border-[#999999]">
                                                <div className="flex flex-row justify-left items-center gap-[5px]">
                                                    <div className="w-[60px] h-[40px] flex items-center justify-center">
                                                        <div>{index + 1}</div>
                                                    </div>
                                                    <div>{(value.name)? `${value.name} (${value.symbol})`: ""}</div>
                                                </div>
                                                <div>{getShortHash(value.address)}</div>
                                            </div>
                                        )
                                        : "" 
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {
                revokeTx != ""? 
                    <div className="w-full flex flex-col items-center justify-center gap-[25px]">
                        <div className="cursor-pointer flex flex-row justify-center items-center h-[30px] gap-[20px]">
                            <a href={revokeTx} target="_blank"><u>{getShortLink(revokeTx)}</u></a>
                            <svg xmlns="http://www.w3.org/2000/svg" onClick={() => copyClipboard(revokeTx)} width="20px" height="20px" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>
                        </div>
                    </div>
                    : ""
            }
            <div className="text-[18px] opacity-70 mt-[50px] mb-[20px]">For the final step, please create a liquidity pool on Raydium by following the link below. You will need to import your OpenBook market ID during this process. Follow the instructions provided to complete the setup of your liquidity pool.</div>
            {/* <a href="https://raydium.io/liquidity/create/" target="_blank" className="text-[18px] opacity-70"><u>https://raydium.io/liquidity/create/</u></a> */}
        </div>
    );
};

export default CreateLPComponent;