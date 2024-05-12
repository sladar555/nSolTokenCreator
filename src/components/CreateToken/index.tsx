import React, { useState, useRef } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { createTokenHandler, uploadFile } from "../../utils/libToken";
import { getAccountLink, getShortHash, getShortLink } from "../../utils/general";

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

    const [mintAddr, setMintAddr] = useState("");
    const [mintTx, setMintTx] = useState("");

    const [isCreating, setIsCreating] = useState(false);

    const copyClipboard = async (addr: string) => {
        try {
            await navigator.clipboard.writeText(addr);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    const toggleSocial = () => {
        setSocialAdded(!socialAdded);
    };

    const imageUploadRef = useRef();
    const uploadBGRef = useRef();

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
        }

        setImage(file);

        const reader = new FileReader();
        reader.onload = async (event) => {
            // @ts-ignore
            uploadBGRef.current.style.backgroundImage = `url(${event.target.result})`;

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
    };

    return (
        <div className="container mt-[85px]">
            <div className="py-[20px] lg:!py-[85px]">
                <div className="container flex flex-col gap-[85px]">
                    <div className="w-full">
                        <h1 className="text-[32px] sm:text-[40px] font-bold mb-6">Solana Token Creator</h1>
                        <div className="mb-[30px] text-[20px] opacity-70">Put the name of your token and write a description of the token</div>
                        <div className="relative w-full gradient rounded-[20px] mb-6"> 
                            <div className="absolute w-full h-full flex rounded-[20px] bg-transparent p-4">
                                <div className="w-1/2 shadow1 rounded-[20px] bg-transparent"></div>
                                <div className="w-1/2 shadow2 rounded-[20px] bg-transparent"></div>
                            </div>   
                            <div className="row relative z-10 bg-[#18225D] p-[20px] sm:p-[30px] rounded-[20px] flex flex-col gap-[20px]">
                            {/* Add Token Data */}
                                <div className="w-full flex flex-col sm:flex-row gap-[20px] justify-between">
                                    <div className="flex flex-col gap-[5px] w-full">
                                        <div className="opacity-70">Name</div>
                                        <input type="text" placeholder="Put the name of your Token" className="bg-[#0D0A28] rounded-[10px] py-[15px] px-[20px]" onChange={(e: any) => setName(e.target.value)} />
                                    </div>
                                    <div className="flex flex-col gap-[5px] w-full">
                                        <div className="opacity-70">Symbol</div>
                                        <input type="text" placeholder="Put the symbol of your Token" className="bg-[#0D0A28] rounded-[10px] py-[15px] px-[20px]" onChange={(e: any) => setSymbol(e.target.value)} />
                                    </div>
                                </div>
                                <div className="w-full flex flex-col sm:flex-row gap-[20px] justify-between">
                                    <div className="w-full flex flex-col gap-[20px] justify-between">
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="opacity-70">Decimals</div>
                                            <input type="number" defaultValue={decimal} className="bg-[#0D0A28] rounded-[10px] py-[15px] px-[20px]" onChange={(e: any) => setDecimal(e.target.value)} />
                                        </div>
                                        <div className="flex flex-col gap-[5px] w-full">
                                            <div className="opacity-70">Supply</div>
                                            <input type="number" defaultValue={supply} className="bg-[#0D0A28] rounded-[10px] py-[15px] px-[20px]" onChange={(e: any) => setSupply(e.target.value)} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-[5px] w-full">
                                        <div className="opacity-70">Image</div>
                                        <div className="cursor-pointer bg-[#0D0A28] rounded-[10px] py-[10px] px-[20px] h-full flex flex-col items-center justify-center" onClick={uploadImage}>
                                            <div ref={uploadBGRef} className="w-[100px] h-[100px] flex items-center justify-center no-repeat bg-cover">
                                                {
                                                    image? 
                                                        "":
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="40px" height="40px" viewBox="0 0 24 24"><path fill="currentColor" d="M12.554 2.494a.75.75 0 0 0-1.107 0l-4 4.375A.75.75 0 0 0 8.553 7.88l2.696-2.95V16a.75.75 0 0 0 1.5 0V4.932l2.697 2.95a.75.75 0 1 0 1.107-1.013z"/><path fill="currentColor" d="M3.75 15a.75.75 0 0 0-1.5 0v.055c0 1.367 0 2.47.117 3.337c.12.9.38 1.658.981 2.26c.602.602 1.36.86 2.26.982c.867.116 1.97.116 3.337.116h6.11c1.367 0 2.47 0 3.337-.116c.9-.122 1.658-.38 2.26-.982c.602-.602.86-1.36.982-2.26c.116-.867.116-1.97.116-3.337V15a.75.75 0 0 0-1.5 0c0 1.435-.002 2.436-.103 3.192c-.099.734-.28 1.122-.556 1.399c-.277.277-.665.457-1.4.556c-.755.101-1.756.103-3.191.103H9c-1.435 0-2.437-.002-3.192-.103c-.734-.099-1.122-.28-1.399-.556c-.277-.277-.457-.665-.556-1.4c-.101-.755-.103-1.756-.103-3.191"/></svg>
                                                }
                                            </div>
                                            <input ref={imageUploadRef} type="file" className="hidden" onChange={uploadedImage} />
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-[5px] justify-between">
                                    <div className="opacity-70">Description</div>
                                    <textarea placeholder="Put the description of your Token" className="w-full bg-[#0D0A28] rounded-[10px] py-[15px] px-[20px]" onChange={(e: any) => setDescription(e.target.value)} />
                                </div>

                                {/* Add Social Links */}
                                <div className="w-full mb-[20px]">
                                    {/* <div className="flex flex-row gap-[10px] items-start">
                                        <div className="font-bold">Add Social Links</div>
                                        <label className="inline-flex h-full items-center cursor-pointer" onChange={toggleSocial}>
                                            <input type="checkbox" value="" className="sr-only peer" />
                                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                    {
                                        socialAdded?  */}
                                            <div className="w-full flex flex-col gap-[20px]">
                                                <div className="w-full flex flex-col sm:flex-row gap-[20px] justify-between">
                                                    <div className="flex flex-col gap-[5px] w-full">
                                                        <div className="opacity-70">Website</div>
                                                        <input type="text" placeholder="www." className="bg-[#0D0A28] rounded-[10px] py-[15px] px-[20px]" onChange={(e: any) => setWebsite(e.target.value)} />
                                                    </div>
                                                    <div className="flex flex-col gap-[5px] w-full">
                                                        <div className="opacity-70">Twitter</div>
                                                        <input type="text" placeholder="twitter.com/" className="bg-[#0D0A28] rounded-[10px] py-[15px] px-[20px]" onChange={(e: any) => setTwitter(e.target.value)} />
                                                    </div>
                                                </div>

                                                <div className="w-full flex flex-col sm:flex-row gap-[20px] justify-between">
                                                    <div className="flex flex-col gap-[5px] w-full">
                                                        <div className="opacity-70">Telegram</div>
                                                        <input type="text" placeholder="t.me/" className="bg-[#0D0A28] rounded-[10px] py-[15px] px-[20px]" onChange={(e: any) => setTelegram(e.target.value)} />
                                                    </div>
                                                    <div className="flex flex-col gap-[5px] w-full">
                                                        <div className="opacity-70">Discord</div>
                                                        <input type="text" placeholder="discord.gg/" className="bg-[#0D0A28] rounded-[10px] py-[15px] px-[20px]" onChange={(e: any) => setDiscord(e.target.value)} />
                                                    </div>
                                                </div>
                                            </div>
                                        {/* : ""
                                    } */}
                                </div>

                                <div className="w-full flex justify-center">
                                    <button onClick={createToken} className="min-w-[250px] rounded-[15px] px-[20px] py-[10px] border-[1px] text-[#3bd0d8] border-[#58f3cd] bg-gradient-to-r from-[rgba(59,208,216,.2)] to-[rgb(59,208,216,0)]">
                                        {
                                            isCreating? "Token Creating...": "Create Token (0.5 SOL)"
                                        }
                                    </button>
                                </div>
                            </div>
                        </div>

                        {
                            mintAddr != ""? 
                                <div className="w-full flex flex-col items-center justify-center gap-[25px]">
                                    <div className="cursor-pointer flex flex-row justify-center items-center h-[30px] gap-[20px]">
                                        <a href={getAccountLink(mintAddr)} target="_blank"><u>{getShortHash(mintAddr)}</u></a>
                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => copyClipboard(mintAddr)} width="20px" height="20px" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>
                                    </div>
                                    <div className="cursor-pointer flex flex-row justify-center items-center h-[30px] gap-[20px]">
                                        <a href={mintTx} target="_blank"><u>{getShortLink(mintTx)}</u></a>
                                        <svg xmlns="http://www.w3.org/2000/svg" onClick={() => copyClipboard(mintTx)} width="20px" height="20px" viewBox="0 0 16 16"><path fill="currentColor" fillRule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"/></svg>
                                    </div>
                                </div>
                                : ""
                        }
                    </div>

                    {/* Instructions */}         
                    {/* <div className="w-full">
                        <div className="flex flex-col gap-[10px]">
                            <div className="text-[32px] sm:text-[40px] font-bold mb-6">How to use Solana Token Creator</div>
                            <div className="mb-[10px] text-[18px] opacity-70">1. Connect your Solana wallet.</div>
                            <div className="mb-[10px] text-[18px] opacity-70">2. Enter the name you want for your token.</div>
                            <div className="mb-[10px] text-[18px] opacity-70">3. Choose a symbol for your token (up to 8 characters).</div>
                            <div className="mb-[10px] text-[18px] opacity-70">4. Select the number of decimal places (0 for Whitelist Token, 6 for Utility Token).</div>
                            <div className="mb-[10px] text-[18px] opacity-70">5. Provide a description for your SPL Token.</div>
                            <div className="mb-[10px] text-[18px] opacity-70">6. Upload a PNG image for your token.</div>
                            <div className="mb-[10px] text-[18px] opacity-70">7. Specify the total supply of your token.</div>
                            <div className="mb-[10px] text-[18px] opacity-70">8. Click "Create," approve the transaction, and wait for your token to be prepared.</div>

                            <div className="mb-[10px] text-[18px] opacity-70">Solana Token Creator is a streamlined platform designed for the efficient creation of SPL tokens.</div>
                            <div className="mb-[10px] text-[18px] opacity-70">Ideal for developers, businesses, and individuals interested in leveraging the Solana blockchain's capabilities, it offers an easy-to-use interface that simplifies the token creation process.</div>
                            <div className="mb-[10px] text-[18px] opacity-70">Connect your Solana wallet, choose your token’s name, symbol, decimals, and total supply, and personalize it with a custom PNG image.</div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    )
};

export default CreateTokenComponent;