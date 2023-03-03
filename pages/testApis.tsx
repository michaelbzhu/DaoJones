import Layout from "../components/Layout";
import { GetServerSideProps } from "next";
import ky from "ky";

const TestApiPage = ({ wallets, walletInfos }) => (
  <Layout title="Test Api's page">
    <h1>test aps</h1>
    <p>This is the about page</p>
    <p>{wallets}</p>
    <p>{JSON.stringify(walletInfos)}</p>
  </Layout>
);

export const getServerSideProps: GetServerSideProps = async () => {
  const data = await ky
    .post("http://localhost:3000/api/spectral", {
      body: JSON.stringify({
        wallets: ["0xbbF183972487410abdcD76f53f89406c226Cc8E9"],
      }),
    })
    .json();
  console.log("getServerside props", { data });
  return {
    props: data, // will be passed to the page component as props
  };
};

export default TestApiPage;
