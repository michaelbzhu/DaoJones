import React from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import client from "./api/tally/apollo-client";
import { GetServerSideProps } from "next";
import { gql } from "@apollo/client";
import ky from "ky";
import { getGovernors } from "../../utils/getGovernors";

type GovernorData = {
  name: string;
  macroScore: number;
};
const columnHelper = createColumnHelper<GovernorData>();

const GovernorTable = (governors: GovernorData[]) => {
  console.log({ governors });
  const columns = [
    columnHelper.accessor((row) => `${row.name}`, {
      header: () => "DAO",
      id: "name",
      cell: (info) => <i>{info.getValue()}</i>,
    }),
    columnHelper.accessor((row) => `${row.macroScore}`, {
      header: () => "Credit Score",
      id: "macroScore",
      cell: (info) => info.renderValue(),
    }),
  ];

  const table = useReactTable({
    data: governors,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  // mocked data - the query below returns this object
  // return {
  //   props: {
  //     governors: [
  //       { name: "veggieDAO", macroScore: 596.3076923076923 },
  //       { name: "Nouns Dao", macroScore: 608.2 },
  //     ],
  //   },
  // };

  const governorsFromTally = await getGovernors({
    numberOfGovs: 2,
    maxDelegatesPerGov: 10,
  });

  console.log({ governorsFromTally });

  const governorPromises = [];

  const governors: { [name: string]: number } = {};

  governorsFromTally.forEach(({ name, delegates }) => {
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
        .then(({ walletInfos }) => {
          console.log("-------------");
          console.log({ name, walletInfos });
          governors[name] =
            Object.keys(walletInfos).reduce<number>((sum, address) => {
              return sum + Number(walletInfos[address].score);
            }, 0) / Object.keys(walletInfos).length;
        })
        .catch((err) => {
          console.log("error----------------------", err);
        })
    );
  });

  await Promise.all(governorPromises);

  console.log("governors", governors);
  const governorData: GovernorData[] = Object.keys(governors).map((dao) => ({
    name: dao,
    macroScore: governors[dao],
  }));

  console.log("governorData", governorData);

  return {
    props: { governors: governorData },
  };
};

export default GovernorTable;
