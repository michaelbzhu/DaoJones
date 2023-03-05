import React, { useState } from 'react'
import { useAccount, useBalance } from 'wagmi'

const Borrow = () => {
  const { address } = useAccount()
  const { data, isError, isLoading } = useBalance({ address })

  const [outstanding, setOutstanding] = useState(20.5)

  return (
    <div className="w-full">
      {isLoading ? (
        <div>Fetching balance…</div>
      ) : (
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Interest Rate</div>
            <div className="stat-value">
              2.50% {/* replace this with algo */}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Outstanding Balance</div>
            <div className="stat-value">{`${outstanding} ETH`}</div>
          </div>
        </div>
      )}
      {isError ? <div>Error fetching balance</div> : null}
      <div className="mt-8 py-4">
        <input
          type="number"
          placeholder="Amount"
          className=" ≈ input-bordered input-secondary input w-full max-w-xs"
        />
      </div>

      {outstanding !== 0 ? (
        <button className="btn-secondary btn m-4">Pay</button>
      ) : (
        <button className="btn-secondary btn m-4">Borrow</button>
      )}
    </div>
  )
}

export default Borrow
