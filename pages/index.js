import { Inter } from '@next/font/google'
import { useEffect, useState } from 'react'
import { useQuery, useLazyQuery } from '@apollo/client'
import { useAccount } from "wagmi"
import { GET_ACTIVE_ITEMS } from '@/constants/subgraphQuery'
import NFTBox from '@/components/NFTBox'
import styles from '../styles/Index.module.css'
import { useMoralis, useWeb3Contract } from "react-moralis";
import basicNFT from "../constants/BasicNft.json"


const inter = Inter({ subsets: ['latin'] })


export default function Home() {

  const { runContractFunction } = useWeb3Contract()

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
      generateCards()

    }
    if (!isConnected && listedNfts) {
      setOutput("")
    }
  }, [isConnected, listedNfts])


  async function filterTrueOwner(nft) { //filter functin for generating cards with confirmed owner

    let { nftAddress, tokenId, seller } = nft

    const checkOptions = {
      abi: basicNFT.abi,
      contractAddress: nftAddress,
      functionName: "ownerOf",
      params: {
        tokenId: tokenId,
      },
    }
    const result = await runContractFunction({ // a view query to NFT smartcontract address to obtain current owner of the nft token
      params: checkOptions,
      onError: (error) => console.log(error),
    })
    //console.log(`Result of checking: ${result}`)
    return result.toLowerCase() == seller.toLowerCase()// comaring nft's seller addres with owner of this tokenId in nft smartcontract to omit nfts that might have already been sold in other markets
  }

  async function generateCards() {
    let itemOutput = {}
    const filteredListed = await Promise.all(listedNfts.activeItems.filter(filterTrueOwner)) //apply filter and remove nfts where current owner differs from actual NFT smartcontract token owner
    itemOutput = filteredListed.map((nft) => {
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
