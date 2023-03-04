import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useTable } from 'react-table'
import { getGovernors } from '../utils/tally/getGovernors'
import { scheduleAndRequestSpectralScores } from '../utils/spectral/scheduleAndRequestSpectralScores'

const Styles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }
  }
`

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
        accessor: 'dao',
      },
      {
        Header: 'Score',
        accessor: 'score',
      },
    ],
    []
  )

  const [tableData, setTableData] = React.useState([
    { dao: 'DAO1', score: 650 },
    { dao: 'DAO1', score: 650 },
  ])

  const data = React.useMemo(() => tableData, [tableData])

  useEffect(() => {
    const updateTableData = async () => {
      const governors = await getGovernors({
        numberOfGovs: 10,
        maxDelegatesPerGov: 2,
      })
      console.log({ governors })

      const tableData = []
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
              dao: governor.name,
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
    <Styles>
      <Table columns={columns} data={data} />
    </Styles>
  )
}

export default GovernorTable
