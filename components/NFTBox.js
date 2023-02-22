import { useState } from "react";
import Moralis from "moralis";
import { EvmChain } from '@moralisweb3/common-evm-utils';
import nft from "../constants/BasicNft.json"

export default function NFTBox({ price, nftAddress, tokenId, seller, }) {

    const [imageURI, setImageURI] = useState("")
    console.log(`imageURI: ${imageURI}`)

    async function getTokenURI() {
        try {
            const abi = nft.abi

            const functionName = 'tokenURI';

            const address = nftAddress;

            const chain = EvmChain.GOERLI;

            if (!Moralis.Core.isStarted) {
                await Moralis.start({ apiKey: process.env.NEXT_PUBLIC_M_API });
            }

            const response = await Moralis.EvmApi.utils.runContractFunction({
                abi,
                functionName,
                address,
                params: { tokenId: tokenId },
                chain,
            });

            //console.log(response?.result);
            return response?.result;
        } catch (e) {
            console.error(e);
        }

    }

    async function updateUI() {
        const tokenURI = await getTokenURI()
        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            const imageURI = tokenURIResponse.image
            const imageURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            setImageURI(imageURL)
        }
    }
    updateUI() // can use useEffect

    return <div>NFTBox</div>
}



// async function updateUI() {

//     const tokenURI = await getTokenURI()
//     console.log(tokenURI)

// }