/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { Swap } from '@swing.xyz/ui'
import Borrow from './Borrow'
import Lend from './Lend'

import '@swing.xyz/ui/theme.css'

type Tab = 'lend' | 'borrow' | 'swap'

const ProtocolApp = () => {
  const [tab, setTab] = useState<Tab>('lend')

  return (
    <div className="mx-auto h-1/2 w-1/2 rounded-md bg-slate-700">
      <div className="tabs justify-center mx-auto">
        <a
          className={`tab-bordered tab tab-lg  ${tab === 'lend' ? 'tab-active' : ''
            }`}
          onClick={() => {
            setTab('lend')
          }}
        >
          Lend
        </a>
        <a
          className={`tab-bordered tab tab-lg  ${tab === 'borrow' ? 'tab-active' : ''
            }`}
          onClick={() => {
            setTab('borrow')
          }}
        >
          Borrow
        </a>
        <a
          className={`tab-bordered tab tab-lg  ${tab === 'swap' ? 'tab-active' : ''
            }`}
          onClick={() => {
            setTab('swap')
          }}
        >
          Swap
        </a>
      </div>
      <div className="flex w-full min-w-full justify-center py-8 text-center">
        {tab === 'lend' && <Lend />}
        {tab === 'borrow' && <Borrow />}
        {tab === 'swap' && <Swap />}
      </div>
    </div>
  )
}

export default ProtocolApp
