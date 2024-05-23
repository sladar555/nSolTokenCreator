import { 
    Transaction,
    SystemProgram
} from "@solana/web3.js";
import { 
    getAssociatedTokenAddress, 
    createAssociatedTokenAccountInstruction, 
    getOrCreateAssociatedTokenAccount,
    createTransferInstruction
} from '@solana/spl-token';
import { 
    PublicKey
} from "@metaplex-foundation/js";
import { signTransactions, sendSignedTransaction } from "./transaction";

export const tokenTransfer = async (tokenMintAddress: any, decimals: any, wallet: any, destWallet: any, connection: any, amounts: any) => {
    console.log("tokenTransfer: ", tokenMintAddress, decimals, wallet, destWallet, amounts);

    try {
        const tx = new Transaction();
            
        let sourceAccount = await getOrCreateAssociatedTokenAccount(
            connection, 
            wallet,
            new PublicKey(tokenMintAddress),
            wallet.publicKey
        );

        let destinationAccount = null;
        try {
            destinationAccount = await getOrCreateAssociatedTokenAccount(
                connection, 
                wallet,
                new PublicKey(tokenMintAddress),
                new PublicKey(destWallet)
            );  
            destinationAccount = destinationAccount.address;
        } catch (error) {
            if (error.name == "TokenOwnerOffCurveError") {
                console.log(`"  Error Message: ", ${destWallet} is PDA so you can't send token to this address.`);
                return {
                    txLink: undefined,
                    error: "Error: " + `${destWallet} is PDA so you can't send token to this address.`
                }

            } else if (error.name == "TokenAccountNotFoundError") {
                console.log("This wallet doesn't have ATA. To create new ATA, it will take at least 0.002 SOL. If you set Priority fee, then you should pay more.");
                try {
                    let ata = await getAssociatedTokenAddress(
                        new PublicKey(tokenMintAddress), // mint
                        new PublicKey(destWallet), // owner
                        false // allow owner off curve
                    );
                    destinationAccount = ata;
                    let ins = createAssociatedTokenAccountInstruction(
                        wallet.publicKey,
                        ata,
                        new PublicKey(destWallet),
                        new PublicKey(tokenMintAddress)
                    )
                    tx.add(ins);
                } catch(error) {
                    console.log("   createAssociatedTokenAccountInstruction Error: ", error.name);
                    return {
                        txLink: undefined,
                        error: "Error: " + error.name
                    }
                }
            } else {
                console.log("   Error: ", error.name);
                return {
                    txLink: undefined,
                    error: "Error: " + error.name
                }
            }
        }

        if (destinationAccount == null) {
            console.log("destinationAccount is unknown.");
            return {
                txLink: undefined,
                error: "Error: destinationAccount is unknown."
            }
        }

        console.log(`ATA: ${sourceAccount.address.toBase58()} -> ${destinationAccount.toBase58()}`);

        tx.add(
            SystemProgram.transfer({
                fromPubkey: wallet.publicKey,
                toPubkey: new PublicKey(import.meta.env.VITE_PLATFORM_WALLET),
                lamports: Number(import.meta.env.VITE_PLATFORM_FEE_AIRDROP)
            }),
        );

        tx.add(createTransferInstruction(
            sourceAccount.address,
            destinationAccount,
            wallet.publicKey,
            amounts * Math.pow(10, decimals)
        ))

        const transactionWithSigners = [{
            transaction: tx,
            signers: [],
        }];
    
        const signedTransactions = await signTransactions({
            transactionsAndSigners: transactionWithSigners,
            wallet,
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
            error: undefined
        };
    } catch (e: any) {
        console.log("Error in Airdrop: ", e);
        return {
            txLink: undefined,
            error: e
        }
    }
}