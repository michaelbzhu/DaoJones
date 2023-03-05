import React, { useEffect, useState } from 'react'
import { getWhitelistedGovernors } from './getWhitelistedGovernors'
function Test() {
  const [data, setData] = useState(null)
  useEffect(() => {
    const getData = async () => {
      const governors = await getWhitelistedGovernors({
        maxDelegatesPerGov: 25,
      })
      setData(governors)
    }
    getData()
  }, [])
  return <div>{data ? JSON.stringify(data) : 'loading...'}</div>
}

export default Test
