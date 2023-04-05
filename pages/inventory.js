import { useLazyQuery } from '@apollo/client'
import { GET_BUYED_ITEMS, GET_SELLING_ITEMS } from '@/constants/subgraphQuery'
import { useMoralis, useWeb3Contract } from "react-moralis"
import { useEffect, useState } from 'react'
import InventoryCard from '@/components/InventoryCard'
import styles from '../styles/Index.module.css'
import NFTBox from '@/components/NFTBox'
import basicNFT from "../constants/BasicNft.json"



export default function Inventory() {

    const { isWeb3Enabled, account } = useMoralis()
    // const { loadingBuyed, errorBuyed, data: buyedNfts } = useQuery(GET_BUYED_ITEMS)
    // const { loadingSelling, errorSelling, data: sellingNfts } = useQuery(GET_SELLING_ITEMS)
    const [getBuyedItems, { loadingBuyed, data: buyedNfts }] = useLazyQuery(GET_BUYED_ITEMS) // need to add pagination in the future + should use 'loading' instead  useEffect
    const [getSellingItems, { loadingSelling, data: sellingNfts }] = useLazyQuery(GET_SELLING_ITEMS)


    const { runContractFunction } = useWeb3Contract()

    const [output, setOutput] = useState("")

    useEffect(() => {
        if (isWeb3Enabled && !buyedNfts) {
            getBuyedItems({ variables: { account } })
        }
        if (isWeb3Enabled && !sellingNfts) {
            getSellingItems({ variables: { account } })
        }
        if (isWeb3Enabled && buyedNfts && sellingNfts) {
            generateCards()
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





    async function generateCards() {
        let itemOutput = {}
        itemOutput.buyed = await Promise.all(buyedNfts.activeItems.map(async (nft) => {
            let { nftAddress, tokenId } = nft

            const checkOptions = {
                abi: basicNFT.abi,
                contractAddress: nftAddress,
                functionName: "ownerOf",
                params: {
                    tokenId: tokenId,
                },
            }
            const result = await runContractFunction({
                params: checkOptions,
                onError: (error) => console.log(error),
                onSuccess: (tx) => console.log("success tx " + tx)
            })
            console.log(`Result of checking: ${result}`)


        }))

    }


    //console.log(buyedNfts)

    return (
        <div>
            {output ? (
                <div>
                    <div>
                        <h3 className={styles.title}>NFT in your inventory</h3>
                        {output.selling ? <div className={styles.card}>{output.buyed}</div> : <div><p>You have no NFTs avalible for sale yet.</p></div>}
                    </div>
                    <div>
                        <h3 className={styles.title}>Your listed NFT</h3>
                        {output.buyed ? <div className={styles.card}>{output.selling}</div> : <div><p>Currently no NFTs are listed for sale.</p></div>}
                    </div>
                </div>
            ) :
                (<div>Please connect your wallet</div>)}
        </div>
    )
}
