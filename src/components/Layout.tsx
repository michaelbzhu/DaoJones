import React, { ReactNode } from "react";
import Link from "next/link";
import Head from "next/head";

type Props = {
  children?: ReactNode;
  title?: string;
};

const menuItems = [
  {
    href: "/",
    title: "Homepage",
  },
  {
    href: "/about",
    title: "About",
  },
  {
    href: "/users",
    title: "Users",
  },
];

const Layout = ({ children, title = "This is the default title" }: Props) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>

    <div className="min-h-screen flex flex-col">
      <header className="bg-purple-200 sticky top-0 h-14 flex justify-center items-center font-semibold uppercase">
        <nav>
          <Link href="/">Home</Link> | <Link href="/about">About</Link> |{" "}
          <Link href="/users">Users List</Link>{" "}
        </nav>
      </header>
      <div className="flex flex-col md:flex-row flex-1">
        <aside className="bg-fuchsia-100 w-full md:w-60">
          <nav>
            <ul>
              {menuItems.map(({ href, title }) => (
                <li className="m-2" key={title}>
                  <Link href={href}>
                    <a
                      className={`flex p-2 bg-fuchsia-200 rounded hover:bg-fuchsia-400 cursor-pointer`}
                    >
                      {title}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  </div>
);

export default Layout;
