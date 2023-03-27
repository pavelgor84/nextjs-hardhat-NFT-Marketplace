import { Modal, useNotification } from "@web3uikit/core"
import { useWeb3Contract } from "react-moralis";
import marketplace from "../constants/NftMarketplace.json"
import nft from "../constants/BasicNft.json"
import nftMarketplace from "../constants/NftMarketplace.json"


export default function SellModal({ nftAddress, tokenId, price, isVisible, hideModal }) {

    const dispatch = useNotification()

    async function approveAndSell(data) {

        //const price = ethers.utils.parseUnits(price, "ether").toString()
        //const price = ethers.utils.parseUnits(price, "ether").toString()

        const approveOptions = {
            abi: nft.abi,
            contractAddress: nftAddress,
            functionName: "approve",
            params: {
                to: nftMarketplace.address,
                tokenId: tokenId,
            },
        }
        await runContractFunction({
            params: approveOptions,
            onError: (error) => console.log(error),
            onSuccess: (tx) => handleApproveSuccess(nftAddress, tokenId, price, tx),

        })

    }

    async function handleApproveSuccess(nftAddress, tokenId, price, tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Please wait for the listing transaction...",
            title: "1/2: NFT Listing approved.",
            position: "bottomR"
        })
        const listOptions = {
            abi: nftMarketplace.abi,
            contractAddress: nftMarketplace.address,
            functionName: "listItem",
            params: {
                nftAddress: nftAddress,
                tokenId: tokenId,
                price: price,
            }
        }

        await runContractFunction({
            params: listOptions,
            onError: (error) => console.log(error),
            onSuccess: handleListSuccess,
        })
    }

    async function handleListSuccess(tx) {
        await tx.wait(1)
        dispatch({
            type: "success",
            message: "Please refresh the page.",
            title: "2/2: NFT is listed",
            position: "bottomR"
        })

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