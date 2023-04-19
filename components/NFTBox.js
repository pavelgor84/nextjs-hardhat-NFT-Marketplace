import { useState, useEffect, Children } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import nft from "../constants/BasicNft.json"
import Image from "next/image";
import { Card, Tooltip } from "@web3uikit/core"
import { Info } from '@web3uikit/icons'
import { ethers } from "ethers"
import styles from "../styles/NFTBox.module.css"
import UpdateListingModal from "./UpdateListingModal";
import BuyListingModal from "./BuyListingModal";
import DelistModal from "./DelistModal";
import SellModal from "./SellModal";
import Metadata from "./Metadata";


const shortAdrres = (string, len) => {
    if (string < len) return string
    const sepatator = "..."
    const separLength = sepatator.length
    const stringChars = len - separLength
    const backChars = Math.floor(stringChars / 2)
    const endChars = Math.ceil(stringChars / 2)
    return (string.substring(0, backChars) + sepatator + string.substring(string.length - endChars))
}

export default function NFTBox({ price, nftAddress, tokenId, seller, buyer, account }) {

    const { isWeb3Enabled } = useMoralis()
    //console.log(`web3 enabled: ${isWeb3Enabled}`)


    const [imageURI, setImageURI] = useState("")

    const [tokenName, setTokenName] = useState("")
    const [tokenDescription, setTokenDescription] = useState("")
    console.log(tokenName)

    /// Modal states
    const [showChangeModal, setShowChangeModal] = useState(false)
    const [showBuyModal, setShowBuyModal] = useState(false)
    const [showDelistModal, setShowDelistModal] = useState(false)
    const [showSellModal, setShowSellModal] = useState(false)

    // Modal handlers
    const hideChangeModal = () => {
        setShowChangeModal(false)
    }
    const hideBuyModal = () => {
        setShowBuyModal(false)
    }
    const hideDelistModal = () => {
        setShowDelistModal(false)
    }
    const hideSellModal = () => {
        setShowSellModal(false)
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


    async function updateUI() {
        const tokenURI = await getTokenURI()
        //console.log(`token URI: ${tokenURI}`)

        if (tokenURI) {
            const requestURL = tokenURI.replace("ipfs://", "https://ipfs.io/ipfs/")
            const tokenURIResponse = await (await fetch(requestURL)).json()
            console.log(`tokenURI: ${JSON.stringify(tokenURIResponse, null, 2)}`)
            const imageURI = tokenURIResponse.image
            const imageURL = imageURI.replace("ipfs://", "https://ipfs.io/ipfs/")

            setImageURI(imageURL)
            setTokenName(tokenURIResponse.name)
            setTokenDescription(tokenURIResponse)
        }
    }
    //updateUI() // can use useEffect

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])


    const isOwnedByUser = seller?.toLowerCase() === account.toLowerCase() || seller === undefined
    const formattedSeller = isOwnedByUser ? "You" : shortAdrres(seller, 15)

    const handleChangeBuyClick = () => {
        isOwnedByUser ? setShowChangeModal(true) : setShowBuyModal(true)
    }
    const handleDelistClick = () => {
        setShowDelistModal(true)
    }
    const handleSellModal = () => {
        setShowSellModal(true)
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
                <DelistModal
                    isVisible={showDelistModal}
                    nftAddress={nftAddress}
                    tokenId={tokenId}
                    hideModal={hideDelistModal}
                />

                <Card title={tokenName ? tokenName : "No name"} description={tokenDescription.description ? tokenDescription.description : "No description"} cursorType="default">
                    <div className={styles.info_block_padding}>
                        <div className={styles.info_block}>
                            <div className={styles.priceBlock}>
                                <div>#{tokenId}</div>
                                {/* // NFT is owned by current user and has a seller in event, means that is being listed */}
                                {(isOwnedByUser && seller) ? <div><button onClick={handleDelistClick}>DELIST</button></div> : <div></div>}

                                <div className={styles.tooltip} >
                                    <Tooltip
                                        content={<Metadata data={tokenDescription} />}
                                        position="right"
                                    >
                                        <Info color="#blue" fontSize='25px' />
                                    </Tooltip>
                                </div>
                            </div>
                            <div className={styles.owner}> Owned by {formattedSeller}</div>
                            <Image loader={() => imageURI} alt="Nft image" src={imageURI} height="200" width="200" />
                            <div className={styles.priceBlock}>
                                <div className={styles.price}> {ethers.utils.formatUnits(price, "ether")} ETH</div>
                                {/* // NFT is owned by current user and has a seller in event, means that is being listed. The user can change the price */}
                                {isOwnedByUser && seller && <button className={styles.changePriceButton} onClick={handleChangeBuyClick}>CHANGE PRICE</button>}
                                {/* // NFT isn't owned by user and has a seller, means that it's being sold now by someone else */}
                                {!isOwnedByUser && seller && <button className={styles.buyButton} onClick={handleChangeBuyClick}>BUY NOW</button>}
                                {/* // NFT is owned by user and has a buyer, means that it isn't being sold now and the user has just its ownership in NFT smartcontract */}
                                {isOwnedByUser && buyer && <button className={styles.changePriceButton} onClick={handleSellModal}>SELL</button>}
                            </div>
                        </div>
                    </div>
                </Card> </div >) :
            (
                <div>Loading...</div>
            )
        }
    </div >)
}
