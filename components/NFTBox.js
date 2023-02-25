import { useState, useEffect } from "react";
import { useAccount } from "wagmi"
import Moralis from "moralis";
import { EvmChain } from '@moralisweb3/common-evm-utils';
import nft from "../constants/BasicNft.json"
import Image from "next/image";
import { Card } from "@web3uikit/core"
import { ethers } from "ethers"
import styles from "../styles/NFTBox.module.css"


export default function NFTBox({ price, nftAddress, tokenId, seller, }) {

    const { isConnected } = useAccount()

    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

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
            console.log(`tokenURI: ${JSON.stringify(tokenURIResponse)}`)
            const imageURI = tokenURIResponse.image
            const imageURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")

            setImageURI(imageURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse.description)
        }
    }
    //updateUI() // can use useEffect

    useEffect(() => {
        if (isConnected) {
            updateUI()
        }
    }, [isConnected])

    return (<div>
        {imageURI ? (
            <Card title={tokenName} description={tokenDescription}>
                <div className={styles.info_block_padding}>
                    <div className={styles.info_block}>
                        <div>#{tokenId}</div>
                        <div className={styles.owner}> Owned by {seller}</div>
                        <Image loader={() => imageURI} alt="Nft image" src={imageURI} height="200" width="200" />
                        <div className={styles.price}> {ethers.utils.formatUnits(price, "ether")} ETH</div>
                    </div>
                </div>
            </Card>) :
            (
                <div></div>
            )}
    </div>)
}
