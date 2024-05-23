import { 
  Transaction, 
  SystemProgram, 
  Keypair, 
  Connection, 
} from "@solana/web3.js";
import { 
  MINT_SIZE, 
  TOKEN_PROGRAM_ID, 
  createInitializeMintInstruction, 
  getMinimumBalanceForRentExemptMint, 
  getAssociatedTokenAddress, 
  createAssociatedTokenAccountInstruction, 
  createMintToInstruction} from '@solana/spl-token';
import { 
  createCreateMetadataAccountV3Instruction, 
} from "@metaplex-foundation/mpl-token-metadata";
import { 
  keypairIdentity, 
  Metaplex,
  PublicKey
} from "@metaplex-foundation/js";
import { signTransactions, sendSignedTransaction } from "./transaction";

type TMINT_CONFIG = {
  name: string;
  symbol: string;
  uri: string;
  numDecimals: number;
  numberTokens: number;
};

export const uploadFile = async (data: any, newName: any) => {
    try {
        const formData = new FormData();
        formData.append("file", data);
        const metadata = JSON.stringify({
          name: newName,
        });
        formData.append("pinataMetadata", metadata);
  
        const options = JSON.stringify({
          cidVersion: 0,
        });
        
        formData.append("pinataOptions", options);
  
        const res = await fetch(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_JWT_KEY}`,
            },
            body: formData,
          }
        );
        const resData = await res.json();
        // @ts-ignore
        if (resData.IpfsHash) {
            // @ts-ignore
            return import.meta.env.VITE_PINATA_URI + resData.IpfsHash;
        } else {
            return undefined;
        }
    } catch(error) {
        console.log("Upload Image: ", error);
        return undefined;
    }
}

export const uploadMetadata = async (userWallet, connection, tokenMetadata) => {
    //Upload to Arweave
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(userWallet));
    const { uri } = await metaplex.nfts().uploadMetadata(tokenMetadata);
    console.log(`Arweave URL: `, uri);
    return uri;
}

const createNewMintTransaction = async (userWallet, connection: Connection, payer: Keypair, mintKeypair: Keypair, destinationWallet: PublicKey, mintAuthority: PublicKey, freezeAuthority: PublicKey, MINT_CONFIG: TMINT_CONFIG) => {
    const metaplex = Metaplex.make(connection)
      .use(keypairIdentity(userWallet));
    //Get the minimum lamport balance to create a new account and avoid rent payments
    const requiredBalance = await getMinimumBalanceForRentExemptMint(connection);
    //metadata account associated with mint
    const metadataPDA = await metaplex.nfts().pdas().metadata({ mint: mintKeypair.publicKey });
    //get associated token account of your wallet
    const tokenATA = await getAssociatedTokenAddress(mintKeypair.publicKey, destinationWallet);

    const createNewTokenTransaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: payer.publicKey,
            toPubkey: new PublicKey(import.meta.env.VITE_PLATFORM_WALLET),
            lamports: Number(import.meta.env.VITE_PLATFORM_FEE_TOKEN)
        }),
        SystemProgram.createAccount({
            fromPubkey: payer.publicKey,
            newAccountPubkey: mintKeypair.publicKey,
            space: MINT_SIZE,
            lamports: requiredBalance,
            programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeMintInstruction(
            mintKeypair.publicKey, 
            MINT_CONFIG.numDecimals, 
            mintAuthority, 
            freezeAuthority, 
            TOKEN_PROGRAM_ID
        ),
        createAssociatedTokenAccountInstruction(
            payer.publicKey, //Payer 
            tokenATA, //Associated token account 
            payer.publicKey, //token owner
            mintKeypair.publicKey, //Mint
            TOKEN_PROGRAM_ID
        ),
        createMintToInstruction(
            mintKeypair.publicKey, //Mint
            tokenATA, //Destination Token Account
            mintAuthority, //Authority
            MINT_CONFIG.numberTokens * Math.pow(10, MINT_CONFIG.numDecimals),//number of tokens
            [],
            TOKEN_PROGRAM_ID
        ),
        createCreateMetadataAccountV3Instruction(
            {
                metadata: metadataPDA,
                mint: mintKeypair.publicKey,
                mintAuthority: mintAuthority,
                payer: payer.publicKey,
                updateAuthority: mintAuthority,
            }, {
                createMetadataAccountArgsV3: {
                    data: {
                        name: MINT_CONFIG.name,
                        symbol: MINT_CONFIG.symbol,
                        uri: MINT_CONFIG.uri,
                        sellerFeeBasisPoints: 0,
                        creators: null,
                        collection: null,
                        uses: null
                    },
                    isMutable: true,
                    collectionDetails: null
                }
            }
        )
    );

    return createNewTokenTransaction;
}

export const createTokenHandler = async (userWallet, connection, MintConfig: TMINT_CONFIG) => {
    try {
      console.log(`---STEP 1: Creating Mint Transaction---`);
      let mintKeypair = Keypair.generate();
      console.log(`New Mint Address: `, mintKeypair.publicKey.toString());

      const newMintTransaction = await createNewMintTransaction(
          userWallet,
          connection,
          userWallet,
          mintKeypair,
          userWallet.publicKey,
          userWallet.publicKey,
          userWallet.publicKey,
          MintConfig
      );

      const transactionWithSigners = [{
        transaction: newMintTransaction,
        signers: [mintKeypair],
      }];

      const signedTransactions = await signTransactions({
        transactionsAndSigners: transactionWithSigners,
        wallet: userWallet,
        connection,
      });

      console.log("signedTransactions: ", signedTransactions);

      let txHash = "";

      await sendSignedTransaction({
        signedTransaction: signedTransactions[0],
        connection,
        skipPreflight: false,
        successCallback: async (txSig) => {
          console.log(txSig);
          txHash = txSig;
        },
        sendingCallback: async () => {
          console.log("Sending Tx...");
        },
      });

      return {
        txLink: `https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
        mintAddr: mintKeypair.publicKey.toBase58(),
        error: undefined
      };
    } catch (e) {
      console.log("Error in Create Token: ", e);
      return {
        txLink: undefined,
        mintAddr: undefined,
        error: e
      }
    }
}