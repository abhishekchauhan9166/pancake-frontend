import { useTranslation } from '@pancakeswap/localization'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { Button, useModal } from '@pancakeswap/uikit'
import { useExpertMode } from '@pancakeswap/utils/user'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import SettingsModal, { withCustomOnDismiss } from 'components/Menu/GlobalSettings/SettingsModal'
import { SettingsMode } from 'components/Menu/GlobalSettings/types'
import { useActiveChainId } from 'hooks/useActiveChainId'
import { ApprovalState } from 'hooks/useApproveCallback'
import { WrapType } from 'hooks/useWrapCallback'
import { useCallback, useEffect, useState } from 'react'
import { Field } from 'state/swap/actions'
import { logGTMClickSwapEvent } from 'utils/customGTMEventTracking'
import { parseMMError } from 'views/Swap/MMLinkPools/utils/exchange'
import { ConfirmSwapModal } from 'views/Swap/V3Swap/containers/ConfirmSwapModal'
import { useConfirmModalState } from 'views/Swap/V3Swap/hooks/useConfirmModalState'
import { MMOrder } from 'views/Swap/utils'
import { useSwapCallArguments } from '../hooks/useSwapCallArguments'
import { useSwapCallback } from '../hooks/useSwapCallback'

const SettingsModalWithCustomDismiss = withCustomOnDismiss(SettingsModal)

interface SwapCommitButtonPropsType<SendTransactionReturnType> {
  swapIsUnsupported: boolean
  account: string | undefined
  showWrap: boolean
  wrapInputError: string | undefined
  onWrap?: () => Promise<void>
  wrapType: WrapType
  approval: ApprovalState
  approveCallback: () => Promise<SendTransactionReturnType>
  revokeCallback: () => Promise<SendTransactionReturnType>
  approvalSubmitted: boolean
  currencies: {
    INPUT?: Currency
    OUTPUT?: Currency
  }
  isExpertMode: boolean
  swapInputError?: string
  currencyBalances: {
    INPUT?: CurrencyAmount<Currency>
    OUTPUT?: CurrencyAmount<Currency>
  }
  recipient: string | null
  onUserInput: (field: Field, typedValue: string) => void
  order: MMOrder
  isPendingError: boolean
  currentAllowance: CurrencyAmount<Currency> | undefined
}

