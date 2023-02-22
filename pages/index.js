import { Inter } from '@next/font/google'
import { useQuery } from '@apollo/client'
import { useAccount } from "wagmi"
import GET_ACTIVE_ITEMS from '@/constants/subgraphQuery'
import NFTBox from '@/components/NFTBox'


const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const { isConnected } = useAccount()

  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
  //console.log(listedNfts)
  if (loading) return 'Loading...';
  if (error) return `Error! ${error.message}`;

  const output = listedNfts.activeItems.map((nft) => {
    let { price, nftAddress, tokenId, seller } = nft
    let key = `${nftAddress}${tokenId}`
    return (
      <div key={key}>
        Price: {price}, NFT address: {nftAddress}, tokenId: {tokenId}, Seller: {seller}
        <NFTBox price={price} nftAddress={nftAddress} tokenId={tokenId} seller={seller} />
      </div>
    )
  })

  return (
    <div>
      Hi main page!
      {output}
    </div>
  )
}
