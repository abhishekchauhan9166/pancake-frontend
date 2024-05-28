import { FC } from 'react'
import { AppHeader } from 'components/App'
import { useTheme } from '@pancakeswap/hooks'

export const FormHeader: FC<{
  title: string
  subTitle: string
  shouldCenter?: boolean
  backTo?: any
}> = ({ title, subTitle, shouldCenter = false, backTo }) => {
  const { isDark } = useTheme()
  return (
    <AppHeader
      isDark={isDark}
      backTo={backTo}
      title={title}
      subtitle={subTitle}
      shouldCenter={shouldCenter}
      borderHidden
      noConfig
    />
  )
}
