import { useTranslation } from '@pancakeswap/localization'
import { BunnyFillIcon, Button, ChevronDownIcon, DeleteOutlineIcon, Flex, Text } from '@pancakeswap/uikit'
import { ASSET_CDN } from 'config/constants/endpoints'
import { useState } from 'react'
import { styled } from 'styled-components'
import {
  ErrorIcon,
  InputErrorText,
  StyledInput,
  StyledInputGroup,
} from 'views/DashboardQuestEdit/components/InputStyle'

const StyleSelector = styled(Button)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  padding: 0 8px 0 28px;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
`

const StyleNetwork = styled(Flex)`
  position: relative;
  z-index: 2;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-size: contain;
`

export const AddSwap = () => {
  const { t } = useTranslation()
  const [total, setTotal] = useState('')
  const [lpAddress, setLpAddress] = useState('')

  const handleTotalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTotal(e.target.value)
  }

  const handleLpAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLpAddress(e.target.value)
  }

  return (
    <Flex flexDirection={['column']}>
      <Flex width="100%">
        <Flex mr="8px" alignSelf="center">
          <BunnyFillIcon color="#7A6EAA" width="20px" height="20px" />
        </Flex>
        <Text style={{ alignSelf: 'center' }} bold>
          {t('Make a swap')}
        </Text>
        <DeleteOutlineIcon style={{ cursor: 'pointer' }} color="primary" width="20px" height="20px" ml="auto" />
      </Flex>
      <Flex flexDirection={['column']} width="100%" mt="12px">
        <Flex flexDirection="column">
          <Flex>
            <Flex position="relative" paddingRight="45px">
              <StyleNetwork style={{ backgroundImage: `url(${ASSET_CDN}/web/chains/56.png)` }} />
              <StyleSelector variant="light" scale="sm" endIcon={<ChevronDownIcon />} />
            </Flex>
            <StyledInputGroup endIcon={<ErrorIcon />}>
              <StyledInput
                isError
                value={lpAddress}
                placeholder={t('Min. amount in $')}
                onChange={handleLpAddressChange}
              />
            </StyledInputGroup>
          </Flex>
          <InputErrorText errorText={t('Cannot be 0')} />
        </Flex>
      </Flex>
    </Flex>
  )
}
