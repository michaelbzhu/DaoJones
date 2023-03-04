import { gql } from '@apollo/client'
import client from './apollo-client'

// sample return object from tally api
// governors: [
//     {
//       __typename: 'Governor',
//       id: 'eip155:1:0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
//       name: 'Nouns Dao',
//       delegates: [Array],
//       proposalStats: [Object]
//     },
//     {
//       __typename: 'Governor',
//       id: 'eip155:4:0xE108cdBc1eE0F775D93C12C071a1F97d94Ad7811',
//       name: 'veggieDAO',
//       delegates: [Array],
//       proposalStats: [Object]
//     }
//   ]

type Delegate = {
  account: {
    address: string
  }
}

type Governor = {
  id: string
  name: string
  delegates: Delegate[]
}

/**
 *
 * @param numberOfGovs number of governor contracts to query for from tally; sorted by number of total proposals
 * @param maxDelegatesPerGov maximum number of delegates per governor contract to query for, sorted by voting weight
 *
 * recommend 10 for maxDelegatesPerGov (we can get rate-limited by spectral api if we request data for too many wallets)
 */
export const getGovernors = async ({
  numberOfGovs,
  govOffset,
  maxDelegatesPerGov,
}: {
  numberOfGovs: number
  govOffset?: number
  maxDelegatesPerGov: number
}): Promise<Governor[]> => {
  const { data } = await client.query({
    query: gql`
      query Governors(
        $chainIds: [ChainID!]
        $govPagination: Pagination
        $sort: GovernorSort
        $delegateSort: DelegateSort
        $delegatePagination: Pagination
      ) {
        governors(
          chainIds: $chainIds
          pagination: $govPagination
          sort: $sort
        ) {
          id
          name
          delegates(sort: $delegateSort, pagination: $delegatePagination) {
            account {
              address
            }
          }
        }
      }
    `,
    variables: {
      sort: { field: 'TOTAL_PROPOSALS', order: 'DESC' },
      govPagination: { limit: numberOfGovs, offset: govOffset ?? 0 },
      delegateSort: { field: 'VOTING_WEIGHT', order: 'DESC' },
      delegatePagination: { limit: maxDelegatesPerGov, offset: 0 },
    },
  })

  console.log('tally graph ql', data)
  return data.governors
}
