import React from 'react'
import { useAccount, useBalance } from 'wagmi'

const Lend = () => {
  const { address } = useAccount()
  const { data, isError, isLoading } = useBalance({ address })
  return (
    <div className="w-full">
      {isLoading ? (
        <div>Fetching balance…</div>
      ) : (
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Account balance</div>
            <div className="stat-value">
              {data.formatted + ' ' + data.symbol}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Lending @ 2.00%</div>
            <div className="stat-value">1.123 ETH</div>
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
      <div className="flex justify-center">
        <button className="btn-secondary btn m-4">Lend</button>
        <button className="btn-secondary btn m-4">Withdraw</button>
      </div>
    </div>
  )
}

export default Lend
