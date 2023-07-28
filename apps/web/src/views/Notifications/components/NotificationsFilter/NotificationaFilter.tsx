import { useTranslation } from '@pancakeswap/localization'
import { AutoRow, OptionProps, Select, Text } from '@pancakeswap/uikit'
import { NotificationFilterTypes, NotificationSortTypes } from 'views/Notifications/constants'
import { FilterContainer, LabelWrapper } from 'views/Notifications/styles'

const NotificationsFilter = ({
  setNotifyFilterType,
  setSortType,
}: {
  setNotifyFilterType: (option: OptionProps) => void
  setSortType: (option: OptionProps) => void
}) => {
  const { t } = useTranslation()
  return (
    <AutoRow gap="12px" marginTop="8px" marginBottom="16px" marginRight="8px">
      <FilterContainer>
        <LabelWrapper style={{ width: '120px' }}>
          <Text textTransform="uppercase" mb="4px" ml="4px">
            {t('Filter by type')}
          </Text>
          <Select onOptionChange={setNotifyFilterType} options={NotificationFilterTypes} />
        </LabelWrapper>
      </FilterContainer>
      <FilterContainer>
        <LabelWrapper style={{ width: '100px' }}>
          <Text textTransform="uppercase" mb="4px" ml="4px">
            {t('Sort by date')}
          </Text>
          <Select onOptionChange={setSortType} options={NotificationSortTypes} />
        </LabelWrapper>
      </FilterContainer>
    </AutoRow>
  )
}

export default NotificationsFilter