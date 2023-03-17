import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nft from "../constants/BasicNft.json"
import Image from "next/image";
import { Card } from "@web3uikit/core"
import { ethers } from "ethers"
import styles from "../styles/NFTBox.module.css"
import UpdateListingModal from "./UpdateListingModal";
import BuyListingModal from "./BuyListingModal";


const shortAdrres = (string, len) => {
    if (string < len) return string
    const sepatator = "..."
    const separLength = sepatator.length
    const stringChars = len - separLength
    const backChars = Math.floor(stringChars / 2)
    const endChars = Math.ceil(stringChars / 2)
    return (string.substring(0, backChars) + sepatator + string.substring(string.length - endChars))
}

export default function NFTBox({ price, nftAddress, tokenId, seller, account }) {

    const { isWeb3Enabled } = useMoralis()
    console.log(`web3 enabled: ${isWeb3Enabled}`)


    const [imageURI, setImageURI] = useState("")
    //console.log(imageURI)
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    const [showChangeModal, setShowChangeModal] = useState(false)
    const [showBuyModal, setShowBuyModal] = useState(false)

    const hideChangeModal = () => {
        setShowChangeModal(false)
    }
    const hideBuyModal = () => {
        setShowBuyModal(false)
    }

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nft.abi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },

    })


    async function updateUI() {
        const tokenURI = await getTokenURI()
        //console.log(`token URI: ${tokenURI}`)

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
        if (isWeb3Enabled) {
            updateUI()
            //setTimeout(updateUI, 500)
        }
    }, [isWeb3Enabled])


    const isOwnedByUser = seller.toLowerCase() === account.toLowerCase() || seller === undefined
    const formattedSeller = isOwnedByUser ? "you" : shortAdrres(seller, 15)

    const handleCardClick = () => {
        isOwnedByUser ? setShowChangeModal(true) : setShowBuyModal(true)
    }

    return (<div>
        {imageURI ? (
            <div>
                <BuyListingModal
                    isVisible={showBuyModal}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    price={price}
                    hideModal={hideBuyModal}
                    seller={seller}
                />
                <UpdateListingModal
                    isVisible={showChangeModal}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    price={price}
                    hideModal={hideChangeModal}
                />
                <Card title={tokenName} description={tokenDescription} cursorType="default">
                    <div className={styles.info_block_padding}>
                        <div className={styles.info_block}>
                            <div>#{tokenId}</div>
                            <div className={styles.owner}> Owned by {formattedSeller}</div>
                            <Image loader={() => imageURI} alt="Nft image" src={imageURI} height="200" width="200" />
                            <div className={styles.priceBlock}>
                                <div className={styles.price}> {ethers.utils.formatUnits(price, "ether")} ETH</div>
                                {isOwnedByUser ? <button className={styles.changePriceButton} onClick={handleCardClick}>CHANGE PRICE</button>
                                    : <button className={styles.buyButton} onClick={handleCardClick}>BUY NOW</button>}
                            </div>
                        </div>
                    </div>
                </Card> </div>) :
            (
                <div>Loading...</div>
            )}
    </div>)
}