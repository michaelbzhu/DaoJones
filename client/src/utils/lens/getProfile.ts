import { gql } from '@apollo/client'
import client from './apollo-client'

export const getProfileQuery = gql`
query Profile($id: ProfileId!) {
  profile(request: { profileId: $id }) {
    id
    name
    bio
    picture {
      ... on MediaSet {
        original {
          url
        }
      }
    }
    handle
  }
}`

export type LensProfile = {
  bio: string,
  handle: string,
  id: string,
  name: string,
  picture: {
    original: {
      url: string,
    }
  }
}

export const getProfile = async ({ id }: { id: string }): Promise<LensProfile> => {
  const { data } = await client.query({
    query: getProfileQuery,
    variables: { id },
  })

  console.log('GRAPHQL: Lens Profile', data)
  return data.profile
}
