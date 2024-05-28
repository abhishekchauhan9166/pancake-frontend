import { useTheme } from '@pancakeswap/hooks'
import { Box, IconButton, RefreshIcon } from '@pancakeswap/uikit'

import { memo } from 'react'

export const OnRampFlipButton = memo(function FlipButton({ refetch }: { refetch: any }) {
  const { theme } = useTheme()
  const themeColor = theme.isDark ? theme.colors.input : theme.colors.white
  return (
    <Box p="24px" mb="18px">
      <IconButton scale="sm" onClick={refetch} style={{ backgroundColor: themeColor, boxShadow: 'none' }}>
        <RefreshIcon width="24px" height="24px" color="lightBlue" />
      </IconButton>
    </Box>
  )
})
