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

    const mounted = useIsMounted() //hydration fix
    const { isConnected, isDisconnected, address } = useAccount()
    const { enableWeb3, deactivateWeb3, isWeb3Enabled } = useMoralis()

    async function updateProceeds(address) {

        //console.log(address)
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

    const { runContractFunction: withdraw } = useWeb3Contract({
        abi: marketplace.abi,
        contractAddress: marketplace.address,
        functionName: "withdrawProceeds"
    })

    useEffect(() => {   //
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

    async function handleProceeds(address, tx) {
        await tx.wait(1)
        updateProceeds(address)
    }

    return (
        <nav className={Styles.nav}>
            <div className={Styles.headerBlock}>
                <h1 className={Styles.header}>NFT Marketplace </h1>
                {address ? <h4>Revenue: <span className={Styles.revenue}>withdraw <span onClick={() => withdraw({
                    onError: (error) => console.log(error),
                    onSuccess: (tx) => handleProceeds(address, tx),// need handle !
                })} className={Styles.balance}>{balance}</span> ETH</span></h4> : <div></div>}

            </div>
            <div className={Styles.links}>
                <Link className={Styles.link} href="/">
                    Home
                </Link>
                <Link className={Styles.link} href="/sell-nft">
                    Sell NFT
                </Link>
                <Link className={Styles.link} href="/inventory">
                    Inventory
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