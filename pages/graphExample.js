import { useQuery, gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
{
    activeItems(first:5, where:{buyer_contains:"0x00000000"}){
        id
        buyer
        seller
        nftAddress
        tokenId
        price
    }
}
`

export default function graphExample() {
    const { error, loading, data } = useQuery(GET_ACTIVE_ITEMS)
    console.log("Data from the graph: " + JSON.stringify(data))
    return (
        <div>
            graph Example
        </div>
    )

}