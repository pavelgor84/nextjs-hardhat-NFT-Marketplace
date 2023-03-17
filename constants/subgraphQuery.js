import { gql } from "@apollo/client";

const GET_ACTIVE_ITEMS = gql`
query GetItems{
    
    activeItems(first:50, where:{buyer_contains:"0x00000000"}){
        id
        buyer
        seller
        nftAddress
        tokenId
        price
    }
    
}
`
export default GET_ACTIVE_ITEMS