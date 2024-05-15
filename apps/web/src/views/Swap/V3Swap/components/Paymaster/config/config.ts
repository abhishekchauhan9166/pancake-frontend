import { zkSync } from 'viem/zksync'
import { NATIVE_CURRENCY_ADDRESS } from 'views/Swap/MMLinkPools/constants'
import { PaymasterToken } from '../types'

export const DEFAULT_PAYMASTER_TOKEN: PaymasterToken = {
  address: NATIVE_CURRENCY_ADDRESS,
  decimals: 18,
  name: 'zkSync Ether',
  symbol: 'ETH',
  logoURI: 'https://pancakeswap.finance/images/tokens/0x2170Ed0880ac9A755fd29B2688956BD959F933F8.png',
  isNative: true,
  isToken: false,
  chainId: zkSync.id,
}

export const paymasterTokens: PaymasterToken[] = [
  {
    address: '0xBBeB516fb02a01611cBBE0453Fe3c580D7281011',
    decimals: 18,
    name: 'Wrapped BTC',
    symbol: 'WBTC',
    logoURI: 'https://tokens.pancakeswap.finance/images/symbol/wbtc.png',
    isNative: false,
    isToken: true,
    chainId: zkSync.id,
  },
  {
    name: 'DAI Token',
    symbol: 'DAI',
    address: '0x4B9eb6c0b6ea15176BBF62841C6B2A8a398cb656',
    decimals: 18,
    logoURI: 'https://tokens.pancakeswap.finance/images/symbol/dai.png',
    isNative: false,
    isToken: true,
    chainId: zkSync.id,
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4',
    decimals: 6,
    logoURI: 'https://tokens.pancakeswap.finance/images/symbol/usdc.png',
    isNative: false,
    isToken: true,
    chainId: zkSync.id,
  },
]