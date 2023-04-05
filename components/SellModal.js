import { Modal, useNotification, Form, Button } from "@web3uikit/core"
import { useWeb3Contract } from "react-moralis";
import nft from "../constants/BasicNft.json"
import nftMarketplace from "../constants/NftMarketplace.json"
import { ethers } from "ethers"
import { useState } from "react";


export default function SellModal({ nftAddress, tokenId, price, isVisible, hideModal }) {

    const [statusDisabled, setStatusDisbled] = useState(false)
    const { runContractFunction } = useWeb3Contract()

    const dispatch = useNotification()

    async function approveAndSell(data) {
        setStatusDisbled(true)

        //const price = ethers.utils.parseUnits(price, "ether").toString()
        const newPrice = ethers.utils.parseUnits(data.data[0].inputResult, "ether").toString()

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
            onSuccess: (tx) => handleApproveSuccess(nftAddress, tokenId, newPrice, tx),

        })

    }

    async function handleApproveSuccess(nftAddress, tokenId, newPrice, tx) {
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
                price: newPrice,
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
        hideModal()
        dispatch({
            type: "success",
            message: "Please refresh the page.",
            title: "2/2: NFT is listed",
            position: "bottomR"
        })

    }




    return (

        <Modal

            customFooter={
                <div style={{
                    width: "100%"
                }}>
                    <Form
                        isDisabled={statusDisabled}
                        customFooter={<div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button onClick={() => hideModal()} size="regular" text="Cancel" theme="secondary" />
                            <Button isLoading={statusDisabled} loadingText="Transaction in progress..." size="regular" text="List it for sale" theme="primary" type="submit" /></div>}

                        data={[
                            {
                                inputWidth: '100%',
                                name: 'price in ETH',
                                type: 'number',
                                value: ethers.utils.formatUnits(price, "ether"),
                            },

                        ]}
                        onSubmit={approveAndSell}
                        title="Set price for the NFT"
                    />
                </div>
            }
            isVisible={isVisible}
            onCloseButtonPressed={hideModal}
            okText="SELL"
            width="40vw"
            title="CONFIRM SELL PRICE"
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    columnGap: "40px"
                }}
            >
                <div style={{ color: "black", fontWeight: 900 }}>NFT contract <p>Token ID</p> </div>
                <div> {nftAddress} <p>{tokenId}</p> </div>

                {/* <p style={{ color: "black", fontWeight: 900 }}>Are you shure you want to sell this item?</p> */}

            </div>
        </Modal>
    )


}