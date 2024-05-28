import { useTranslation } from '@pancakeswap/localization'
import { Box, Button, CardBody, Select, Text } from '@pancakeswap/uikit'
import { AppHeader } from 'components/App'
import NextLink from 'next/link'
import { OptionProps } from 'pages/liquid-staking/index'
import StakeInfo from '../components/StakeInfo'

interface LiquidStakingPageStakeProps {
  selectedList: OptionProps
  optionsList: OptionProps[]
  handleSortOptionChange: (value: any) => void
  isDark?: boolean
}

export const LiquidStakingPageStake: React.FC<LiquidStakingPageStakeProps> = ({
  selectedList,
  optionsList,
  handleSortOptionChange,
  isDark,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <AppHeader
        shouldCenter
        subtitle={t('Unlock liquidity while earning rewards')}
        title={t('Liquid Staking')}
        noConfig
        isDark={isDark}
      />
      <CardBody>
        <Text fontSize="12px" mb="8px" color="lightBlue" bold textTransform="uppercase">
          {t('Choose a pair to liquid stake')}
        </Text>
        {optionsList.length > 0 && <Select mb="24px" options={optionsList} onOptionChange={handleSortOptionChange} />}
        <StakeInfo selectedList={selectedList} />

        <Box mb="16px">
          <NextLink href={`/liquid-staking/${selectedList?.contract}`}>
            <Button width="100%" variant="mainprimary" style={{ borderRadius: '24px' }}>
              {t('Proceed')}
            </Button>
          </NextLink>
        </Box>
      </CardBody>
    </>
  )
}
