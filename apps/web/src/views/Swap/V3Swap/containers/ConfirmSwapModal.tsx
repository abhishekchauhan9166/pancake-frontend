import { ChainId } from '@pancakeswap/chains'
import { Currency, CurrencyAmount, Token } from '@pancakeswap/sdk'
import { memo, useCallback, useMemo } from 'react'

import { useTranslation } from '@pancakeswap/localization'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import { Box, BscScanIcon, Flex, InjectedModalProps, Link } from '@pancakeswap/uikit'
import { formatAmount } from '@pancakeswap/utils/formatFractions'
import truncateHash from '@pancakeswap/utils/truncateHash'
import {
  ApproveModalContentV1,
  SwapPendingModalContentV1,
  SwapTransactionReceiptModalContentV1,
} from '@pancakeswap/widgets-internal'
import { getBlockExploreLink, getBlockExploreName } from 'utils'
import { wrappedCurrency } from 'utils/wrappedCurrency'

import { useDebounce } from '@pancakeswap/hooks'
import { useUserSlippage } from '@pancakeswap/utils/user'
import AddToWalletButton, { AddToWalletTextOptions } from 'components/AddToWallet/AddToWalletButton'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApprovalState } from 'hooks/useApproveCallback'
import { Field } from 'state/swap/actions'
import { useSwapState } from 'state/swap/hooks'
import { InterfaceOrder, isMMOrder, isXOrder } from 'views/Swap/utils'
import { ConfirmModalStateV1, PendingConfirmModalStateV1 } from '../types'

import ConfirmSwapModalContainer from '../../components/ConfirmSwapModalContainer'
import { SwapTransactionErrorContent } from '../../components/SwapTransactionErrorContent'
import { TransactionConfirmSwapContent } from '../components'
import { useWallchainStatus } from '../hooks/useWallchain'
import { ApproveStepFlow } from './ApproveStepFlow'

interface ConfirmSwapModalProps {
  // isMM?: boolean
  isRFQReady?: boolean
  order?: InterfaceOrder | null
  originalOrder?: InterfaceOrder | null
  currencyBalances: { [field in Field]?: CurrencyAmount<Currency> }
  attemptingTxn: boolean
  txHash?: string
  approval: ApprovalState
  swapErrorMessage?: string | boolean
  showApproveFlow: boolean
  confirmModalState: ConfirmModalStateV1
  startSwapFlow: () => void
  pendingModalSteps: PendingConfirmModalStateV1[]
  currentAllowance?: CurrencyAmount<Currency>
  onAcceptChanges: () => void
  customOnDismiss?: () => void
  openSettingModal?: () => void
}

