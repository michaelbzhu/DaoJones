import { gql } from '@apollo/client'
import client from './apollo-client'
import { Governor } from './types'
import { whitelistedGovernors } from './whitelistedGovernors'

export const getWhitelistedGovernors = async ({
  maxDelegatesPerGov,
}: {
  maxDelegatesPerGov: number
}): Promise<Governor[]> => {
  const whitelistedIds = whitelistedGovernors.map(({ id }) => id)
  console.log({ whitelistedIds })
  const { data } = await client.query({
    query: gql`
      query Governors(
        $ids: [AccountID!]
        $delegateSort: DelegateSort
        $delegatePagination: Pagination
      ) {
        governors(ids: $ids) {
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
      ids: whitelistedIds,
      delegateSort: { field: 'VOTING_WEIGHT', order: 'DESC' },
      delegatePagination: { limit: maxDelegatesPerGov, offset: 0 },
    },
  })
  console.log('tally graph ql', data)
  return data.governors
}
