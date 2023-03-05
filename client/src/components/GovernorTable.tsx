import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
import { getGovernors } from '../utils/tally/getGovernors'
import { scheduleAndRequestSpectralScores } from '../utils/spectral/scheduleAndRequestSpectralScores'

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
          <tr>
            <td>
              <span className=" text-xl font-semibold">{name}</span> <br />{' '}
              <span className=" text-base font-light text-gray-600">
                {address}
              </span>
            </td>
            <td className="text-2xl font-semibold">{score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    })

  // Render the UI for your table
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th {...column.getHeaderProps()}>{column.render('Header')}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
              })}
            </tr>
          )
        })}{' '}
      </tbody>
    </table>
  )
}

function GovernorTable() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Address',
        accessor: 'address',
      },
      {
        Header: 'Score',
        accessor: 'score',
      },
    ],
    []
  )

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
      setTableData(tableData)
    }

    updateTableData()
  }, [])

  return (
    <Styles>{data ? <BasicTable data={data} /> : <p>'loading...'</p>}</Styles>
  )
}

export default GovernorTable