export const ConfirmSwapModal = memo<InjectedModalProps & ConfirmSwapModalProps>(function ConfirmSwapModalComp({
  order,
  txHash,
  confirmModalState,
  startSwapFlow,
  pendingModalSteps,
  isRFQReady,
  attemptingTxn,
  originalOrder,
  showApproveFlow,
  currencyBalances,
  swapErrorMessage,
  onDismiss,
  onAcceptChanges,
  customOnDismiss,
  openSettingModal,
}) {
  const { chainId } = useActiveChainId()
  const { t } = useTranslation()
  const [allowedSlippage] = useUserSlippage()
  const { recipient } = useSwapState()
  const [wallchainStatus] = useWallchainStatus()
  const isBonus = useDebounce(wallchainStatus === 'found', 500)

  const token: Token | undefined = wrappedCurrency(order?.trade?.outputAmount?.currency, chainId)

  const showAddToWalletButton = useMemo(() => {
    if (token && order?.trade?.outputAmount?.currency) {
      return !order?.trade?.outputAmount?.currency?.isNative
    }
    return false
  }, [token, order])

  const handleDismiss = useCallback(() => {
    if (customOnDismiss) {
      customOnDismiss?.()
    }
    onDismiss?.()
  }, [customOnDismiss, onDismiss])

  const topModal = useMemo(() => {
    const currencyA = currencyBalances.INPUT?.currency ?? order?.trade?.inputAmount?.currency
    const currencyB = currencyBalances.OUTPUT?.currency ?? order?.trade?.outputAmount?.currency
    const amountA = formatAmount(order?.trade?.inputAmount, 6) ?? ''
    const amountB = formatAmount(order?.trade?.outputAmount, 6) ?? ''

    if (confirmModalState === ConfirmModalStateV1.RESETTING_APPROVAL) {
      return (
        <ApproveModalContentV1
          title={t('Reset Approval on USDT')}
          isX={isXOrder(order)}
          isMM={isMMOrder(order)}
          isBonus={isBonus}
        />
      )
    }

    if (
      showApproveFlow &&
      (confirmModalState === ConfirmModalStateV1.APPROVING_TOKEN ||
        confirmModalState === ConfirmModalStateV1.APPROVE_PENDING)
    ) {
      return (
        <ApproveModalContentV1
          title={t('Enable spending %symbol%', { symbol: `${order?.trade?.inputAmount?.currency?.symbol}` })}
          isX={isXOrder(order)}
          isMM={isMMOrder(order)}
          isBonus={isBonus}
        />
      )
    }

    if (swapErrorMessage) {
      return (
        <Flex width="100%" alignItems="center" height="calc(430px - 73px - 120px)">
          <SwapTransactionErrorContent
            message={swapErrorMessage}
            onDismiss={handleDismiss}
            openSettingModal={openSettingModal}
          />
        </Flex>
      )
    }

    if (attemptingTxn) {
      return (
        <SwapPendingModalContentV1
          title={t('Confirm Swap')}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
        />
      )
    }

    if (confirmModalState === ConfirmModalStateV1.PENDING_CONFIRMATION) {
      return (
        <SwapPendingModalContentV1
          showIcon
          title={t('Transaction Submitted')}
          currencyA={currencyA}
          currencyB={currencyB}
          amountA={amountA}
          amountB={amountB}
        >
          {showAddToWalletButton && (
            <AddToWalletButton
              mt="39px"
              height="auto"
              variant="tertiary"
              width="fit-content"
              padding="6.5px 20px"
              marginTextBetweenLogo="6px"
              textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
              tokenAddress={token?.address}
              tokenSymbol={currencyB?.symbol}
              tokenDecimals={token?.decimals}
              tokenLogo={token instanceof WrappedTokenInfo ? token?.logoURI : undefined}
            />
          )}
        </SwapPendingModalContentV1>
      )
    }

    if (confirmModalState === ConfirmModalStateV1.COMPLETED && txHash) {
      return (
        <SwapTransactionReceiptModalContentV1>
          {chainId && (
            <Link external small href={getBlockExploreLink(txHash, 'transaction', chainId)}>
              {t('View on %site%', { site: getBlockExploreName(chainId) })}: {truncateHash(txHash, 8, 0)}
              {chainId === ChainId.BSC && <BscScanIcon color="primary" ml="4px" />}
            </Link>
          )}
          {showAddToWalletButton && (
            <AddToWalletButton
              mt="39px"
              height="auto"
              variant="tertiary"
              width="fit-content"
              padding="6.5px 20px"
              marginTextBetweenLogo="6px"
              textOptions={AddToWalletTextOptions.TEXT_WITH_ASSET}
              tokenAddress={token?.address}
              tokenSymbol={currencyB?.symbol}
              tokenDecimals={token?.decimals}
              tokenLogo={token instanceof WrappedTokenInfo ? token?.logoURI : undefined}
            />
          )}
        </SwapTransactionReceiptModalContentV1>
      )
    }

    return (
      <TransactionConfirmSwapContent
        order={order}
        recipient={recipient}
        isRFQReady={isRFQReady}
        originalOrder={originalOrder}
        allowedSlippage={allowedSlippage}
        currencyBalances={currencyBalances}
        onConfirm={startSwapFlow}
        onAcceptChanges={onAcceptChanges}
      />
    )
  }, [
    currencyBalances,
    confirmModalState,
    showApproveFlow,
    swapErrorMessage,
    attemptingTxn,
    txHash,
    order,
    recipient,
    isRFQReady,
    originalOrder,
    allowedSlippage,
    startSwapFlow,
    onAcceptChanges,
    t,
    isBonus,
    handleDismiss,
    openSettingModal,
    showAddToWalletButton,
    token,
    chainId,
  ])

  const isShowingLoadingAnimation = useMemo(
    () =>
      confirmModalState === ConfirmModalStateV1.RESETTING_APPROVAL ||
      confirmModalState === ConfirmModalStateV1.APPROVING_TOKEN ||
      confirmModalState === ConfirmModalStateV1.APPROVE_PENDING ||
      attemptingTxn,
    [confirmModalState, attemptingTxn],
  )

  if (!chainId) return null

  return (
    <ConfirmSwapModalContainer
      minHeight="415px"
      width={['100%', '100%', '100%', '367px']}
      hideTitleAndBackground={confirmModalState !== ConfirmModalStateV1.REVIEWING || Boolean(swapErrorMessage)}
      headerPadding={isShowingLoadingAnimation ? '12px 24px 0px 24px !important' : '12px 24px'}
      bodyPadding={isShowingLoadingAnimation ? '0 24px 24px 24px' : '24px'}
      bodyTop={isShowingLoadingAnimation ? '-15px' : '0'}
      handleDismiss={handleDismiss}
    >
      <Box>{topModal}</Box>
      {isShowingLoadingAnimation && !swapErrorMessage && (
        <ApproveStepFlow confirmModalState={confirmModalState} pendingModalSteps={pendingModalSteps} />
      )}
    </ConfirmSwapModalContainer>
  )
})
