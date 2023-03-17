import { Modal, useNotification } from "@web3uikit/core"
import { useWeb3Contract } from "react-moralis";
import marketplace from "../constants/NftMarketplace.json"
import { ethers } from "ethers"


export default function DelistModal({ nftAddress, tokenId, isVisible, hideModal }) {

    const dispatch = useNotification()

    const { runContractFunction: cancelListing } = useWeb3Contract({
        abi: marketplace.abi,
        contractAddress: marketplace.address,
        functionName: "cancelListing",
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        }

    })

    const handleCancelListing = (tx) => {
        tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing successfully canceled! Please refresh the page.",
            title: "Cancel listing",
            position: "bottomR"
        })
        hideModal && hideModal()
    }



    return (

        <Modal
            headerHasBottomBorder
            isVisible={isVisible}
            onOk={() => cancelListing({
                onError: (error) => console.log(error),
                onSuccess: handleCancelListing,
            })}
            onCancel={hideModal}
            onCloseButtonPressed={hideModal}
            okText="Delist"
            width="40vw"
            title="Delist item"
        >
            <div
                style={{
                    display: 'grid',
                    placeItems: 'center'
                }}
            >
                NFT contract <em> {nftAddress} </em>
                Token ID <em>{tokenId}</em>
                <p style={{ color: "black", fontWeight: 900 }}>Are you shure you want to delist this NFT?</p>
            </div>
        </Modal>
    )


}