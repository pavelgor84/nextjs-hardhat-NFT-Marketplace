import { useState, useEffect } from "react";
import { useAccount } from "wagmi"
import Moralis from "moralis";
import { EvmChain } from '@moralisweb3/common-evm-utils';
import nft from "../constants/BasicNft.json"
import Image from "next/image";
import { Card } from "@web3uikit/core"
import { ethers } from "ethers"
import styles from "../styles/NFTBox.module.css"
import UpdateListingModal from "./UpdateListingModal";


const shortAdrres = (string, len) => {
    if (string < len) return string
    const sepatator = "..."
    const separLength = sepatator.length
    const stringChars = len - separLength
    const backChars = Math.floor(stringChars / 2)
    const endChars = Math.ceil(stringChars / 2)
    return (string.substring(0, backChars) + sepatator + string.substring(string.length - endChars))
}

export default function NFTBox({ price, nftAddress, tokenId, seller }) {

    const { address: account, isConnected } = useAccount()

    const [imageURI, setImageURI] = useState("")
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    const [showModal, setShowModal] = useState(false)
    const hideModal = () => {
        setShowModal(false)
    }

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

    const isOwnedByUser = seller.toLowerCase() === account.toLowerCase() || seller === undefined
    const formattedSeller = isOwnedByUser ? "you" : shortAdrres(seller, 15)

    const handleCardClick = () => {
        isOwnedByUser ? setShowModal(true) : console.log("Let's buy!")
    }

    return (<div>
        {imageURI ? (
            <div>
                <UpdateListingModal
                    isVisible={showModal}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    price={price}
                    hideModal={hideModal}
                />
                <Card title={tokenName} description={tokenDescription} onClick={handleCardClick}>
                    <div className={styles.info_block_padding}>
                        <div className={styles.info_block}>
                            <div>#{tokenId}</div>
                            <div className={styles.owner}> Owned by {formattedSeller}</div>
                            <Image loader={() => imageURI} alt="Nft image" src={imageURI} height="200" width="200" />
                            <div className={styles.price}> {ethers.utils.formatUnits(price, "ether")} ETH</div>
                        </div>
                    </div>
                </Card> </div>) :
            (
                <div></div>
            )}
    </div>)
}
