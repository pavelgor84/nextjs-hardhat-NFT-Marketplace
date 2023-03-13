import { Modal, Input, useNotification } from "@web3uikit/core"
import { useState } from "react"
import { useWeb3Contract } from "react-moralis";
import marketplace from "../constants/NftMarketplace.json"
import { ethers } from "ethers"


export default function UpdateListingModal({ nftAddress, tokenId, price, isVisible, hideModal }) {

    const dispatch = useNotification();

    const [newPrice, setNewPrice] = useState("")

    const handleInput = (event) => {
        setNewPrice(event)
    }

    const handleUpdateListing = async (tx) => {
        tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing updated",
            title: "Update listing",
            position: "topR"
        })
        hideModal && hideModal()
        setNewPrice("")

    }

    const { runContractFunction: updateListing } = useWeb3Contract({
        abi: marketplace.abi,
        contractAddress: marketplace.address,
        functionName: "updateListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
            newPrice: ethers.utils.parseEther(newPrice || price)
        }

    })



    return (

        <Modal
            okText="CONFIRM"
            width="40vw"
            title="Change NFT price"
            isVisible={isVisible}
            onOk={() => {
                updateListing({
                    onError: (error) => console.log(error),
                    onSuccess: handleUpdateListing,
                })
            }}
            onCancel={hideModal}
            onCloseButtonPressed={hideModal}
        >
            <br></br>

            <Input
                label="Enter new price in ETH"
                name="Update NFT price in ETH currency (level 1)"
                type="number"
                value={ethers.utils.formatUnits(price, "ether")}
                onChange={(event) => {
                    handleInput(event.target.value)
                }}
            />


        </Modal>
    )


}