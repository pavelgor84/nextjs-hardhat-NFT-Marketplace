import { useWeb3Contract } from 'react-moralis'
import basicNFT from "../constants/BasicNft.json"

const { runContractFunction } = useWeb3Contract()

async function filterTrueOwner(nft) { //filter functin for generating cards with confirmed owner

    let { nftAddress, tokenId } = nft

    const checkOptions = {
        abi: basicNFT.abi,
        contractAddress: nftAddress,
        functionName: "ownerOf",
        params: {
            tokenId: tokenId,
        },
    }
    const result = await runContractFunction({ // a view query to NFT smartcontract address to obtain current owner of the nft token
        params: checkOptions,
        onError: (error) => console.log(error),
    })
    //console.log(`Result of checking: ${result}`)
    return result.toLowerCase() == account.toLowerCase()
}

export { filterTrueOwner }