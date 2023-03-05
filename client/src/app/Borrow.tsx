import React, { useState } from 'react'
import { utils } from 'ethers'
import { Address, useAccount, useBalance, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi'
import abi from '../utils/abi'

const ADDRESS = '0x7b766c63e3D3962E2DbC782DBE68D301604BB0c7' as const
const DAO_ADDRESS = '0xfFE5E41Cee43599CF1Ac59f9E08fE7469e29D71B'

const usePay = ({ amount } : { amount: string }) => {
  const { config } = usePrepareContractWrite({
    address: ADDRESS,
    abi,
    functionName: 'payLoan',
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

const useBorrow = ({ amount, address } : { amount: string, address: Address }) => {
  const { config } = usePrepareContractWrite({
    address: ADDRESS,
    abi,
    functionName: 'takeLoan',
    args: [utils.parseUnits(amount, 'ether'), address]
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

const Borrow = () => {
  const { address } = useAccount()
  const { isError, isLoading } = useBalance({ address })
  const [amount, setAmount] = useState('0')

   const { writeAsync: writePay, status: payStatus } = usePay({ amount })
  const { writeAsync: writeBorrow, status: borrowStatus } = useBorrow({ amount, address })

  const { data: outstanding, refetch } = useContractRead({
    address: ADDRESS,
    abi,
    functionName: 'dao_balances',
    args: [address],
    enabled: !!address,
  })

    const { data: interestRate } = useContractRead({
    address: ADDRESS,
    abi,
    functionName: 'calculateRate',
    args: [utils.parseUnits(amount, 'ether'), DAO_ADDRESS],
    enabled: !!address,
  })

  const triggerPay = async () => {
    await writePay();
    refetch();
  }

  const triggerBorrow = async () => {
    await writeBorrow();
    refetch();
  }

  return (
    <div className="w-full">
      {isLoading ? (
        <div>Fetching balance…</div>
      ) : (
        <div className="stats shadow">
          <div className="stat">
            <div className="stat-title">Interest Rate</div>
            <div className="stat-value">
              {address && interestRate && interestRate.toNumber() / 1000 + "%" || '---'} {/* replace this with algo */}
            </div>
          </div>
          <div className="stat">
            <div className="stat-title">Outstanding Balance</div>
            <div className="stat-value">
              {address ? `${utils.formatEther(outstanding ?? 0)} ETH` : '---'}
            </div>
          </div>
        </div>
      )}
      {isError ? <div>Error fetching balance</div> : null}
      <p className="mt-2">We encourage you to bridge tokens between Arbitrum and the base chain of your DAO using the Swap tab.</p>
      <div className="py-4">
        <input
          value={amount}
          type="number"
          placeholder="Amount"
          onChange={(e) => setAmount(e.target.value)}
          className=" ≈ input-bordered input-secondary input w-full max-w-xs"
        />
      </div>

      {outstanding?.gt?.(0) ? (
        <button onClick={triggerPay} className="btn-secondary btn m-4">Pay</button>
      ) : (
        <button onClick={triggerBorrow} className="btn-secondary btn m-4">Borrow</button>
      )}
    </div>
  )
}

export default Borrow
