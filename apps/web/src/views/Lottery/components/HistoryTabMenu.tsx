import { useTranslation } from '@pancakeswap/localization'
import { ButtonMenu, ButtonMenuItem } from '@pancakeswap/uikit'

const HistoryTabMenu = ({ setActiveIndex, activeIndex }) => {
  const { t } = useTranslation()

  return (
    <ButtonMenu activeIndex={activeIndex} onItemClick={setActiveIndex} scale="sm" variant="lightBlue">
      <ButtonMenuItem>{t('All History')}</ButtonMenuItem>
      <ButtonMenuItem>{t('Your History')}</ButtonMenuItem>
    </ButtonMenu>
  )
}

export default HistoryTabMenu
