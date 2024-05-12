
import React, { useState, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import CreateMarket from "../../utils/libMarket";
import { validateMint } from "../../utils/token";
import { getAccountLink, getShortHash, getShortLink } from "../../utils/general";

const CreateMarketComponent = () => {
    const wallet = useWallet();
    const { connection } = useConnection();

    const [baseMint, setBaseMint] = useState("");
    const [lotSize, setLotSize] = useState(2);
    const [tickSize, setTickSize] = useState(4);

    const [marketAddr, setMarketAddr] = useState("");
    const [marketTx, setMarketTx] = useState("");

    const [isCreating, setIsCreating] = useState(false);

    const copyClipboard = async (addr: string) => {
        try {
            await navigator.clipboard.writeText(addr);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    const createMarket = async (e: any) => {
        e.preventDefault();

        if (isCreating) return;

        setIsCreating(true);
        
        if (baseMint == "" || lotSize <= 0 || tickSize <= 0) {
            alert("Invalid Parameter!");
            setIsCreating(false);
            return;
        }

        console.log("mintAddress: ", baseMint);

        // Validate Mint Address
        const mintAccount = await validateMint(connection, baseMint);
        
        console.log("mintAccount", mintAccount);
        if (mintAccount == null) {
            alert("Invalid Mint Address!");
            setIsCreating(false);
            return;
        }

        const {marketAddr, marketTx, error } = await CreateMarket(wallet, connection, baseMint, lotSize, tickSize, mintAccount.decimals);

        console.log(marketAddr, marketTx, error);

        if (!error) {
            setMarketAddr(marketAddr);
            setMarketTx(marketTx);    
        } else {
            alert("Error! Please check SOL Balance or Network Connection!");
            setMarketAddr('');
            setMarketTx('');    
        }
        
        setIsCreating(false);
    };

    return (
        <div className="container flex flex-col gap-[85px]">
            {/* Instructions */}         
            <div className="w-full">
                <div className="flex flex-col gap-[10px]">
                    <h1 className="text-[32px] sm:text-[40px] font-bold mb-6">How to use Openbook Market ID Creator</h1>
                    {/* <div className="mb-[10px] text-[18px] opacity-70">The minimum order and tick size outlined below serve as general guidelines for creating a market. However, you should tailor these parameters to suit your token based on its total supply, the liquidity available in the pool, and the target price.</div> */}
                    <div className="mb-[20px] text-[18px] opacity-70">To have your token listed on an exchange such as Raydium, you must first create a market ID. This identifier is essential for integrating your token into the exchange's ecosystem, enabling trading and visibility among users. The process involves specifying key details about your token, such as supply, trading pairs, and market rules, to ensure it meets the exchange's standards and regulatory requirements. Creating a market ID is a crucial step for your token's successful listing and subsequent trading on the platform.</div>
                    <div className="mb-[10px] text-[18px] opacity-70">1. Enter Base Token: Copy the address of your newly created token and paste here.</div>
                    <div className="mb-[10px] text-[18px] opacity-70">2. Enter Min. Order Size (see below)</div>
                    <div className="mb-[10px] text-[18px] opacity-70">3. Enter Tick Size (see below)</div>
                </div>
            </div>
            <div className="w-full">
                <h1 className="text-[32px] sm:text-[40px] font-bold mb-6">Openbook Market ID Creator</h1>
                
                <div className="relative w-full gradient rounded-[20px] mb-6"> 
                    <div className="absolute w-full h-full flex rounded-[20px] bg-transparent p-4">
                        <div className="w-1/2 shadow1 rounded-[20px] bg-transparent"></div>
                        <div className="w-1/2 shadow2 rounded-[20px] bg-transparent"></div>
                    </div>  
                    <div className="row relative z-10 bg-[#18225D] p-[20px] sm:p-[30px] rounded-[20px] flex flex-col gap-[20px]">
                        <div className="w-full flex flex-col gap-[20px]">
                            <div className="w-full flex flex-col sm:flex-row gap-[20px] justify-between">
                                <div className="flex flex-col gap-[5px] w-full">
                                    <div className="opacity-70">Base Token*</div>
                                    <input type="text" defaultValue={baseMint} placeholder="Base Token Address" className="bg-[#0D0A28] rounded-[10px] py-[15px] px-[20px]" onChange={(e: any) => setBaseMint(e.target.value)} />
                                </div>
                            </div>

                            <div className="w-full flex flex-col sm:flex-row gap-[20px] justify-between">
                                <div className="flex flex-col gap-[5px] w-full">
                                    <div className="opacity-70">Min Order Size*</div>
                                    <div className="bg-[#0D0A28] rounded-[10px] flex pl-[5px] gap-[5px]">
                                        {/* <span className="flex items-center">
                                            1e
                                            <sup>-x</sup>
                                        </span> */}
                                        <input type="text" defaultValue={lotSize} className="bg-[#0D0A28] flex-1 rounded-r-[10px] py-[15px] px-[20px] ring-none focus:ring-none outline-none focus:outline-none" onChange={(e: any) => setLotSize(e.target.value)} />
                                    </div>
                                    <div className="text-[16px] opacity-70">Min Order size refers to the minimum quantity of an asset that can be traded in a single transaction.</div>
                                </div>
                                <div className="flex flex-col gap-[5px] w-full">
                                    <div className="opacity-70">Tick Size*</div>
                                    <div className="bg-[#0D0A28] rounded-[10px] flex pl-[5px] gap-[5px]">
                                        {/* <span className="flex items-center">
                                            1e
                                            <sup>-x</sup>
                                        </span> */}
                                        <input type="text" defaultValue={tickSize} className="bg-[#0D0A28] flex-1 rounded-r-[10px] py-[15px] px-[20px] ring-none focus:ring-none outline-none focus:outline-none" onChange={(e: any) => setTickSize(e.target.value)} />
                                    </div>
                                    <div className="text-[16px] opacity-70">Tick size is the smallest increment by which the price of the asset can move.</div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex justify-center mb-[20px]">
                            <button className="min-w-[250px] rounded-[15px] px-[20px] py-[10px] border-[1px] text-[#3bd0d8] border-[#58f3cd] bg-gradient-to-r from-[rgba(59,208,216,.2)] to-[rgb(59,208,216,0)]" onClick={createMarket}>
                                {
                                    isCreating? "Market Creating...": "Create Market (2.33 SOL)"
                                }
                            </button>
                        </div>
                        <div className="text-[18px] opacity-70">Please make sure you have at least 2.33 SOL in your wallet to cover the transaction fee for this process.</div>
                    </div>
                </div>

                {
                    marketAddr != ""? 
                        <div className="w-full flex flex-col items-center justify-center gap-[25px]">
                            <div className="cursor-pointer flex flex-row justify-center items-center h-[30px] gap-[20px]">
                                Market ID: <a href={getAccountLink(marketAddr)} target="_blank"><u>{getShortHash(marketAddr)}</u></a>
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => copyClipboard(marketAddr)} width="20px" height="20px" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>
                            </div>
                            <div className="cursor-pointer flex flex-row justify-center items-center h-[30px] gap-[20px]">
                                <a href={marketTx} target="_blank"><u>{getShortLink(marketTx)}</u></a>
                                <svg xmlns="http://www.w3.org/2000/svg" onClick={() => copyClipboard(marketTx)} width="20px" height="20px" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>
                            </div>
                        </div>
                        : ""
                }
            </div>
            <div className="w-full">
                <div className="flex flex-col gap-[10px]">
                    <div className="mb-[20px] text-[18px] opacity-70">The minimum order and tick size outlined below serve as general guidelines for creating a market. However, you should tailor these parameters to suit your token based on its total supply, the liquidity available in the pool, and the target price.</div>
                </div>
            </div>
            <div className="w-full">
                <div className="flex flex-col mb-[10px]">
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">Token Supply</div>
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px] flex flex-row gap-[5px]">
                            Min Order Size
                        </div>
                        <div className="w-full border-b-[1px] p-[4px] flex flex-row gap-[5px]">
                            Tick Size
                        </div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">100k</div>
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">0.01</div>
                        <div className="w-full border-b-[1px] p-[4px]">0.0001</div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full">
                    <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">1M</div>
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">0.1</div>
                        <div className="w-full border-b-[1px] p-[4px]">0.00001</div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">10M</div>
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">1</div>
                        <div className="w-full border-b-[1px] p-[4px]">0.000001</div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">100M</div>
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">10</div>
                        <div className="w-full border-b-[1px] p-[4px]"><p>0.0000001</p></div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">1B</div>
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">100</div>
                        <div className="w-full border-b-[1px] p-[4px]"><p>0.00000001</p></div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">10B</div>
                        <div className="w-full border-b-[1px] border-r-[1px] p-[4px]">1,000</div>
                        <div className="w-full border-b-[1px] p-[4px]"><p>0.000000001</p></div>
                    </div>
                    <div className="flex flex-row items-center justify-between w-full">
                        <div className="w-full border-r-[1px] p-[4px]">100B</div>
                        <div className="w-full border-r-[1px] p-[4px]">10,000</div>
                        <div className="w-full p-[4px]"><p>0.0000000001</p></div>
                    </div>
                </div>
            </div>
            <div className="w-full">
                <div className="flex flex-col mb-[10px]">
                    {/* <div className="text-[32px] sm:text-[40px] font-bold mb-6">Min. Order Size: and Tick Size:</div> */}
                    <div className="mb-[10px] text-[18px]">Min. Order Size: <span className="opacity-70">For a minimum order size of 0.01, you should enter 2 under the market ID Min. Order size settings. This indicates that each lot in your trades within the open book market represents 0.01 units of token.</span></div>
                    <div className="mb-[10px] text-[18px] opacity-70">For a minimum order size of 0.1, enter 1 under the market ID Min. Order size settings.</div>
                    <div className="mb-[10px] text-[18px] opacity-70">For a minimum order size of 1, enter 0 under the market ID Min. Order size settings</div>
                    <div className="mb-[10px] text-[18px] opacity-70">For a minimum order size of 10, enter -1 under the market ID Min. Order size settings.</div>
                    <div className="mb-[40px] text-[18px] opacity-70">For a minimum order size of 100, enter -2 under the market ID Min. Order size settings, and so on.</div>
    
                    <div className="mb-[10px] text-[18px]">Tick Size: <span className="opacity-70">The tick size, which is the smallest possible price change in the market, should be set according to the market's requirements. For a tick size of 0.0001, enter 4 under the market ID tick size settings. This setup ensures that price changes are measured in increments of 0.0001.</span></div>
                    <div className="mb-[10px] text-[18px] opacity-70">For a tick size of 0.00001, enter 5 under the market ID tick size settings.</div>
                    <div className="mb-[10px] text-[18px] opacity-70">For a tick size of 0.000001, enter 6 under the market ID tick size settings.</div>
                    <div className="mb-[10px] text-[18px] opacity-70">For a tick size of 0.0000001, enter 7 under the market ID tick size settings.</div>
                </div>
            </div>
        </div>
    );
};

export default CreateMarketComponent;