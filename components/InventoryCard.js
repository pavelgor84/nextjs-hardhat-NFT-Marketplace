import { useState, useEffect } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nft from "../constants/BasicNft.json"
import Image from "next/image";
import { Card } from "@web3uikit/core"
import { ethers } from "ethers"
import styles from "../styles/NFTBox.module.css"
import UpdateListingModal from "./UpdateListingModal";
import DelistModal from "./DelistModal";
import SellModal from "./SellModal";


const shortAdrres = (string, len) => {
    if (string < len) return string
    const sepatator = "..."
    const separLength = sepatator.length
    const stringChars = len - separLength
    const backChars = Math.floor(stringChars / 2)
    const endChars = Math.ceil(stringChars / 2)
    return (string.substring(0, backChars) + sepatator + string.substring(string.length - endChars))
}

export default function InventoryCard({ price, nftAddress, tokenId }) {

    const { isWeb3Enabled, account } = useMoralis()

    const [imageURI, setImageURI] = useState("")
    //console.log(imageURI)
    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")

    /// Handle modals
    const [showChangeModal, setShowChangeModal] = useState(false)
    const [showSellModal, setShowSellModal] = useState(false)
    const [showDelistModal, setShowDelistModal] = useState(false)

    const hideChangeModal = () => {
        setShowChangeModal(false)
    }
    const hideSellModal = () => {
        setShowSellModal(false)
    }
    const hideDelistModal = () => {
        setShowDelistModal(false)
    }
    ///

    const { runContractFunction: getTokenURI } = useWeb3Contract({
        abi: nft.abi,
        contractAddress: nftAddress,
        functionName: "tokenURI",
        params: {
            tokenId: tokenId,
        },

    })

    // const { runContractFunction: getTokenOwner } = useWeb3Contract({
    //     abi: nft.abi,
    //     contractAddress: nftAddress,
    //     functionName: "ownerOf",
    //     params: {
    //         tokenId: tokenId,
    //     },

    // })


    async function updateUI() {
        //// check if the nft ownner is still equals to user account since the user could sell it on other marketplace.
        // const tokenOwner = await getTokenOwner()
        // if (tokenOwner.toLowerCase() !== account.toLowerCase()) return false
        // console.log(`the token owner is changed: ${tokenOwner.toLowerCase() !== account.toLowerCase()}`)
        ///
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
        if (isWeb3Enabled) {
            updateUI()
            //setTimeout(updateUI, 500)
        }
    }, [isWeb3Enabled])


    const handleSellModal = () => {
        setShowSellModal(true)
    }
    const handleDelistClick = () => {
        setShowDelistModal(true)
    }

    return (<div>
        {imageURI ? (
            <div>
                <SellModal
                    isVisible={showSellModal}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    price={price}
                    hideModal={hideSellModal}
                />

                <UpdateListingModal
                    isVisible={showChangeModal}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    price={price}
                    hideModal={hideChangeModal}
                />
                <DelistModal
                    isVisible={showDelistModal}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    hideModal={hideDelistModal}
                />
                <Card title={tokenName} description={tokenDescription} cursorType="default">
                    <div className={styles.info_block_padding}>
                        <div className={styles.info_block}>
                            <div className={styles.priceBlock}>
                                <div>#{tokenId}</div>
                                <div></div>
                            </div>
                            <div className={styles.owner}> Owned by You</div>
                            <Image loader={() => imageURI} alt="Nft image" src={imageURI} height="200" width="200" />
                            <div className={styles.priceBlock}>
                                <div className={styles.price}> {ethers.utils.formatUnits(price, "ether")} ETH</div>
                                <button className={styles.changePriceButton} onClick={handleSellModal}>SELL</button>
                            </div>
                        </div>
                    </div>
                </Card> </div>) :
            (
                <div>Loading...</div>
            )}
    </div>)
}
