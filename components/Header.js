import Link from "next/link"
import useIsMounted from "@/pages/hooks/useIsMounted"
import Styles from "../styles/Header.module.css"
import { ConnectButton } from "@rainbow-me/rainbowkit"


export default function Header() {
    const mounted = useIsMounted()


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