import { NextApiRequest, NextApiResponse } from "next";
import { gql } from "@apollo/client";
import client from "./apollo-client";

const handler = async (_req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data } = await client.query({
      query: gql`
        query Governors(
          $chainIds: [ChainID!]
          $pagination: Pagination
          $sort: GovernorSort
        ) {
          governors(chainIds: $chainIds, pagination: $pagination, sort: $sort) {
            id
            name
            delegates {
              account {
                address
              }
            }
            proposalStats {
              total
            }
          }
        }
      `,
      variables: {
        sort: { field: "TOTAL_PROPOSALS", order: "DESC" },
        pagination: { limit: 10, offset: 0 },
      },
    });
    console.log("tally graph ql", data);

    res.status(200).json(data);
  } catch (err: any) {
    res.status(500).json({ statusCode: 500, message: err.message });
  }
};

export default handler;
