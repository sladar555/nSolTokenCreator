import { PublicKey, Transaction, SystemProgram } from "@solana/web3.js";
import { AuthorityType, createSetAuthorityInstruction, getMint } from "@solana/spl-token";
import { signTransactions, sendSignedTransaction } from "./transaction";

export async function revokeMintAuthority(wallet: any, connection: any, tokenMint: any) {
  try {
    // Specify the token mint address and the current mint authority
    const mintAddress = new PublicKey(tokenMint);

    let mintAccount = await getMint(connection, mintAddress);

    if (!mintAccount.mintAuthority) {
        return {
            txLink: undefined,
            error: "The mint authority of this token is already revoked."
        }
    }

    // Create a transaction to revoke the mint authority

    let transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: new PublicKey(import.meta.env.VITE_PLATFORM_WALLET),
            lamports: Number(import.meta.env.VITE_PLATFORM_FEE_REVOKE)
        }),
        createSetAuthorityInstruction(
            mintAddress, // mint acocunt || token account
            mintAccount.mintAuthority, // current auth
            AuthorityType.MintTokens, // authority type
            null // new auth (you can pass `null` to close it)
        )
    );

    const transactionWithSigners = [{
        transaction: transaction,
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
  } catch (e) {
      return {
        txLink: undefined,
        error: e
      }
  }
}

export async function revokeFreezeAuthority(wallet: any, connection: any, tokenMint: any) { 
  try {
    // Specify the token mint address and the current mint authority
    const mintAddress = new PublicKey(tokenMint);
  
    let mintAccount = await getMint(connection, mintAddress);
  
    console.log(mintAccount);
  
    if (!mintAccount.freezeAuthority) {
        return {
            txLink: undefined,
            error: "The freeze authority of this token is already revoked."
        }
    }

    // Create a transaction to revoke the freeze authority
  
    let transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(import.meta.env.VITE_PLATFORM_WALLET),
        lamports: Number(import.meta.env.VITE_PLATFORM_FEE_REVOKE)
      }),
      createSetAuthorityInstruction(
        mintAddress, // mint acocunt || token account
        mintAccount.freezeAuthority, // current auth
        AuthorityType.FreezeAccount, // authority type
        null // new auth (you can pass `null` to close it)
      )
    );
  
    const transactionWithSigners = [{
        transaction: transaction,
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
  } catch (e) {
      return {
        txLink: undefined,
        error: e
    }
  }
}