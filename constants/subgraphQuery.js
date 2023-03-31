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

const GET_BUYED_ITEMS = gql`
query GetBuyedItems($account: String!){
    
    activeItems(first:50, where:{buyer_contains:$account}){
        id
        buyer
        seller
        nftAddress
        tokenId
        price
    }
    
}
`

export { GET_ACTIVE_ITEMS, GET_BUYED_ITEMS }
