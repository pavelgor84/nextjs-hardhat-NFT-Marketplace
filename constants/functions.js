import { useWeb3Contract } from 'react-moralis'
import nft from "../constants/BasicNft.json"


const { runContractFunction: getTokenOwner } = useWeb3Contract({
    abi: nft.abi,
    contractAddress: nftAddress,
    functionName: "ownerOf",
    params: {
        tokenId: tokenId,
    },

})

export { getTokenOwner }