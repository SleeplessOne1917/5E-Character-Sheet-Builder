import DiceSVG from "./svgs/DiceSVG";
import Link from "next/link";

const Header = (): JSX.Element => (
  <header className="flex justify-between bg-davey-jones-800 p-2 items-center fixed md:static w-full">
    <div className="flex justify-between ml-3 items-center">
      <Link href="/">
        <a>
          <DiceSVG
            backgroundClass="fill-heavens-down"
            foregroundClass="fill-red-wine-800"
            className="w-12 h-12 md:w-24 md:h-24"
          />
        </a>
      </Link>
      <h1 className="text-heavens-down text-lg md:text-3xl xl:text-5xl ml-3">
        D&D 5E Character Sheet Builder
      </h1>
    </div>
    <nav className="hidden md:block mr-20 w-1/6">
      <ul className="flex justify-around items-center list-none">
        <li className="relative">
          <Link href="/create">
            <a className="text-heavens-down text-lg lg:text-xl xl:text-2xl hover:text-cantaloupe-800 active:text-cantaloupe-800 focus:text-cantaloupe-800 hover:-translate-y-1 absolute -bottom-4">
              Create
            </a>
          </Link>
        </li>
        <li className="relative">
          <Link href="#">
            <a className="text-heavens-down text-lg lg:text-xl xl:text-2xl hover:text-cantaloupe-800 active:text-cantaloupe-800 focus:text-cantaloupe-800 hover:-translate-y-1 absolute -bottom-4 whitespace-nowrap">
              Log In
            </a>
          </Link>
        </li>
      </ul>
    </nav>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-12 w-12 stroke-heavens-down cursor-pointer md:hidden hover:stroke-cantaloupe-800 active:stroke-cantaloupe-800 focus:stroke-cantaloupe-800"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  </header>
);

export default Header;
