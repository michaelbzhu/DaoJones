import React, {useEffect, useState} from 'react'
import { utils } from 'ethers'
import { useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import abi from '../utils/abi'

const ADDRESS = '0x7b766c63e3D3962E2DbC782DBE68D301604BB0c7' as const

const useLend = ({ amount } : { amount: string }) => {
  const { config } = usePrepareContractWrite({
    address: ADDRESS,
    abi,
    functionName: 'deposit',
    overrides: {
      value: utils.parseUnits(amount, 'ether'),
    }
  })
  const { data, isLoading, isSuccess, writeAsync, status } = useContractWrite(config)
  return {
    data,
    isLoading,
    isSuccess,
    writeAsync,
    status
  }
}

const useWithdraw = ({ amount } : { amount: string }) => {
  const { config } = usePrepareContractWrite({
    address: ADDRESS,
    abi,
    functionName: 'withdraw',
    args: [utils.parseUnits(amount, 'ether')]
  })
  const { data, isLoading, isSuccess, writeAsync, status } = useContractWrite(config)
  return {
    data,
    isLoading,
    isSuccess,
    writeAsync,
    status
  }
}

const Lend = () => {
  const { address } = useAccount()
  const { data, isError, isLoading } = useBalance({ address })
  const [amount, setAmount] = useState('0')

  const { writeAsync: writeLend } = useLend({ amount })
  const { writeAsync: writeWithdraw } = useWithdraw({ amount })

  const { data: lockedBalance, refetch } = useContractRead({
    address: ADDRESS,
    abi,
    functionName: 'user_balances',
    args: [address],
    enabled: !!address,
  })

  const triggerLend = async () => {
    await writeLend();
    refetch();
  }

  const triggerWithdraw = async () => {
    await writeWithdraw();
    refetch();
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div>Fetching balance…</div>
      ) : (
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Account Balance</div>
            <div className="stat-value">
              {address ? `${data.formatted + ' ' + data.symbol}` : '---'}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Amount Lent</div>
            <div className="stat-value">{address ? utils.formatEther(lockedBalance ?? 0) : '---'} {data.symbol}</div>
          </div>
        </div>
      )}
      <p className="mt-2">We encourage you to bridge tokens to Arbitrum using the Swap tab.</p>
      {isError ? <div>Error fetching balance</div> : null}
      <div className="py-4">
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          type="number"
          placeholder="Amount"
          className=" ≈ input-bordered input-secondary input w-full max-w-xs"
        />
      </div>
      <div className="flex justify-center">
        <button onClick={triggerLend} className="btn-secondary btn m-4">Lend</button>
        <button onClick={triggerWithdraw} className="btn-secondary btn m-4">Withdraw</button>
      </div>
    </div>
  )
}

export default Lend
