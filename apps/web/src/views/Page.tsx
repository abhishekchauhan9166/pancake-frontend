import { ChainId } from '@pancakeswap/chains'
import { useTheme } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { Swap } from '@pancakeswap/widgets-internal'
import { EXCHANGE_HELP_URLS } from 'config/constants'
import { useActiveChainId } from 'hooks/useActiveChainId'

const Page: React.FC<
  React.PropsWithChildren<{
    removePadding?: boolean
    hideFooterOnDesktop?: boolean
    noMinHeight?: boolean
    helpUrl?: string
  }>
> = ({
  children,
  removePadding = false,
  hideFooterOnDesktop = false,
  noMinHeight = false,
  helpUrl = EXCHANGE_HELP_URLS,
  ...props
}) => {
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const isBSC = chainId === ChainId.BSC
  const externalText = isBSC ? t('Bridge assets to BNB Chain') : ''
  const externalLinkUrl = isBSC ? 'https://bridge.pancakeswap.finance/' : ''

  const { theme } = useTheme()

  return (
    <Swap.Page
      removePadding={removePadding}
      noMinHeight={noMinHeight}
      hideFooterOnDesktop={hideFooterOnDesktop}
      helpUrl={helpUrl}
      externalText={externalText}
      externalLinkUrl={externalLinkUrl}
      {...props}
      style={{ background: theme.isDark ? theme.colors.gradientBubblegum : theme.colors.white }}
    >
      {children}
    </Swap.Page>
  )
}

export default Page
