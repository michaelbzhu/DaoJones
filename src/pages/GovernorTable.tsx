import React from "react";
import { createColumnHelper, useReactTable } from "@tanstack/react-table";
import client from "./api/tally/apollo-client";
import { GetServerSideProps } from "next";
import { gql } from "@apollo/client";
import ky from "ky";

type GovernorData = {
  name: string;
  macroScore: number;
};

const GovernorTable = (governors: GovernorData[]) => {
  const columnHelper = createColumnHelper<GovernorData>();
  return <></>;
};

export const getServerSideProps: GetServerSideProps = async () => {
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
          proposalStats {
            total
          }
        }
      }
    `,
    variables: {
      sort: { field: "TOTAL_PROPOSALS", order: "DESC" },
      govPagination: { limit: 2, offset: 0 },
      delegateSort: { field: "VOTING_WEIGHT", order: "DESC" },
      delegatePagination: { limit: 20, offset: 0 },
    },
  });
  console.log("tally graph ql", data);

  const governorPromises = [];

  const governors: { [name: string]: unknown } = {};

  data.governors.forEach(({ name, delegates }) => {
    console.log({
      name,
      delegates: delegates.map(({ account }) => account.address),
    });
    governorPromises.push(
      ky
        .post("http://localhost:3000/api/spectral", {
          body: JSON.stringify({
            wallets: delegates.map(({ account }) => account.address),
          }),
        })
        .json()
        .then((response) => {
          console.log("-------------");
          console.log({ name, response });
          governors[name] = response;
        })
        .catch((err) => {
          console.log("error----------------------", err);
        })
    );
  });

  await Promise.all(governorPromises);

  console.log("governors", governors);

  return {
    props: { data },
  };
};

export default GovernorTable;
