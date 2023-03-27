import { useNotification } from '@web3uikit/core'
import { useQuery, useLazyQuery } from '@apollo/client'
import { GET_BUYED_ITEMS } from '@/constants/subgraphQuery'


export default function Inventory() {

    const { loading, error, data: listedNfts } = useQuery(GET_BUYED_ITEMS)


    console.log(listedNfts)

    return (
        <div>Inventory</div>
    )
}
