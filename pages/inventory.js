import { useNotification } from '@web3uikit/core'
import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_BUYED_ITEMS } from '@/constants/subgraphQuery'
import { useMoralis } from "react-moralis";
import { useEffect, useState } from 'react'
import InventoryCard from '@/components/InventoryCard';
import styles from '../styles/Index.module.css'



export default function Inventory() {

    const { isWeb3Enabled, account } = useMoralis()
    //const { loading, error, data: listedNfts } = useQuery(GET_BUYED_ITEMS)
    const [getBuyedItems, { loading, data: buyedNfts }] = useLazyQuery(GET_BUYED_ITEMS) // need to add pagination in the future

    const [output, setOutput] = useState("")

    useEffect(() => {
        if (isWeb3Enabled && !buyedNfts) {
            getBuyedItems({ variables: { account } })
        }
        if (isWeb3Enabled && buyedNfts) {
            let itemOutput = buyedNfts.activeItems.map((nft) => {
                let { price, nftAddress, tokenId } = nft
                let key = `${nftAddress}${tokenId}`
                return (
                    <div key={key}>
                        <InventoryCard price={price} nftAddress={nftAddress} tokenId={tokenId} />
                    </div>
                )
            })
            setOutput(itemOutput)
        }
        if (!isWeb3Enabled && buyedNfts) {
            setOutput("")
        }
    }, [isWeb3Enabled, buyedNfts])


    console.log(buyedNfts)

    return (
        <div>
            {output ? (
                <div>
                    <h1 className={styles.title}>NFT in your inventory</h1>
                    <div className={styles.card}>{output}</div>
                </div>) :
                (<div>Please connect your wallet</div>)}
        </div>
    )
}
