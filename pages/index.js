import { Inter } from '@next/font/google'
import { useQuery } from '@apollo/client'
import GET_ACTIVE_ITEMS from '@/constants/subgraphQuery'
//import { ConnectButton } from '@rainbow-me/rainbowkit'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const { loading, error, data: listedNfts } = useQuery(GET_ACTIVE_ITEMS)
  console.log(listedNfts)

  return (
    <div>

      Hi main page!
    </div>
  )
}
