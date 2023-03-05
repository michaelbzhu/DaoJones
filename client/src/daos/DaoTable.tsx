import React, { useEffect } from 'react'
import styled from 'styled-components'
import { getGovernorsSortedByProposals } from '../utils/tally/getGovernorsSortedByProposals'
import { scheduleAndRequestSpectralScores } from '../utils/spectral/scheduleAndRequestSpectralScores'
import { daoImageMap } from '../utils/daoImageMap'
import { whitelistedGovernorsWithSpectralData } from './whitelistedGovernorsWithSpectralData'

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
// NOTE: we use DAO and Governor interchangably in the codebase
type GovernorRowData = {
  name: string
  address: string
  score: number
}

function BasicTable({ data }: { data: GovernorRowData[] }) {
  return (
    <div className=" w-full rounded-lg bg-slate-100">
      <table>
        <thead>
          <tr className=" text-slate-800">
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
                  <span className=" text-xl font-semibold text-slate-800">
                    {name}
                  </span>{' '}
                  <br />
                  <span className=" text-base font-light text-gray-600">
                    {address}
                  </span>
                </div>
              </td>
              <td className="text-2xl font-semibold text-slate-800">{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DaoTable() {
  // use precomputed data
  const governorData = whitelistedGovernorsWithSpectralData.map(
    ({ name, id, walletInfos }) => {
      const wallets = Object.keys(walletInfos)
      return {
        name,
        address: id.split(':').at(-1),
        score:
          Math.round(wallets.reduce((sum, wallet) => {
            return sum + Number(walletInfos[wallet].score)
          }, 0) / wallets.length),
      } as GovernorRowData
    }
  )

  governorData.sort((a, b) => b.score - a.score)
  const [data, setData] = React.useState(governorData)

  // use to get data live at runtime
  useEffect(() => {
    const updateTableData = async () => {
      const governors = await getGovernorsSortedByProposals({
        numberOfGovs: 20,
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
      console.log({ tableData })
      tableData.sort((a, b) => b.score - a.score)
      setData(tableData)
    }
  }, [])

  return (
    <Styles>{data ? <BasicTable data={data} /> : <p>'loading...'</p>}</Styles>
  )
}

export default DaoTable
