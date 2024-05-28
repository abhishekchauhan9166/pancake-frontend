import { useDefaultsFromURLSearch } from 'state/buyCrypto/hooks'
import { useAccount } from 'wagmi'
import { useTheme } from '@pancakeswap/hooks'
import Page from '../Page'
import { OnRampFaqs } from './components/FAQ'
import { BuyCryptoForm } from './containers/BuyCryptoForm'
import { StyledAppBody } from './styles'

export default function BuyCrypto() {
  const { address } = useAccount()
  useDefaultsFromURLSearch(address)

  const { theme } = useTheme()

  return (
    <Page>
      <StyledAppBody mb="24px" isDark={theme.isDark}>
        <BuyCryptoForm />
      </StyledAppBody>
      <StyledAppBody>
        <OnRampFaqs />
      </StyledAppBody>
    </Page>
  )
}
