import Link from "next/link"
import useIsMounted from "@/pages/hooks/useIsMounted"
import Styles from "../styles/Header.module.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { useEffect } from "react"
import { useMoralis } from "react-moralis";


export default function Header() {
    const mounted = useIsMounted()
    const { isConnected } = useAccount()
    const { enableWeb3, deactivateWeb3 } = useMoralis()

    useEffect(() => {
        if (isConnected) {
            enableWeb3()
        }
        else {
            deactivateWeb3()
        }
    }, [isConnected])

    return (
        <nav className={Styles.nav}>
            <h1 className={Styles.header}>NFT Marketplace </h1>
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