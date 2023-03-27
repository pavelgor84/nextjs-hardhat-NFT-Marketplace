import { Modal, useNotification } from "@web3uikit/core"
import { useWeb3Contract } from "react-moralis";
import marketplace from "../constants/NftMarketplace.json"


export default function BuyListingModal({ nftAddress, tokenId, price, isVisible, hideModal, seller }) {

    const dispatch = useNotification()

    const { runContractFunction: buyListing } = useWeb3Contract({
        abi: marketplace.abi,
        contractAddress: marketplace.address,
        functionName: "buyItem",
        msgValue: price,
        params: {
            nftAddress: nftAddress,
            tokenId: tokenId,
        }

    })

    const handleBuyListing = async (tx) => {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Listing successfully bought!",
            title: "Buy listing",
            position: "topR"
        })
        hideModal && hideModal()
    }



    return (

        <Modal
            headerHasBottomBorder
            isVisible={isVisible}
            onOk={() => buyListing({
                onError: (error) => console.log(error),
                onSuccess: handleBuyListing,
            })}
            onCancel={hideModal}
            onCloseButtonPressed={hideModal}
            okText="BUY"
            width="40vw"
            title="Buy item"
        >
            <div
                style={{
                    display: 'grid',
                    placeItems: 'center'
                }}
            >
                NFT contract <em> {nftAddress} </em>
                Seller address <em>{seller}</em>
                <p style={{ color: "black", fontWeight: 900 }}>Are you shure you want to buy this item?</p>
            </div>
        </Modal>
    )


}