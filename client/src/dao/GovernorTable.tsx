import React, { useEffect } from 'react'
import styled from 'styled-components'
import { getGovernors } from '../tally/getGovernors'
import { scheduleAndRequestSpectralScores } from '../spectral/scheduleAndRequestSpectralScores'
import { daoImageMap } from '../utils/daoImageMap'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    width: 100%;

    th {
      margin: 0;
      padding: 1rem;
      border-bottom: 1px solid black;
      text-align: left;
    }

    td {
      margin: 0;
      padding: 1rem;
      border-bottom: 1px solid gray;
    }
  }
`

type GovernorRowData = {
  name: string
  address: string
  score: number
}

function BasicTable({ data }: { data: GovernorRowData[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Governor Contract</th>
          <th>Credit Score</th>
        </tr>
      </thead>
      <tbody>
        {data.map(({ name, address, score }) => (
          <tr key={address}>
            <td className="flex align-middle">
              <img
                src={`${daoImageMap[address] ?? '/default.webp'}`}
                alt={`${name}`}
                width={50}
                className=" mr-3 h-max rounded-full  p-1"
              />
              <div>
                <span className=" text-xl font-semibold">{name}</span> <br />
                <span className=" text-base font-light text-gray-600">
                  {address}
                </span>
              </div>
            </td>
            <td className="text-2xl font-semibold">{score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function GovernorTable() {
  const [tableData, setTableData] = React.useState(null)

  const data = React.useMemo(() => tableData, [tableData])

  useEffect(() => {
    const updateTableData = async () => {
      const governors = await getGovernors({
        numberOfGovs: 10,
        maxDelegatesPerGov: 2,
      })
      console.log({ governors })

      const tableData: GovernorRowData[] = []
      const promiseArrForEachDAO = []
      governors.forEach(async (governor) => {
        promiseArrForEachDAO.push(
          scheduleAndRequestSpectralScores({
            wallets: governor.delegates.map(
              (delegate) => delegate.account.address
            ),
          }).then(({ walletInfos }) => {
            const wallets = Object.keys(walletInfos)
            tableData.push({
              name: governor.name,
              address: governor.id.split(':').at(-1),
              score:
                wallets.reduce((sum, wallet) => {
                  return sum + Number(walletInfos[wallet].score)
                }, 0) / wallets.length,
            })
          })
        )
      })

      await Promise.all(promiseArrForEachDAO)
      tableData.sort((a, b) => b.score - a.score)
      setTableData(tableData)
    }

    updateTableData()
  }, [])

  return (
    <Styles>{data ? <BasicTable data={data} /> : <p>'loading...'</p>}</Styles>
  )
}

export default GovernorTable
