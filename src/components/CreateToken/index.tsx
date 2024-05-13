import React, { useState, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createTokenHandler, uploadFile } from "../../utils/libToken";
import { getAccountLink, getShortHash, getShortLink } from "../../utils/general";
import "./index.scss";

const CreateTokenComponent = () => {
    const wallet = useWallet();
    // const { connection } = useConnection();

    // const [socialAdded, setSocialAdded] = useState(false);

    // const [name, setName] = useState("");
    // const [symbol, setSymbol] = useState("");
    // const [decimal, setDecimal] = useState(9);
    // const [supply, setSupply] = useState(100000);

    // const [description, setDescription] = useState("");

    // const [website, setWebsite] = useState("");
    // const [twitter, setTwitter] = useState("");
    // const [telegram, setTelegram] = useState("");
    // const [discord, setDiscord] = useState("");

    // const [image, setImage] = useState();
    // const [imageContent, setImageContent] = useState();

    // const [mintAddr, setMintAddr] = useState("");
    // const [mintTx, setMintTx] = useState("");

    // const [isCreating, setIsCreating] = useState(false);

    // const copyClipboard = async (addr: string) => {
    //     try {
    //         await navigator.clipboard.writeText(addr);
    //     } catch (err) {
    //         console.error('Failed to copy: ', err);
    //     }
    // }

    // const toggleSocial = () => {
    //     setSocialAdded(!socialAdded);
    // };

    // const imageUploadRef = useRef();
    // const uploadBGRef = useRef();

    // const uploadImage = async (e: any) => {
    //     // @ts-ignore
    //     imageUploadRef.current.click();
    // };

    // const uploadedImage = async (e: any) => { 
    //     // @ts-ignore
    //     let file = e.target.files[0];

    //     if (file == undefined) {
    //         // @ts-ignore
    //         uploadBGRef.current.style.backgroundImage = 'none';
    //     }

    //     setImage(file);

    //     const reader = new FileReader();
    //     reader.onload = async (event) => {
    //         // @ts-ignore
    //         uploadBGRef.current.style.backgroundImage = `url(${event.target.result})`;

    //         // @ts-ignore
    //         setImageContent(event.target.result);
    //     }
    //     reader.readAsDataURL(file);
    // };

    // const createToken = async () => {
    //     if (name == "" || symbol == "" || imageContent == undefined || decimal <= 0 || supply <= 0) {
    //         alert("Invalid Parameter!");
    //         return;
    //     }

    //     if (isCreating) return;

    //     setIsCreating(true);
    //     // Upload Image to IPFS and get the downlodable link.
    //     // @ts-ignore
    //     let imageName = new Date().getTime() + '_' + image.name; 
    
    //     const imageURI = await uploadFile(image, imageName);

    //     console.log("imageURI: ", imageURI);

    //     if (!imageURI) {
    //         alert("Image can't be uploaded! Please try again.");
    //         setIsCreating(false);
    //         return;
    //     }

    //     // Create Metadata Jons and upload it.
    //     const metadata = {
    //         name, 
    //         symbol,
    //         description,
    //         image: imageURI,
    //         social_links: {
    //             website,
    //             twitter,
    //             telegram,
    //             discord
    //         }
    //     }

    //     console.log(metadata);

    //     const str = JSON.stringify(metadata, null, 3);
    //     const bytes = new TextEncoder().encode(str);
    //     const blob = new Blob([bytes], {
    //         type: "application/json;charset=utf-8"
    //     });

    //     const metadataName = new Date().getTime() + '_metadata.json';
    //     const metadataURI = await uploadFile(blob, metadataName);
        
    //     console.log("metadataURI: ", metadataURI);

    //     if (!metadataURI) {
    //         alert("Metadata can't be uploaded! Please try again.");
    //         setIsCreating(false);
    //         return;
    //     }

    //     // Create Token
    //     const { txLink, mintAddr, error } = await createTokenHandler(
    //         wallet,
    //         connection,
    //         {
    //             name,
    //             symbol,
    //             uri: metadataURI,
    //             numDecimals: decimal,
    //             numberTokens: supply
    //         }
    //     );

    //     console.log("txLink", txLink);
    //     console.log("mintAddr", mintAddr);
    //     console.log("error", error);

    //     if (!error) {
    //         setMintAddr(mintAddr);
    //         setMintTx(txLink);    
    //     } else {
    //         alert("Error! Please check SOL Balance or Network Connection!");
    //         setMintAddr("");
    //         setMintTx("");
    //     }
    //     setIsCreating(false);
    // };

    return (
        <div className="container mt-[20px]">
            <div className="py-[20px] lg:!py-[20px]">
                <div className="container flex flex-col gap-[20px]">
                    <div className="create__container flex-col lg:flex-row">
                        <div className="create__form-container">
                            <h2 className="create__heading">
                                <img className="create__heading-icon" src="assets/images/feature_create_icon.svg" alt="Feature Create Icon" />
                                <span>Token Information</span>
                            </h2>
                            <h3 className="create__subheading">This information is stored on IPFS + Metaplex Metadata standard.</h3>
                            <form className="create__form" noValidate={false}>
                                <h4 className="create__input-name">Main Information</h4>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_name" id="token_name" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_name" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Name</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_symbol" id="token_symbol" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_symbol" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Symbol(Max10 ex. EXMPL)*</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_desc" id="token_desc" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_desc" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description: (Optional)</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="number" name="token_decimal" id="token_decimal" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" defaultValue={9} placeholder=" " required />
                                    <label htmlFor="token_decimal" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Decimals*</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_supply" id="token_supply" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" defaultValue={1000000000} placeholder=" " required />
                                    <label htmlFor="token_supply" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Supply*</label>
                                </div>
                                <h4 className="create__input-name">Extensions (Optional)</h4>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_telegram" id="token_telegram" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_telegram" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Telegram</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_website" id="token_website" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_website" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Website</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_twitter" id="token_twitter" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_twitter" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Twitter</label>
                                </div>
                                <div className="relative z-0 w-full mb-4 group">
                                    <input type="text" name="token_discord" id="token_discord" className="block py-2.5 px-0 w-full text-sm bg-transparent border-solid border-b-[1px] text-white border-gray-500 focus:border-[#8A52EB] focus:outline-none focus:ring-0 peer" placeholder=" " required />
                                    <label htmlFor="token_discord" className="peer-focus:font-medium absolute text-sm text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#8A52EB] peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Discord</label>
                                </div>
                                <h4 className="create__input-name">Token Logo</h4>
                                
                                <div className="cursor-pointer bg-transparent rounded-[10px] py-[10px] px-[20px] h-full flex flex-col items-center justify-center border-white border-[1px] border-dashed">
                                    <div className="w-[100px] h-[100px] flex flex-col justify-center items-center justify-center no-repeat bg-cover">
                                        <img src="assets/images/preview_icon.svg"/>
                                        <div className="text-[12px] mt-2 text-[#8A52EB]">Upload Image</div>
                                    </div>
                                    <input type="file" className="hidden" />
                                </div>

                                <div className="create__options">
                                    <div className="flex flex-row items-center gap-2">
                                        <input type="checkbox" value="" className="w-4 h-4 bg-gray-700 rounded focus:ring-[#8A52EB] ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 border-gray-600"/>
                                        <label htmlFor="checkbox-3" className="ms-2 text-[14px] font-medium text-white">
                                            <div className="">Mint Revoke</div>
                                            <div className="">(+0.025 SOL)</div>
                                        </label>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <input type="checkbox" value="" className="w-4 h-4 bg-gray-700 rounded focus:ring-[#8A52EB] ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 border-gray-600"/>
                                        <label htmlFor="checkbox-3" className="ms-2 text-[14px] font-medium text-white">
                                            <div className="">Freeze Authority</div>
                                            <div className="">(+0.025 SOL)</div>
                                        </label>
                                    </div>
                                    <div className="flex flex-row items-center gap-2">
                                        <input type="checkbox" value="" className="w-4 h-4 bg-gray-700 rounded focus:ring-[#8A52EB] ring-offset-gray-800 focus:ring-offset-gray-800 focus:ring-2 border-gray-600"/>
                                        <label htmlFor="checkbox-3" className="ms-2 text-[14px] font-medium text-white">
                                            <div className="">Metadata Lock</div>
                                            <div className="">(+0.025 SOL)</div>
                                        </label>
                                    </div>
                                </div>
                                <button type="button" className="create__deploy" disabled={false}>
                                    Create Token <span className="create__price-tag">(0.067 SOL)</span>
                                </button>
                            </form>
                        </div>
                        <div className="create__right">
                            <div className="create__preview">
                                <h2 className="create__heading">
                                    <span>Preview</span>
                                </h2>
                                <div className="create__preview-card">
                                    <img className="create__preview-icon" src="assets/images/preview_icon.svg"/>
                                        <div className="create__preview-texts">
                                            <h5 className="create__preview-name">Token Name</h5>
                                            <h5 className="create__preview-symbol">Symbol</h5>
                                        </div>
                                    </div>
                                    <h4 className="create__input-name">Token Information</h4>
                                    <ul className="create__preview-list">
                                        <li className="create__preview-item">
                                            <p>Name</p>
                                            <p></p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p>Symbol</p>
                                            <p></p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p>Description</p>
                                            <p></p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p>Token decimals</p>
                                            <p>9</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p>Supply</p>
                                            <p>100000000</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p>Mint Authority</p>
                                            <p></p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p>Update Authority</p>
                                            <p></p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p>Mint Authority</p>
                                            <p>(No Revoke)</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p>Freeze Authority</p>
                                            <p>(No Revoke)</p>
                                        </li>
                                        <li className="create__preview-item">
                                            <p>Lock Metadata</p>
                                            <p>(No)</p>
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
                                    <div className="MuiFormControl-root MuiFormControl-fullWidth">
                                 
                                    </div>
                                    <div className="revokes__buttons">
                                        <button type="button" className="revokes__button" disabled={false}>
                                            Revoke Freeze 
                                            <span className="revokes__price-tag">(0.025 SOL)</span>
                                        </button>
                                        <button type="button" className="revokes__button" disabled={false}>
                                            Revoke Mint 
                                            <span className="revokes__price-tag">(0.025 SOL)</span>
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