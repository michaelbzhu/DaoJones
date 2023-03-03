import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import client from "./api/tally/apollo-client";
import { gql } from "@apollo/client";

const TestTallyApiPage = ({ data }) => (
  <Layout title="Test Api's page">
    <h1>test aps</h1>
    <p>This is the about page</p>
    <p>{JSON.stringify(data)}</p>
  </Layout>
);

export const getServerSideProps: GetServerSideProps = async () => {
  //   const tallyData = await (
  //     await ky.get("http://localhost:3000/api/tally")
  //   ).body();
  //   console.log("getServerside props", { tallyData });
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
  return {
    props: { data },
  };
};

export default TestTallyApiPage;
