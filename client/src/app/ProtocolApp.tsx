/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import Borrow from './Borrow'
import Lend from './Lend'

type Tab = 'lend' | 'borrow'

const ProtocolApp = () => {
  const [tab, setTab] = useState<Tab>('lend')

  return (
    <div className=" mx-auto h-1/2 w-1/2 rounded-md bg-slate-700">
      <div className="tabs justify-center">
        <a
          className={`tab-bordered tab tab-lg  ${
            tab === 'lend' ? 'tab-active' : ''
          }`}
          onClick={() => {
            setTab('lend')
          }}
        >
          Lend
        </a>
        <a
          className={`tab-bordered tab tab-lg  ${
            tab === 'borrow' ? 'tab-active' : ''
          }`}
          onClick={() => {
            setTab('borrow')
          }}
        >
          Borrow
        </a>
      </div>
      <div className="flex justify-center py-5">
        {tab === 'borrow' ? <Borrow /> : <Lend />}
      </div>
    </div>
  )
}

export default ProtocolApp
