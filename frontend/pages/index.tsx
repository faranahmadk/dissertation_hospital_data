import Link from "next/link";
import Layout from "../components/Layout";
import ZKComponent from "../components/homePage/Homepage";

const IndexPage = () => (
  <Layout title="Home | Next.js + TypeScript Example">
    < ZKComponent />
    <p>
      <Link href="/about">About</Link>
    </p>
  </Layout>
);

export default IndexPage;
