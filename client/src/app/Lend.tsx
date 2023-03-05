import React from 'react'
import { useAccount, useBalance } from 'wagmi'

const Lend = () => {
  const { address } = useAccount()
  const { data, isError, isLoading } = useBalance({ address })
  return (
    <div className="w-80">
      {isLoading ? (
        <div>Fetching balance…</div>
      ) : (
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Account Balance</div>
            <div className="stat-value">
              {data.formatted + ' ' + data.symbol}
            </div>
          </div>
        </div>
      )}
      {isError ? <div>Error fetching balance</div> : null}
      <div className="py-4">
        <input
          type="number"
          placeholder="Amount"
          className=" ≈ input-bordered input-secondary input w-full max-w-xs"
        />
      </div>
      <button className="btn-secondary btn">Lend</button>
    </div>
  )
}

export default Lend
