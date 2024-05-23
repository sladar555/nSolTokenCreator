import React, { useState, useRef, useEffect } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createTokenHandler, uploadFile } from "../../utils/libToken";
import { getAccountLink, getShortHash, getShortLink } from "../../utils/general";
import { token } from "@metaplex-foundation/js";
import getTokens from "../../utils/libMetadata";
import { revokeMintAuthority, revokeFreezeAuthority } from "../../utils/libRevoke";
import "./index.scss";

const CreateTokenComponent = () => {
    const wallet = useWallet();

    const { connection } = useConnection();

    const [socialAdded, setSocialAdded] = useState(false);

    const [name, setName] = useState("");
    const [symbol, setSymbol] = useState("");
    const [decimal, setDecimal] = useState(9);
    const [supply, setSupply] = useState(100000);

    const [description, setDescription] = useState("");

    const [website, setWebsite] = useState("");
    const [twitter, setTwitter] = useState("");
    const [telegram, setTelegram] = useState("");
    const [discord, setDiscord] = useState("");

    const [image, setImage] = useState();
    const [imageContent, setImageContent] = useState();

    const [mintAuthority, setMintAuthority] = useState("");
    const [updateAuthority, setUpdateAuthority] = useState("");
    const [freezeAuthority, setFreezeAuthority] = useState("");

    const [allowRevokeMint, setAllowRevokeMint] = useState(false);
    const [allowRevokeFreeze, setAllowRevokeFreeze] = useState(false);
    const [allowLockMetadata, setAllowLockMetadata] = useState(false);

    const [mintAddr, setMintAddr] = useState("");
    const [mintTx, setMintTx] = useState("");

    const [tokens, setTokens] = useState([]);
    const [currentToken, setCurrentToken] = useState("");

    const [revokeTx, setRevokeTx] = useState("");

    const [isMintRevoking, setIsMintRevoking] = useState(false);
    const [isFreezeRevoking, setIsFreezeRevoking] = useState(false);

    const [isCreating, setIsCreating] = useState(false);

    const imageUploadRef = useRef();
    const previewIconRef = useRef();
    const uploadBGRef = useRef();

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
        setCurrentToken(tokens[e.target.selectedIndex].address);
    };

    const revokeFreeze = async (e: any) => {
        console.log("revokeFreeze start!", currentToken);

        if (isFreezeRevoking || isMintRevoking || currentToken == "") return;

        setIsFreezeRevoking(true);

        const { txLink, error } = await revokeFreezeAuthority(wallet, connection, currentToken);

        console.log(txLink, error);

        if (!error) {
            alert(txLink);
            setRevokeTx(txLink);    
        } else {
            alert(error);
            setRevokeTx("");
        }

        setIsFreezeRevoking(false);
    };

    const revokeMint = async (e: any) => {
        console.log("revokeMint start!", currentToken);

        if (isFreezeRevoking || isMintRevoking || currentToken == "") return;

        setIsMintRevoking(true);

        const { txLink, error } = await revokeMintAuthority(wallet, connection, currentToken);

        console.log(txLink, error);

        if (!error) {
            alert(txLink);
            setRevokeTx(txLink);    
        } else {
            alert(error);
            setRevokeTx("");
        }

        setIsMintRevoking(false);
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

    useEffect((() => {
        if (wallet.connected) {
            setMintAuthority(wallet.publicKey.toBase58());
            setUpdateAuthority(wallet.publicKey.toBase58());
            setFreezeAuthority(wallet.publicKey.toBase58());
        }
     }), [wallet]);
 
    useEffect(() => {
        if (tokens.length > 0) {
            copyClipboard(tokens[0].address);
            setCurrentToken(tokens[0].address);
        }
    }, [tokens]);

    const uploadImage = async (e: any) => {
        // @ts-ignore
        imageUploadRef.current.click();
    };

    const uploadedImage = async (e: any) => { 
        // @ts-ignore
        let file = e.target.files[0];

        if (file == undefined) {
            // @ts-ignore
            uploadBGRef.current.style.backgroundImage = 'none';
            // @ts-ignore
            previewIconRef.current.src = 'assets/images/preview_icon.svg';
        }

        setImage(file);

        const reader = new FileReader();
        reader.onload = async (event) => {
            // @ts-ignore
            uploadBGRef.current.style.backgroundImage = `url(${event.target.result})`;
            // @ts-ignore
            previewIconRef.current.src = `${event.target.result}`;
            // @ts-ignore
            setImageContent(event.target.result);
        }
        reader.readAsDataURL(file);
    };

    const createToken = async () => {
        if (name == "" || symbol == "" || imageContent == undefined || decimal <= 0 || supply <= 0) {
            alert("Invalid Parameter!");
            return;
        }

        if (isCreating) return;

        setIsCreating(true);
        // Upload Image to IPFS and get the downlodable link.
        // @ts-ignore
        let imageName = new Date().getTime() + '_' + image.name; 
    
        const imageURI = await uploadFile(image, imageName);

        console.log("imageURI: ", imageURI);

        if (!imageURI) {
            alert("Image can't be uploaded! Please try again.");
            setIsCreating(false);
            return;
        }

        // Create Metadata Jons and upload it.
        const metadata = {
            name, 
            symbol,
            description,
            image: imageURI,
            social_links: {
                website,
                twitter,
                telegram,
                discord
            }
        }

        console.log(metadata);

        const str = JSON.stringify(metadata, null, 3);
        const bytes = new TextEncoder().encode(str);
        const blob = new Blob([bytes], {
            type: "application/json;charset=utf-8"
        });

        const metadataName = new Date().getTime() + '_metadata.json';
        const metadataURI = await uploadFile(blob, metadataName);
        
        console.log("metadataURI: ", metadataURI);

        if (!metadataURI) {
            alert("Metadata can't be uploaded! Please try again.");
            setIsCreating(false);
            return;
        }

        // Create Token
        const { txLink, mintAddr, error } = await createTokenHandler(
            wallet,
            connection,
            {
                name,
                symbol,
                uri: metadataURI,
                numDecimals: decimal,
                numberTokens: supply
            }
        );

        console.log("txLink", txLink);
        console.log("mintAddr", mintAddr);
        console.log("error", error);

        if (!error) {
            setMintAddr(mintAddr);
            setMintTx(txLink);    
        } else {
            alert("Error! Please check SOL Balance or Network Connection!");
            setMintAddr("");
            setMintTx("");
        }
        setIsCreating(false);
        alert(txLink);
    };

    return (
        <div className="container mt-[20px]">
            <div className="py-[20px] lg:!py-[20px]">
                <div className="container flex flex-col gap-[20px] px-[2px] lg:px-[10px]">
                    <div className="create__container flex-col lg:flex-row px-[2px] sm:px-2 lg:px-4">
                        <div className="create__form-container w-full lg:w-1/2 px-[2px] sm:px-[8px]">
                            <h2 className="create__heading">
                                <img className="create__heading-icon" src="assets/images/feature_create_icon.svg" alt="Feature Create Icon" />
                                <span>Token Information</span>
                            </h2>
                            <h3 className="create__subheading">This information is stored on IPFS + Metaplex Metadata standard.</h3>
                            <form className="create__form" noValidate={false}>
                                <h4 className="create__input-name">Main Information</h4>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_name" id="token_name" onChange={(e: any) => setName(e.target.value)} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_name" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_symbol" id="token_symbol" onChange={(e: any) => setSymbol(e.target.value)} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_symbol" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Symbol(Max10 ex. EXMPL)*</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_desc" id="token_desc" onChange={(e: any) => setDescription(e.target.value)} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_desc" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description: (Optional)</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="number" name="token_decimal" id="token_decimal" onChange={(e: any) => setDecimal(e.target.value)} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" defaultValue={9} placeholder=" " required />
                                    <label htmlFor="token_decimal" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Decimals*</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_supply" id="token_supply" onChange={(e: any) => setSupply(e.target.value)} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" defaultValue={1000000000} placeholder=" " required />
                                    <label htmlFor="token_supply" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Supply*</label>
                                </div>
                                <h4 className="create__input-name">Extensions (Optional)</h4>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_telegram" id="token_telegram" onChange={(e: any) => setTelegram(e.target.value)} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_telegram" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Telegram</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_website" id="token_website" onChange={(e: any) => setWebsite(e.target.value)} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_website" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Website</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_twitter" id="token_twitter" onChange={(e: any) => setTwitter(e.target.value)} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_twitter" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Twitter</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_discord" id="token_discord" onChange={(e: any) => setDiscord(e.target.value)} className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_discord" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Discord</label>
                                </div>
                                <h4 className="create__input-name">Token Logo</h4>
                                
                                <div onClick={uploadImage} className="cursor-pointer bg-transparent rounded-[10px] py-[10px] px-[20px] h-full flex flex-col items-center justify-center border-white border-[1px] border-dashed">
                                    <div ref={uploadBGRef} className="w-[100px] h-[100px] flex flex-col justify-center items-center justify-center no-repeat bg-cover">
                                        {
                                            image? 
                                                "":
                                                <>
                                                    <img src="assets/images/preview_icon.svg"/>
                                                    <div className="text-[12px] mt-2 text-[#8A52EB]">Upload Image</div>
                                                </>
                                        }
                                    </div>
                                    <input ref={imageUploadRef} type="file" className="hidden" onChange={uploadedImage} />
                                </div>

                                <div className="create__options flex flex-col sm:flex-row">
                                    <div className="flex flex-row items-center gap-2">
                                        <input type="checkbox" defaultChecked={allowRevokeMint} onChange={(e: any) => setAllowRevokeMint(e.target.checked)} className="w-4 h-4 bg-gray-700 rounded focus:ring-[#8A52EB] ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 border-gray-600"/>
                                        <label htmlFor="checkbox-3" className="ms-2 text-[14px] font-medium text-white">
                                            <div className="">Mint Revoke</div>
                                            <div className="">(+0.1 SOL)</div>
                                        </label>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <input type="checkbox" defaultChecked={allowRevokeFreeze} onChange={(e: any) => setAllowRevokeFreeze(e.target.checked)} className="w-4 h-4 bg-gray-700 rounded focus:ring-[#8A52EB] ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 border-gray-600"/>
                                        <label htmlFor="checkbox-3" className="ms-2 text-[14px] font-medium text-white">
                                            <div className="">Freeze Authority</div>
                                            <div className="">(+0.1 SOL)</div>
                                        </label>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <input type="checkbox" defaultChecked={allowLockMetadata} onChange={(e: any) => setAllowLockMetadata(e.target.checked)} className="w-4 h-4 bg-gray-700 rounded focus:ring-[#8A52EB] ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 border-gray-600"/>
                                        <label htmlFor="checkbox-3" className="ms-2 text-[14px] font-medium text-white">
                                            <div className="">Metadata Lock</div>
                                            <div className="">(+0.1 SOL)</div>
                                        </label>
                                    </div>
                                </div>
                                <button onClick={createToken} type="button" className="create__deploy focus:outline-0 focus:ring-0" disabled={false}>
                                    {
                                        isCreating? "Token Creating...": <p>Create Token <span className="create__price-tag">(0.3 SOL)</span></p>
                                    }
                                </button>
                            </form>
                        </div>
                        <div className="create__right w-full lg:w-1/2">
                            <div className="create__preview">
                                <h2 className="create__heading">
                                    <span>Preview</span>
                                </h2>
                                <div className="create__preview-card">
                                    <img ref={previewIconRef} className="create__preview-icon" src="assets/images/preview_icon.svg"/>
                                        <div className="create__preview-texts">
                                            <h5 className="create__preview-name">{name == ""? "Token Name": name}</h5>
                                            <h5 className="create__preview-symbol">{symbol == ""? "Symbol": symbol}</h5>
                                        </div>
                                    </div>
                                    <h4 className="create__input-name">Token Information</h4>
                                    <ul className="create__preview-list">
                                        <li className="create__preview-item">
                                            <p className="item-title w-[]">Name</p>
                                            <p className="item-desc">{name}</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p className="item-title">Symbol</p>
                                            <p className="item-desc">{symbol}</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p className="item-title">Description</p>
                                            <p className="item-desc">{description}</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p className="item-title">Token decimals</p>
                                            <p className="item-desc">{decimal}</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p className="item-title">Supply</p>
                                            <p className="item-desc">{supply}</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p className="item-title">Mint Authority</p>
                                            <p className="item-desc">{mintAuthority}</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p className="item-title">Update Authority</p>
                                            <p className="item-desc">{updateAuthority}</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p className="item-title">Mint Authority</p>
                                            <p className="item-desc">{allowRevokeMint? "(Revoke)": "(No Revoke)"}</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p className="item-title">Freeze Authority</p>
                                            <p className="item-desc">{allowRevokeFreeze? "(Revoke)": "(No Revoke)"}</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p className="item-title">Lock Metadata</p>
                                            <p className="item-desc">{allowLockMetadata? "(Yes)": "(No)"}</p>
                                        </li>
                                    </ul>
                            </div>
                            <div className="revokes">
                                <h2 className="revokes__heading">
                                    <span>Revokes manager</span>
                                </h2>
                                <div>
                                    <h3 className="revokes__subtitle">Use this to apply freeze/mint revoke manually to your token.</h3>
                                    <h4 className="revokes__subheading">Choose a token address from your wallet</h4>
                                    <select className="w-full bg-transparent h-[40px] border-[#FFFFFF] border-b-[1px]"  onChange={chooseToken}>
                                        {
                                            tokens.map((value, index) => 
                                                <option className="bg-[#000000]" key={index} data-address={value.address}>
                                                    {(value.name)? `${value.name}`: ""}&nbsp;({getShortHash(value.address)})
                                                </option>
                                            )
                                        }
                                    </select>
                                    <div className="revokes__buttons">
                                        <button onClick={revokeFreeze} type="button" className="revokes__button focus:outline-0 focus:ring-0" disabled={false}>
                                            { isFreezeRevoking? "Revoking Now...": <>Revoke Freeze<span className="revokes__price-tag">(0.1 SOL)</span></> }
                                        </button>
                                        <button onClick={revokeMint} type="button" className="revokes__button focus:outline-0 focus:ring-0" disabled={false}>
                                            { isMintRevoking? "Revoking Now...": <>Revoke Mint <span className="revokes__price-tag">(0.1 SOL)</span></> }
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default CreateTokenComponent;