import Head from 'next/head'
import Header from '../components/Header'
import { configureChains, WagmiConfig, createClient } from 'wagmi'
import { publicProvider } from 'wagmi/providers/public'
import { localhost, goerli } from '@wagmi/chains'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import "@rainbow-me/rainbowkit/styles.css"
import "../styles/global.css"
import { getDefaultWallets, RainbowKitProvider, midnightTheme } from '@rainbow-me/rainbowkit'
import { MoralisProvider } from 'react-moralis'
import { NotificationProvider } from "@web3uikit/core"

const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "https://api.studio.thegraph.com/query/42087/nft-marketplace/0.0.7"
})

const { chains, provider } = configureChains([localhost, goerli], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: "NFT marketplace",
  chains
})

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export default function App({ Component, pageProps }) {

  return (
    <div>

      <Head>
        <title>NFT Marketplace</title>
        <meta name="description" content="NFT Marketplace" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false} >

        <WagmiConfig client={wagmiClient}>
          <RainbowKitProvider chains={chains} theme={midnightTheme()}>
            <ApolloProvider client={apolloClient}>
              <NotificationProvider>
                <Header />
                <Component {...pageProps} />
              </NotificationProvider>
            </ApolloProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </MoralisProvider>
    </div>

  )
}
