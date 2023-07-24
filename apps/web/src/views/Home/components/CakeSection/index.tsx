import { useTranslation } from '@pancakeswap/localization'
import {
  Button,
  Flex,
  Link,
  OpenNewIcon,
  Text,
  PoolIcon,
  EarnIcon,
  SwapIcon,
  NftIcon,
  TrophyIcon,
} from '@pancakeswap/uikit'
import useTheme from 'hooks/useTheme'
import Image from 'next/image'
import React, { useMemo } from 'react'
import styled from 'styled-components'
import cakeSectionMain from '../../images/cake-section-main.png'
import { CakeSectionTag, CakePartnerTag } from './CakeSectionTag'
import partnerBinance from '../../images/partner-binance.png'
import partner1inch from '../../images/partner-1inch.png'
import partnerMetamask from '../../images/partner-metamask.png'
import partnerLedger from '../../images/partner-ledger.png'
import partnerMore from '../../images/partner-more.png'

const useEcosystemTagData = () => {
  const { t } = useTranslation()
  return useMemo(() => {
    return [
      { icon: <PoolIcon />, text: t('Staking') },
      { icon: <EarnIcon />, text: t('Farming') },
      { icon: <SwapIcon />, text: t('Trade') },
      { icon: <NftIcon />, text: t('NFT') },
      {
        icon: <TrophyIcon />,
        text: t('Liquidity Provision'),
      },
      { icon: <TrophyIcon />, text: t('Governance') },
      { icon: <TrophyIcon />, text: t('Win') },
    ]
  }, [t])
}

const usePartnerData = () => {
  return useMemo(() => {
    return [
      { src: partnerBinance, width: 116, height: 44, alt: 'partnerBinance' },
      { src: partner1inch, width: 105, height: 44, alt: 'partner1inch' },
      { src: partnerMetamask, width: 111, height: 44, alt: 'partnerMetamask' },
      { src: partnerLedger, width: 97, height: 44, alt: 'partnerLedger' },
      { src: partnerMore, width: 71, height: 44, alt: 'partnerMore' },
    ]
  }, [])
}

export const CakeSectionMainBox = styled.div`
  display: flex;
  width: 100%;
  margin-top: 50px;
  height: 400px;
`
export const CakeSectionLeftBox = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  max-width: 33%;
`
export const CakeSectionRightBox = styled.div`
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: end;
  max-width: 33%;
`

export const CakeSectionCenterBox = styled.div`
  margin-top: 20px;
`

const CakeSection: React.FC = () => {
  const { theme } = useTheme()
  const { t } = useTranslation()
  const ecosystemTagData = useEcosystemTagData()
  const partnerData = usePartnerData()

  return (
    <Flex flexDirection="column" style={{ gap: 32 }}>
      <Flex style={{ gap: 10 }} justifyContent="center">
        <Text fontSize="40px" fontWeight={600}>
          {t('Unlock the Full Potential of DeFi with')}
        </Text>
        <Text fontWeight={600} color={theme.isDark ? '#A881FC' : theme.colors.secondary} fontSize="40px">
          {t('CAKE')}
        </Text>
      </Flex>
      <Flex justifyContent="center">
        <Text fontSize={16} style={{ whiteSpace: 'nowrap' }}>
          {t(
            'Experience the power of community ownership, global governance, and explore infinite use cases within the PancakeSwap ecosystem',
          )}
        </Text>
      </Flex>
      <Flex justifyContent="center" style={{ gap: 14 }}>
        <Link href="https://pancakeswap.finance/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&chainId=56">
          <Button variant="primary">{t('Buy Cake')}</Button>
        </Link>
        <Link href="https://docs.pancakeswap.finance/governance-and-tokenomics/cake-tokenomics">
          <Button endIcon={<OpenNewIcon color="primary" />} variant="secondary">
            {t('Discover Cake')}
          </Button>
        </Link>
      </Flex>
      <CakeSectionMainBox>
        <CakeSectionLeftBox>
          <Text color={theme.isDark ? '#A881FC' : theme.colors.secondary} fontSize="40px" fontWeight="600" mb="20px">
            {t('Ecosystem')}
          </Text>
          <Flex flexWrap="wrap" style={{ gap: 0 }}>
            {ecosystemTagData.map((item) => (
              <CakeSectionTag key={item.text} icon={item.icon} text={item.text} />
            ))}
          </Flex>
        </CakeSectionLeftBox>
        <CakeSectionCenterBox>
          <Image src={cakeSectionMain} alt="cakeSectionMain" width={395} height={395} placeholder="blur" />
        </CakeSectionCenterBox>
        <CakeSectionRightBox>
          <Text color={theme.isDark ? '#A881FC' : theme.colors.secondary} fontSize="40px" fontWeight="600">
            {t('Partners')}
          </Text>
          <Flex flexWrap="wrap" style={{ gap: 0 }}>
            {partnerData.map((item) => (
              <CakePartnerTag key={item.alt} src={item.src} width={item.width} height={item.height} alt={item.alt} />
            ))}
          </Flex>
        </CakeSectionRightBox>
      </CakeSectionMainBox>
    </Flex>
  )
}

export default CakeSection