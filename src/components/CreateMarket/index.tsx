import React, { useEffect, useState } from 'react';
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import CreateMarket from "../../utils/libMarket";
import { validateMint } from "../../utils/token";
import { getAccountLink, getShortHash, getShortLink } from "../../utils/general";

const CreateMarketComponent = () => {
    const [isNew, setIsNew] = useState(false);
    const [useAdvanceOption, setUseAdvanceOption] = useState(true);

    const wallet = useWallet();
    const { connection } = useConnection();

    const [baseMint, setBaseMint] = useState("");
    const [quoteMint, setQuoteMint] = useState("So11111111111111111111111111111111111111112");
    const [lotSize, setLotSize] = useState(2);
    const [tickSize, setTickSize] = useState(4);

    const [eventQueueLength, setEventQueueLength] = useState(import.meta.env.VITE_EVENTQUEUE_LENGTH);
    const [requestQueueLength, setRequestQueueLength] = useState(import.meta.env.VITE_REQUESTQUEUE_LENGTH);
    const [orderBookLength, setOrderBookLength] = useState(import.meta.env.VITE_ORDERBOOK_LENGTH);

    const [marketAddr, setMarketAddr] = useState("");
    const [marketTx, setMarketTx] = useState("");

    const [isCreating, setIsCreating] = useState(false);

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
        <div className="w-full min-h-screen flex items-center justify-center px-0">
            <div className="bg-black">
                <div className="max-w-[1000px] px-6 py-10 flex flex-wrap items-center  mx-auto  ">
                    <div className="create-openbook w-full py-2">
                        <h1 className="text-2xl text-slate-200  ">Create Openbook Market ID</h1>
                    </div>
                    <form>
                        <div className="space-y-4">
                            <div className="bg-[#131313] border-[1px] border-slate-700 px-4 py-5 shadow rounded-lg sm:p-6">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-medium leading-6 text-slate-200">Mints</h3>
                                        <p className="mt-1 text-sm text-slate-400">Configure the mints for the tokens you want to create a
                                            market for.</p>
                                    </div>
                                    <div className="mt-5 space-y-4 md:col-span-2 md:mt-0">
                                        <div>
                                            <div id="headlessui-radiogroup-:R336km:" role="radiogroup"
                                                aria-labelledby="headlessui-label-:R3b36km:"><label className="sr-only"
                                                    id="headlessui-label-:R3b36km:" role="none">Create Mint</label>
                                                <div className="flex items-center space-x-2" role="none">
                                                    <div className="flex-1 focus-style rounded-md myoption"
                                                        id="headlessui-radiogroup-option-:Rdb36km:" role="radio" aria-checked="false"
                                                        tabIndex={-1}>
                                                        <button
                                                            onClick={(e: any) => { e.preventDefault(); setIsNew(true);}}
                                                            className={isNew? "p-2 w-full flex-1 border-[1px] rounded-md flex items-center justify-center text-sm bg-[#131313] text-[#91eb67] border-[#91eb67] focus:outline-0 focus:ring-0": "p-2 w-full flex-1 border-[1px] rounded-md flex items-center justify-center text-sm bg-[#131313] text-slate-200 border-zinc-700 focus:outline-0 focus:ring-0"}>
                                                            <p>New</p>
                                                        </button>
                                                    </div>
                                                    <div className="flex-1 focus-style rounded-md myoption"
                                                        id="headlessui-radiogroup-option-:Rlb36km:" role="radio" aria-checked="true"
                                                        tabIndex={0}>
                                                        <button
                                                            onClick={(e: any) => { e.preventDefault(); setIsNew(false);}}
                                                            className={isNew? "p-2 w-full flex-1 border-solid border-[1px] rounded-md flex items-center justify-center text-sm bg-[#131313] myborder text-slate-200 border-zinc-700 focus:outline-0 focus:ring-0": "p-2 w-full flex-1 border-solid border-[1px] rounded-md flex items-center justify-center text-sm bg-[#131313] myborder text-[#91eb67] border-[#91eb67] focus:outline-0 focus:ring-0"}>
                                                            <p>Existing</p>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {
                                            isNew? 
                                              <div>
                                                <div className="space-y-4">
                                                    <div className='py-4 w-full flex items-center justify-center'>
                                                        <p className="text-lg font-medium leading-6 text-slate-200">No tokens created? Proceed with token creation at DeploySOL.</p>
                                                    </div>
                                                    <div className='w-full flex items-center justify-center'>
                                                        <a href="/create" target="_blank" className='mybb bg-[#131313] w-full md:w-auto border-[1px] border-[#91eb67] text-white font-normal py-2 px-2 rounded-xl text-base'>Create SPL Token</a>
                                                    </div>
                                                </div>
                                              </div>
                                            : <div>
                                                <div className="space-y-2">
                                                    <div>
                                                        <label className="block text-xs text-slate-400">Base Mint (Only Token Program)</label>
                                                        <div className="mt-1">
                                                            <input type="text"
                                                                onChange={(e: any) => setBaseMint(e.target.value)}
                                                                className="myinput block w-full rounded-md p-2 bg-[#131313] border-[1px] border-zinc-700 focus-style sm:text-sm"
                                                                name="existingMints.baseMint" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-slate-400">Quote Mint</label>
                                                        <div className="mt-1">
                                                            <input type="text" disabled
                                                                className="myinput block w-full rounded-md p-2 bg-[#131313] border-[1px] border-zinc-700  focus-style sm:text-sm"
                                                                name="existingMints.quoteMint" value={quoteMint} />
                                                        </div>
                                                    </div>
                                                </div>
                                              </div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#131313] border-[1px] border-slate-700 px-4 py-5 shadow rounded-lg sm:p-6">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-medium leading-6 text-slate-200">Tickers</h3>
                                        <p className="mt-1 text-sm text-slate-400">Configure the tick sizes, or lowest representable quantities
                                            of base and quote tokens.</p>
                                    </div>
                                    <div className="mt-5 space-y-4 md:col-span-2 md:mt-0">
                                        <div className="space-y-2">
                                            <div>
                                                <label className="block text-xs text-slate-400">Min. Order Size</label>
                                                <div className="relative mt-1 rounded-md shadow-sm">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                        <span className="text-slate-400 sm:text-sm">1e <sup>-x</sup></span>
                                                    </div>
                                                    <input 
                                                        type="number"
                                                        defaultValue={lotSize}
                                                        onChange={(e: any) => setLotSize(e.target.value)}
                                                        className="myinput block w-full py-2 pl-6 pr-2 rounded-md text-slate-200 border-[1px] border-zinc-700 bg-[#131313] focus-style pl-16 sm:pl-14 sm:text-sm focus:border-[#91eb67] focus:outline-0 focus:ring-0"
                                                        name="lotSize" />
                                                </div>
                                            </div>
                                            <div>
                                                <label data-tooltip-target="tooltip-default" className="block text-xs text-slate-400">
                                                    Price Tick</label>
                                                <div id="tooltip-default" role="tooltip"
                                                    className="inline-block absolute invisible z-10 py-2 px-3 text-sm font-medium text-white bg-gray-900 rounded-lg shadow-sm opacity-0 transition-opacity duration-300 tooltip dark:bg-gray-700">
                                                    Tooltip content 
                                                    <div className="tooltip-arrow" data-popper-arrow="true"></div>
                                                </div>
                                                <div className="relative mt-1 rounded-md shadow-sm">
                                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"><span
                                                            className="text-slate-400 sm:text-sm">1e <sup>-x</sup></span>
                                                    </div>
                                                    <input 
                                                        type="number"
                                                        defaultValue={tickSize}
                                                        onChange={(e: any) => setTickSize(e.target.value)}
                                                        className="myinput block w-full py-2 pl-6 pr-2 rounded-md border-[1px] border-zinc-700 text-slate-200 bg-[#131313] focus-style pl-16 sm:pl-14 sm:text-sm focus:border-[#91eb67] focus:outline-0 focus:ring-0"
                                                        name="tickSize" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-[#131313] border-[1px] border-slate-700 px-4 py-5 shadow rounded-lg sm:p-6">
                                <div className="md:grid md:grid-cols-3 md:gap-6">
                                    <div className="md:col-span-1">
                                        <h3 className="text-lg font-medium leading-6 text-slate-200">Advanced Options</h3>
                                        <p className="mt-1 text-sm text-slate-400">Configure sizes for the different accounts used to create the
                                            market to adjust rent cost.</p>
                                        <div className="mt-6">
                                            <div className="mb-1 flex items-center space-x-1">
                                                <p className="text-xs text-slate-300">Total Rent + Fee Estimate</p>
                                            </div>
                                            <p className="text-lg text-[#91eb67]">0.45 SOL</p>
                                        </div>
                                    </div>
                                    <div className="mt-5 space-y-4 md:col-span-2 md:mt-0">
                                        <div className="space-y-3">
                                            <div><span className="input-label text-xs text-slate-300">Quick Select</span>
                                                <div className="flex flex-wrap gap-2 pb-6 pt-2">
                                                    <button type="button"
                                                        className="selected mybb w-full mb-0 md:w-auto bg-[#91eb67] text-black font-normal py-2 px-4 rounded-full focus:outline-0 focus:ring-0">Only
                                                        Raydium</button>

                                                    <button type="button"
                                                        className="mybb bg-[#131313] w-full md:w-auto border-[1px] border-[#91eb67] text-white font-bold py-2 px-4 rounded-full focus:outline-0 focus:ring-0">Openbook
                                                        + Raydium</button>
                                                </div>
                                                <div className="flex flex-wrap  items-center justify-between">
                                                    <span className="flex mb-3 w-full md:w-2/3 flex-grow flex-col space-y-0.5">
                                                        <span className="input-label text-xs text-slate-300" id="headlessui-label-:Rbj76km:">Use Advanced Options</span>
                                                    <span className="text-sm  text-slate-500" id="headlessui-description-:Rjj76km:">
                                                        Set custom sizes for market accounts. Market ID creation uses leased storage space on the
                                                            Solana network. Most of the fees are rent fees.</span>
                                                </span>
                                                    <label className="cursor-pointer w-full md:w-1/3">
                                                    <input type="checkbox" defaultChecked={useAdvanceOption} className="sr-only peer" onChange={(e: any) => setUseAdvanceOption(e.target.checked)} />
                                                    <div className=" block relative md:ml-auto w-11 h-6 bg-slate-400 peer-focus:outline-none  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border-[1px] after:rounded-full after:h-5 after:w-5 after:transition-all  peer-checked:bg-[#91eb67]"></div>
                                                    </label>
                                            </div>
                                            </div>
                                            <div className={useAdvanceOption? "": "opacity-30"}>
                                                <label className="block text-xs text-slate-400">Event Queue Length</label>
                                                <div className="mt-1">
                                                    <div className="relative flex items-center">
                                                        <input 
                                                            type="number" 
                                                            disabled={!useAdvanceOption}
                                                            defaultValue={eventQueueLength}
                                                            onChange={(e: any) => setEventQueueLength(e.target.value)}
                                                            className="myinput block w-full rounded-md p-2 bg-[#131313] border-[1px] border-slate-700 focus-style sm:text-sm"
                                                            name="eventQueueLength" />
                                                        <p className="absolute right-0 mr-2 text-sm text-slate-400">11308 bytes
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={useAdvanceOption? "": "opacity-30"}>
                                                <label className="block text-xs text-slate-400">Request Queue Length</label>
                                                <div className="mt-1">
                                                    <div className="relative flex items-center">
                                                        <input 
                                                            type="number" 
                                                            disabled={!useAdvanceOption}
                                                            defaultValue={requestQueueLength}
                                                            onChange={(e: any) => setRequestQueueLength(e.target.value)}
                                                            className="myinput block w-full rounded-md p-2 bg-[#131313] border-[1px] border-slate-700  focus-style sm:text-sm"
                                                            name="requestQueueLength" />
                                                        <p className="absolute right-0 mr-2 text-sm text-slate-400">5084 bytes
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={useAdvanceOption? "": "opacity-30"}>
                                                <label className="block text-xs text-slate-400">Orderbook Length</label>
                                                <div className="mt-1">
                                                    <div className="relative flex items-center">
                                                        <input 
                                                            type="number" 
                                                            disabled={!useAdvanceOption}
                                                            defaultValue={orderBookLength}
                                                            onChange={(e: any) => setOrderBookLength(e.target.value)}
                                                            className="myinput block w-full rounded-md p-2 bg-[#131313] border-[1px] border-slate-700  focus-style sm:text-sm"
                                                            name="orderbookLength" />
                                                        <p className="absolute right-0 mr-2 text-sm text-slate-400">14524 bytes
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="create-container flex flex-wrap w-full">
                                <p className=" w-full md:w-1/2 mb-3 text-sm dark:text-white">In case of a market creation fail you are eligible for a refund. Please
                                    let us know in our 
                                    <a href="https://t.me/deploysol_official" target="_blank" className="text-[#91eb67] pl-1"
                                        rel="noopener noreferrer">Telegram Group</a></p>
                                <button
                                    onClick={createMarket}
                                    className="focus:outline-0 focus:ring-0 mybutto w-full md:w-1/2  h-11 ml-auto md:max-w-xs rounded-lg bg-black border-solid border-[1px] border-[#91eb67] transition-colors disabled:opacity-20">Create</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CreateMarketComponent;