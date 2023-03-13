import Head from 'next/head'
import { Inter } from '@next/font/google'
import { useWeb3Contract, isWeb3Enabled } from "react-moralis";
import { useEffect } from 'react';
import { Form, useNotification } from '@web3uikit/core'
import { ethers } from "ethers"
import nft from "../constants/BasicNft.json"
import nftMarketplace from "../constants/NftMarketplace.json"

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const dispatch = useNotification()

    console.log(`web3 enabled: ${isWeb3Enabled}`)

    const { runContractFunction } = useWeb3Contract()

    async function approveAndSell(data) {

        const nftAddress = data.data[0].inputResult
        const tokenId = data.data[1].inputResult
        const price = ethers.utils.parseUnits(data.data[2].inputResult, "ether").toString()

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
            onSuccess: () => handleApproveSuccess(nftAddress, tokenId, price)
        })

    }

    async function handleApproveSuccess(nftAddress, tokenId, price) {

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
            onSuccess: () => handleListSuccess(),
        })
    }

    async function handleListSuccess() {
        dispatch({
            type: "success",
            message: "NFT Listing",
            title: "NFT listed",
            position: "topR"
        })
    }

    return (
        <div>
            <Form
                onSubmit={approveAndSell}
                data={[
                    {
                        inputWidth: "50%",
                        name: "NFT Address",
                        type: "text",
                        value: ""
                    },
                    {
                        name: "Token Id",
                        type: "number",
                        value: ""
                    },
                    {
                        name: "Price in ETH",
                        type: "number",
                        value: ""
                    }
                ]}
                title="Sell your NFT"
                id="Main Form"
            />

        </div>
    )
}
