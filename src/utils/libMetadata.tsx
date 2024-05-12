import { PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Metaplex } from "@metaplex-foundation/js";

async function getTokens(wallet, connection) {
    const metaplex = Metaplex.make(connection);

    const filters = [
      {        dataSize: 165, 
      },
      {
        memcmp: {
          offset: 32,  
          bytes: wallet,
        },            
      },
    ];

    const accounts = await connection.getParsedProgramAccounts(
      TOKEN_PROGRAM_ID,
      { filters: filters }
    );


    let tokens = [];
    for (let i = 0; i < accounts.length; i++) {
        //Parse the account data
        const parsedAccountInfo = accounts[i].account.data;

        const mintAddress = parsedAccountInfo["parsed"]["info"]["mint"];
        const tokenBalance = parsedAccountInfo["parsed"]["info"]["tokenAmount"]["uiAmount"];

        if (parsedAccountInfo["parsed"]["info"]["tokenAmount"]["decimals"] == 0) {
          continue;
        }

        const mintAccountInfo = await connection.getParsedAccountInfo(new PublicKey(mintAddress));

        if (mintAccountInfo.value.data.parsed.info.freezeAuthority === wallet || mintAccountInfo.value.data.parsed.info.mintAuthority === wallet) {

          try {
            const token = await metaplex.nfts().findByMint({ mintAddress: new PublicKey(mintAddress) });

            const tokenName = token?.name;
            const tokenSymbol = token?.symbol;
            const tokenLogo = token.json?.image;
            const address = token.address.toBase58();
            const mintAuthority = token.mint.mintAuthorityAddress.toBase58();
            const freezeAuthority = token.mint.freezeAuthorityAddress.toBase58();
            const updateAuthority = token.updateAuthorityAddress.toBase58();
            const decimals = token.mint.decimals;
            const supply = token.mint.supply.basisPoints.toString();
            const metadataAddress = token?.metadataAddress.toBase58();

            tokens.push({
              address,
              name: tokenName,
              symbol: tokenSymbol,
              decimals,
              supply,
              metadataAddress,
              image: tokenLogo,
              updateAuthority,
              mintAuthority,
              freezeAuthority
            });
          } catch (error) {
            tokens.push({
              address: mintAddress,
              decimals: mintAccountInfo.value.data.parsed.info.decimals,
              supply: mintAccountInfo.value.data.parsed.info.supply
            });
          }
        }
    }

    return tokens;
}

export default getTokens;