export function MMSwapCommitButton<SendTransactionReturnType>({
  order,
  swapIsUnsupported,
  account,
  showWrap,
  wrapInputError,
  onWrap,
  wrapType,
  approval,
  approveCallback,
  revokeCallback,
  approvalSubmitted,
  swapInputError,
  currencyBalances,
  recipient,
  onUserInput,
  isPendingError,
  currentAllowance,
}: SwapCommitButtonPropsType<SendTransactionReturnType>) {
  const { chainId } = useActiveChainId()

  const [isExpertMode] = useExpertMode()

  const { t } = useTranslation()
  // the callback to execute the swap

  // @ts-ignore
  const swapCalls = useSwapCallArguments(rfqTrade.trade, rfqTrade.rfq, recipient)

  const { callback: swapCallback, error: swapCallbackError } = useSwapCallback(
    order.mmRFQTrade?.trade,
    recipient,
    // @ts-ignore
    swapCalls,
  )
  const [{ tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    tradeToConfirm?: MMOrder | null
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })

  // Handlers
  const handleSwap = useCallback(async () => {
    if (!swapCallback) {
      return undefined
    }
    setSwapState({ attemptingTxn: true, tradeToConfirm, swapErrorMessage: undefined, txHash: undefined })
    return swapCallback()
      .then((result) => {
        setSwapState({ attemptingTxn: false, tradeToConfirm, swapErrorMessage: undefined, txHash: result.hash })
      })
      .catch((error) => {
        console.error('handleSwap error', error)

        setSwapState({
          attemptingTxn: false,
          tradeToConfirm,
          swapErrorMessage: error.message,
          txHash: undefined,
        })
      })
  }, [swapCallback, tradeToConfirm, setSwapState])

  const handleAcceptChanges = useCallback(() => {
    setSwapState({ tradeToConfirm: order, swapErrorMessage, txHash, attemptingTxn })
  }, [attemptingTxn, swapErrorMessage, order, txHash, setSwapState])

  const handleConfirmDismiss = useCallback(() => {
    setSwapState({ tradeToConfirm, attemptingTxn, swapErrorMessage, txHash })
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '')
    }
  }, [attemptingTxn, onUserInput, swapErrorMessage, tradeToConfirm, txHash, setSwapState])

  // End Handlers

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  // Modals
  const [indirectlyOpenConfirmModalState, setIndirectlyOpenConfirmModalState] = useState(false)

  const [onPresentSettingsModal] = useModal(
    <SettingsModalWithCustomDismiss
      customOnDismiss={() => setIndirectlyOpenConfirmModalState(true)}
      mode={SettingsMode.SWAP_LIQUIDITY}
    />,
  )

  const { confirmModalState, pendingModalSteps, startSwapFlow, resetSwapFlow } = useConfirmModalState({
    txHash,
    chainId,
    approval,
    approvalToken: order.mmRFQTrade?.trade?.inputAmount.currency,
    isPendingError,
    isExpertMode,
    currentAllowance,
    approveCallback,
    revokeCallback,
    onConfirm: handleSwap,
  })

  const [onPresentConfirmModal] = useModal(
    <ConfirmSwapModal
      order={order} // show the info while refresh RFQ
      txHash={txHash}
      approval={approval}
      attemptingTxn={attemptingTxn}
      confirmModalState={confirmModalState}
      pendingModalSteps={pendingModalSteps}
      startSwapFlow={startSwapFlow}
      originalOrder={tradeToConfirm}
      showApproveFlow={showApproveFlow}
      currencyBalances={currencyBalances}
      isRFQReady={Boolean(order.mmRFQTrade?.rfq) && !order.mmRFQTrade?.isLoading}
      currentAllowance={currentAllowance}
      swapErrorMessage={swapErrorMessage || (!order.mmRFQTrade?.trade && t('Unable request a quote'))}
      onAcceptChanges={handleAcceptChanges}
      customOnDismiss={handleConfirmDismiss}
      openSettingModal={onPresentSettingsModal}
    />,
    true,
    true,
    'MMconfirmSwapModal',
  )
  // End Modals

  const onSwapHandler = useCallback(() => {
    setSwapState({
      tradeToConfirm: order,
      attemptingTxn: false,
      swapErrorMessage: undefined,
      txHash: undefined,
    })
    resetSwapFlow()
    if (isExpertMode) {
      startSwapFlow()
    }
    onPresentConfirmModal()
    logGTMClickSwapEvent()
  }, [order, resetSwapFlow, isExpertMode, onPresentConfirmModal, startSwapFlow])

  // useEffect
  useEffect(() => {
    if (indirectlyOpenConfirmModalState) {
      setIndirectlyOpenConfirmModalState(false)
      setSwapState((state) => ({
        ...state,
        swapErrorMessage: undefined,
      }))
      onPresentConfirmModal()
    }
  }, [indirectlyOpenConfirmModalState, onPresentConfirmModal, setSwapState])

  if (swapIsUnsupported) {
    return (
      <Button width="100%" disabled>
        {t('Unsupported Asset')}
      </Button>
    )
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  if (showWrap) {
    return (
      <CommitButton
        width="100%"
        disabled={Boolean(wrapInputError)}
        onClick={onWrap}
        data-dd-action-name="Swap wrap button"
      >
        {wrapInputError ?? (wrapType === WrapType.WRAP ? t('Wrap') : wrapType === WrapType.UNWRAP ? t('Unwrap') : null)}
      </CommitButton>
    )
  }

  const isValid = !swapInputError

  return (
    <CommitButton
      width="100%"
      id="swap-button"
      variant="primary"
      disabled={!order.mmRFQTrade?.rfq || !isValid || !!swapCallbackError}
      onClick={onSwapHandler}
      data-dd-action-name="Swap mm commit button"
    >
      {parseMMError(swapInputError) || t('Swap')}
    </CommitButton>
  )
}
