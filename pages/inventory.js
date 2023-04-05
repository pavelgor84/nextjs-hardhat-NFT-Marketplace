import { useNotification } from '@web3uikit/core'
import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_BUYED_ITEMS, GET_SELLING_ITEMS } from '@/constants/subgraphQuery'
import { useMoralis } from "react-moralis";
import { useEffect, useState } from 'react'
import InventoryCard from '@/components/InventoryCard';
import styles from '../styles/Index.module.css'
import NFTBox from '@/components/NFTBox';



export default function Inventory() {

    const { isWeb3Enabled, account } = useMoralis()
    // const { loadingBuyed, errorBuyed, data: buyedNfts } = useQuery(GET_BUYED_ITEMS)
    // const { loadingSelling, errorSelling, data: sellingNfts } = useQuery(GET_SELLING_ITEMS)
    const [getBuyedItems, { loadingBuyed, data: buyedNfts }] = useLazyQuery(GET_BUYED_ITEMS) // need to add pagination in the future + should use 'loading' instead  useEffect
    const [getSellingItems, { loadingSelling, data: sellingNfts }] = useLazyQuery(GET_SELLING_ITEMS)




    const [output, setOutput] = useState("")

    useEffect(() => {
        if (isWeb3Enabled && !buyedNfts) {
            getBuyedItems({ variables: { account } })
        }
        if (isWeb3Enabled && !sellingNfts) {
            getSellingItems({ variables: { account } })
        }
        if (isWeb3Enabled && buyedNfts && sellingNfts) {
            let itemOutput = {}
            itemOutput.buyed = buyedNfts.activeItems.map((nft) => {
                let { price, nftAddress, tokenId } = nft
                let key = `${nftAddress}${tokenId}`
                return (
                    <div key={key}>
                        <InventoryCard price={price} nftAddress={nftAddress} tokenId={tokenId} />
                    </div>
                )
            })
            itemOutput.selling = sellingNfts.activeItems.map((nft) => {
                let { price, nftAddress, tokenId, seller } = nft
                let key = `${nftAddress}${tokenId}`
                return (
                    <div key={key}>
                        <NFTBox price={price} nftAddress={nftAddress} tokenId={tokenId} seller={seller} account={account} />
                    </div>
                )
            })
            setOutput(itemOutput)
        }
        if (!isWeb3Enabled && buyedNfts) {
            setOutput("")
        }
    }, [isWeb3Enabled, buyedNfts, sellingNfts])


    //console.log(buyedNfts)

    return (
        <div>
            {output ? (
                <div>
                    <div>
                        <h1 className={styles.title}>NFT in your inventory</h1>
                        {output.selling ? <div className={styles.card}>{output.buyed}</div> : <div><p>You have no NFTs avalible for sale yet.</p></div>}
                    </div>
                    <div>
                        <h1 className={styles.title}>Your listed NFT</h1>
                        {output.buyed ? <div className={styles.card}>{output.selling}</div> : <div><p>Currently no NFTs are listed for sale.</p></div>}
                    </div>
                </div>
            ) :
                (<div>Please connect your wallet</div>)}
        </div>
    )
}
