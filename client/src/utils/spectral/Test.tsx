import { getSpectralScores } from '@/utils/spectral/getSpectralScores'
import { scheduleAndRequestSpectralScores } from './scheduleAndRequestSpectralScores'
import React, { useEffect, useState } from 'react'
import { whitelistedGovernorsWithDelegates } from './whitelistedGovernorsWithDelegates'

// script used to grab spectral scores for whitelisted DAOs
function Test() {
  const [data, setData] = useState(null)
  useEffect(() => {
    const getData = async () => {
      whitelistedGovernorsWithDelegates.forEach(async (governor, index) => {
        if (index === 20) {
          const wallets = governor.delegates.map(
            ({ account }) => account.address
          )
          console.log('spectral for dao', governor.name, wallets)
          // scheduleSpectralScores({ wallets }).then(() => {
          //   console.log('finished for dao', governor.name)
          // })
          const walletInfos = await getSpectralScores({ wallets })
          console.log({ name: governor.name, id: governor.id, walletInfos })
          console.log({
            wallets: wallets.length,
            walletInfos: Object.keys(walletInfos),
          })
        }
      })
    }
    getData()
  }, [])
  return <div>{data ? JSON.stringify(data) : 'loading...'}</div>
}

export default Test
