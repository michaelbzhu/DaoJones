import React from 'react'
import { useAccount, useBalance } from 'wagmi'

const Lend = () => {
  const { address } = useAccount()
  const { data, isError, isLoading } = useBalance({
    address: '0xA0Cf798816D4b9b9866b5330EEa46a18382f251e',
  })
  return (
    <div>
      <div>
        <p>User Address</p>
        {address}
      </div>
      <div>Current USer balance</div>

      {isLoading ? (
        <div>Fetching balance…</div>
      ) : (
        <div>{data.formatted + ' ' + data.symbol}</div>
      )}
      {isError ? <div>Error fetching balance</div> : null}
      <div className="py-2">
        <input
          type="text"
          placeholder="Type here"
          className=" ≈ input-bordered input-secondary input w-full max-w-xs"
        />
      </div>
      <button>submit</button>
    </div>
  )
}

export default Lend
