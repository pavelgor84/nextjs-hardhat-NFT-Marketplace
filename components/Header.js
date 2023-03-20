import Link from "next/link"
import useIsMounted from "@/pages/hooks/useIsMounted"
import Styles from "../styles/Header.module.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { useEffect, useState } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis";
import marketplace from "../constants/NftMarketplace.json"
import { ethers } from "ethers"


export default function Header() {

    const [balance, setBalance] = useState("")

    // const { runContractFunction: getProceeds } = useWeb3Contract({
    //     abi: marketplace.abi,
    //     contractAddress: marketplace.address,
    //     params: {
    //         seller: address,
    //     }
    // })
    const { runContractFunction } = useWeb3Contract()

    const mounted = useIsMounted()
    const { isConnected, isDisconnected, address } = useAccount()
    const { enableWeb3, deactivateWeb3, isWeb3Enabled } = useMoralis()

    async function updateProceeds(address) {

        console.log(address)
        const options = {
            abi: marketplace.abi,
            contractAddress: marketplace.address,
            functionName: "getProceeds",
            params: {
                seller: address,
            },
        }
        const userProceeds = await runContractFunction({
            params: options,
            onError: (error) => console.log(error),

        })

        if (userProceeds) {
            setBalance(ethers.utils.formatUnits(userProceeds.toString(), "ether"))
            //console.log(ethers.utils.formatUnits(userProceeds.toString(), "ether"))
        }
    }

    useEffect(() => {
        if (isConnected) {
            enableWeb3()
        }
        if (isDisconnected) {
            deactivateWeb3()
            setBalance("")
        }
    }, [isConnected, isDisconnected])

    useEffect(() => {
        if (isWeb3Enabled && address) {
            updateProceeds(address)
        }
    }, [isWeb3Enabled, address])

    return (
        <nav className={Styles.nav}>
            <div className={Styles.headerBlock}>
                <h1 className={Styles.header}>NFT Marketplace </h1> <h3>Balance:{balance}</h3>
            </div>
            <div className={Styles.links}>
                <Link className={Styles.link} href="/">
                    Home
                </Link>
                <Link className={Styles.link} href="/sell-nft">
                    Sell NFT
                </Link>
                <div className={Styles.connectButton}>
                    <ConnectButton accountStatus={"full"} chainStatus={"full"} />
                </div>
                {/* {!isConnected ? <button onClick={connect}>Connect your wallet</button> :
                (<div>
                    <h2>Connected Wallet:</h2>
                    <h3>{address}</h3>
                </div>)
            } */}
            </div>
        </nav>
    )
}