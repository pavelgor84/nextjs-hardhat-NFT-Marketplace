import { Inter } from '@next/font/google'
import { useEffect, useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useAccount } from "wagmi"
import GET_ACTIVE_ITEMS from '@/constants/subgraphQuery'
import NFTBox from '@/components/NFTBox'
import styles from '../styles/Index.module.css'
import { useMoralis } from "react-moralis";


const inter = Inter({ subsets: ['latin'] })


export default function Home() {
  const { enableWeb3, deactivateWeb3 } = useMoralis()

  const { isConnected, address } = useAccount()
  const [output, setOutput] = useState("")


  //const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
  const [getItems, { loading, data: listedNfts }] = useLazyQuery(GET_ACTIVE_ITEMS) // need to add pagination in the future


  useEffect(() => {
    if (isConnected && !listedNfts) {
      //enableWeb3()
      getItems()
    }
    if (isConnected && listedNfts) {
      let itemOutput = listedNfts.activeItems.map((nft) => {
        let { price, nftAddress, tokenId, seller } = nft
        let key = `${nftAddress}${tokenId}`
        return (
          <div key={key}>
            <NFTBox price={price} nftAddress={nftAddress} tokenId={tokenId} seller={seller} account={address} />
          </div>
        )
      })
      setOutput(itemOutput)
    }
    if (!isConnected && listedNfts) {
      setOutput("")
    }
  }, [isConnected, listedNfts])

  // if (loading) return 'Loading...';
  // if (error) return `Error! ${error.message}`;

  // const output = listedNfts.activeItems.map((nft) => {
  //   let { price, nftAddress, tokenId, seller } = nft
  //   let key = `${nftAddress}${tokenId}`
  //   return (
  //     <div key={key}>
  //       <NFTBox price={price} nftAddress={nftAddress} tokenId={tokenId} seller={seller} />
  //     </div>
  //   )
  // })



  return (
    <div>

      {output ? (
        <div>
          <h1 className={styles.title}>Recently listed</h1>
          <div className={styles.card}>{output}</div>
        </div>) :
        (<div>Please connect your wallet</div>)}

    </div>
  )

}
