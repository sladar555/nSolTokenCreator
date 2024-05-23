import { DexInstructions, Market } from "@project-serum/serum";
import { PublicKey, Transaction, Keypair, SystemProgram, sendAndConfirmTransaction } from "@solana/web3.js";
import { getVaultOwnerAndNonce } from "./serum";
import { ACCOUNT_SIZE, createInitializeAccountInstruction, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import useSerumMarketAccountSizes from "./useSerumMarketAccountSizes";
import BN from "bn.js";
import { signTransactions, sendSignedTransaction } from "./transaction";

const CreateMarket = async (wallet: any, connection: any, baseMint: string, lotSize: number, tickSize: number, baseMintDecimals: number) => {
    const programID = new PublicKey(import.meta.env.VITE_OPENBOOK_PROGRAMID);

    const eventQueueLength = import.meta.env.VITE_EVENTQUEUE_LENGTH;
    const requestQueueLength = import.meta.env.VITE_REQUESTQUEUE_LENGTH;
    const orderbookLength = import.meta.env.VITE_ORDERBOOK_LENGTH;

    console.log(wallet);

    const {
        totalEventQueueSize,
        totalOrderbookSize,
        totalRequestQueueSize,
    } = useSerumMarketAccountSizes({
        eventQueueLength,
        requestQueueLength,
        orderbookLength,
    });

    let baseMintAddr = new PublicKey(baseMint);

    console.log("baseMint", baseMint);

    let quoteMint = import.meta.env.VITE_QUOTE_MINT;
    let quoteMintAddr = new PublicKey(quoteMint);
    let quoteMintDecimals = import.meta.env.VITE_QUOTE_DECIMAL;

    console.log("quoteMint", quoteMint);

    const vaultInstructions = [];
    const vaultSigners = [];

    const marketInstructions = [];
    const marketSigners = [];

    const marketAccounts = {
      market: Keypair.generate(),
      requestQueue: Keypair.generate(),
      eventQueue: Keypair.generate(),
      bids: Keypair.generate(),
      asks: Keypair.generate(),
      baseVault: Keypair.generate(),
      quoteVault: Keypair.generate(),
    };

    const [vaultOwner, vaultOwnerNonce] = await getVaultOwnerAndNonce(
      marketAccounts.market.publicKey,
      programID
    );

    // create vaults
    vaultInstructions.push(
      ...[
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: marketAccounts.baseVault.publicKey,
          lamports: await connection.getMinimumBalanceForRentExemption(
            ACCOUNT_SIZE
          ),
          space: ACCOUNT_SIZE,
          programId: TOKEN_PROGRAM_ID,
        }),
        SystemProgram.createAccount({
          fromPubkey: wallet.publicKey,
          newAccountPubkey: marketAccounts.quoteVault.publicKey,
          lamports: await connection.getMinimumBalanceForRentExemption(
            ACCOUNT_SIZE
          ),
          space: ACCOUNT_SIZE,
          programId: TOKEN_PROGRAM_ID,
        }),
        createInitializeAccountInstruction(
          marketAccounts.baseVault.publicKey,
          baseMintAddr,
          // @ts-ignore
          vaultOwner
        ),
        createInitializeAccountInstruction(
          marketAccounts.quoteVault.publicKey,
          quoteMintAddr,
          // @ts-ignore
          vaultOwner
        ),
      ]
    );

    vaultSigners.push(marketAccounts.baseVault, marketAccounts.quoteVault);

    // tickSize and lotSize here are the 1e^(-x) values, so no check for ><= 0
    const baseLotSize = Math.round(
      10 ** baseMintDecimals * Math.pow(10, -1 * lotSize)
    );
    const quoteLotSize = Math.round(
      10 ** quoteMintDecimals *
        Math.pow(10, -1 * lotSize) *
        Math.pow(10, -1 * tickSize)
    );

    // pay platform fee
    marketInstructions.push(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(import.meta.env.VITE_PLATFORM_WALLET),
        lamports: Number(import.meta.env.VITE_PLATFORM_FEE_MARKET)
      }),
    );

    // create market account
    marketInstructions.push(
      SystemProgram.createAccount({
        newAccountPubkey: marketAccounts.market.publicKey,
        fromPubkey: wallet.publicKey,
        space: Market.getLayout(programID).span,
        lamports: await connection.getMinimumBalanceForRentExemption(
          Market.getLayout(programID).span
        ),
        programId: programID,
      })
    );

    // create request queue
    marketInstructions.push(
      SystemProgram.createAccount({
        newAccountPubkey: marketAccounts.requestQueue.publicKey,
        fromPubkey: wallet.publicKey,
        space: totalRequestQueueSize,
        lamports: await connection.getMinimumBalanceForRentExemption(
          totalRequestQueueSize
        ),
        programId: programID,
      })
    );

    // create event queue
    marketInstructions.push(
      SystemProgram.createAccount({
        newAccountPubkey: marketAccounts.eventQueue.publicKey,
        fromPubkey: wallet.publicKey,
        space: totalEventQueueSize,
        lamports: await connection.getMinimumBalanceForRentExemption(
          totalEventQueueSize
        ),
        programId: programID,
      })
    );

    const orderBookRentExempt =
      await connection.getMinimumBalanceForRentExemption(totalOrderbookSize);

    // create bids
    marketInstructions.push(
      SystemProgram.createAccount({
        newAccountPubkey: marketAccounts.bids.publicKey,
        fromPubkey: wallet.publicKey,
        space: totalOrderbookSize,
        lamports: orderBookRentExempt,
        programId: programID,
      })
    );

    // create asks
    marketInstructions.push(
      SystemProgram.createAccount({
        newAccountPubkey: marketAccounts.asks.publicKey,
        fromPubkey: wallet.publicKey,
        space: totalOrderbookSize,
        lamports: orderBookRentExempt,
        programId: programID,
      })
    );

    marketSigners.push(
      marketAccounts.market,
      marketAccounts.requestQueue,
      marketAccounts.eventQueue,
      marketAccounts.bids,
      marketAccounts.asks
    );

    marketInstructions.push(
      DexInstructions.initializeMarket({
        market: marketAccounts.market.publicKey,
        requestQueue: marketAccounts.requestQueue.publicKey,
        eventQueue: marketAccounts.eventQueue.publicKey,
        bids: marketAccounts.bids.publicKey,
        asks: marketAccounts.asks.publicKey,
        baseVault: marketAccounts.baseVault.publicKey,
        quoteVault: marketAccounts.quoteVault.publicKey,
        baseMint: baseMintAddr,
        quoteMint: quoteMintAddr,
        baseLotSize: new BN(baseLotSize),
        quoteLotSize: new BN(quoteLotSize),
        feeRateBps:  150, // Unused in v3
        quoteDustThreshold: new BN(500), // Unused in v3
        vaultSignerNonce: vaultOwnerNonce,
        programId: programID,
      })
    );

    const vaultTransaction = new Transaction().add(...vaultInstructions);
    const marketTransaction = new Transaction().add(...marketInstructions);

    try {
        const transactionWithSigners: any = [{
            transaction: vaultTransaction,
            signers: vaultSigners,
        }, {
            transaction: marketTransaction,
            signers: marketSigners,
        }];
    
        const signedTransactions = await signTransactions({
            transactionsAndSigners: transactionWithSigners,
            wallet,
            connection,
        });
    
        console.log("signedTransactions: ", signedTransactions);
    
        await sendSignedTransaction({
            signedTransaction: signedTransactions[0],
            connection,
            skipPreflight: false,
            successCallback: async (txSig) => {
                console.log("VaultTxId: ", txSig);
            },
            sendingCallback: async () => {
                console.log("Sending Vault Tx...");
            },
        });

        let marketTx = "";

        try {
          await sendSignedTransaction({
            signedTransaction: signedTransactions[1],
            connection,
            skipPreflight: false,
            successCallback: async (txSig) => {
                console.log("MarketTxId: ", txSig);
                marketTx = `https://explorer.solana.com/tx/${txSig}?cluster=devnet`;
            },
            sendingCallback: async () => {
                console.log("Sending Market Tx...");
            },
          });
        } catch (error) {
          console.log(error);
        }

        return {
          marketAddr: marketAccounts.market.publicKey.toBase58(),
          marketTx,
          error: undefined
        };
    } catch (e) {
      console.error("[explorer]: ", e);
      return {
        marketAddr: undefined,
        marketTx: undefined,
        error: e
      }
    }
}; 

export default CreateMarket;