import { InterfaceOrder, isMMOrder } from 'views/Swap/utils'
import { MMCommitButton } from './MMCommitButton'
import { MMCommitButtonV2 } from './MMCommitButtonV2'
import { SwapCommitButton } from './SwapCommitButton'
import { SwapCommitButtonV2 } from './SwapCommitButtonV2'

export type CommitButtonProps = {
  order: InterfaceOrder | undefined
  // trade: Trade | MMCommitTrade<SmartRouterTrade<TradeType>> | undefined
  tradeError?: Error | null
  tradeLoaded: boolean
  beforeCommit?: () => void
  afterCommit?: () => void
  useUniversalRouter?: boolean
}

export const CommitButton: React.FC<CommitButtonProps> = ({
  useUniversalRouter,
  order,
  tradeError,
  tradeLoaded,
  beforeCommit,
  afterCommit,
}) => {
  if (isMMOrder(order)) {
    return useUniversalRouter ? (
      <MMCommitButtonV2 order={order} beforeCommit={beforeCommit} afterCommit={afterCommit} />
    ) : (
      <MMCommitButton order={order} />
    )
  }

  return useUniversalRouter ? (
    <SwapCommitButtonV2
      order={order}
      tradeError={tradeError}
      tradeLoading={!tradeLoaded}
      beforeCommit={beforeCommit}
      afterCommit={afterCommit}
    />
  ) : (
    <SwapCommitButton order={order} tradeError={tradeError} tradeLoading={!tradeLoaded} />
  )
}
