import { ArrowDownIcon, ArrowUpDownIcon, AutoColumn, IconButton } from '@pancakeswap/uikit'
import { AutoRow } from 'components/Layout/Row'
import React, { useCallback } from 'react'
import { styled } from 'styled-components'

const StyledButton = styled(IconButton)`
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
  background-color: ${({ theme }) => (theme.isDark ? theme.colors.input : theme.colors.white)};
  .icon-up-down {
    display: none;
  }
  &:hover {
    /* background-color: ${({ theme }) => theme.colors.primary}; */
    .icon-down {
      display: none;
      fill: #6563ff;
    }
    .icon-up-down {
      display: block;
      fill: #6563ff;
    }
  }
`

interface SwitchIconButtonProps {
  color: 'primary' | 'text'
  handleSwitchTokens: () => void
}

const SwitchIconButton: React.FC<React.PropsWithChildren<SwitchIconButtonProps>> = ({ handleSwitchTokens }) => {
  const handleOnClick = useCallback(() => handleSwitchTokens?.(), [handleSwitchTokens])

  return (
    <AutoColumn justify="space-between">
      <AutoRow justify="center" style={{ padding: '0 1rem' }}>
        <StyledButton variant="light" scale="sm" onClick={handleOnClick}>
          <ArrowDownIcon className="icon-down" color="#6563ff" />
          <ArrowUpDownIcon className="icon-up-down" color="#6563ff" />
        </StyledButton>
      </AutoRow>
    </AutoColumn>
  )
}

export default SwitchIconButton
