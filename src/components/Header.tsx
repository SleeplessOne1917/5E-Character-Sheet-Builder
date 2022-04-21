import DiceSVG from "./svgs/DiceSVG";
import Link from "next/link";
import { MenuIcon } from "@heroicons/react/solid";

const Header = (): JSX.Element => (
  <header className="flex justify-between bg-davey-jones-800 p-2 items-center z-10 w-full">
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
      <h1 className="text-heavens-down text-lg md:text-3xl xl:text-5xl ml-3 font-fantasy">
        D&D 5E Character Sheet Builder
      </h1>
    </div>
    <nav className="hidden md:block mr-20 w-1/6">
      <ul className="flex justify-around items-center list-none">
        <li className="relative">
          <Link href="/create">
            <a className="text-heavens-down text-xl lg:text-2xl xl:text-3xl hover:text-cantaloupe-800 active:text-cantaloupe-800 focus:text-cantaloupe-800 hover:-translate-y-1 active:-translate-y-1 focus:-translate-y-1 absolute -bottom-4 font-fantasy">
              Create
            </a>
          </Link>
        </li>
        <li className="relative">
          <Link href="#">
            <a className="text-heavens-down text-xl lg:text-2xl xl:text-3xl hover:text-cantaloupe-800 active:text-cantaloupe-800 focus:text-cantaloupe-800 hover:-translate-y-1 active:-translate-y-1 focus:-translate-y-1 absolute -bottom-4 whitespace-nowrap font-fantasy">
              Log In
            </a>
          </Link>
        </li>
      </ul>
    </nav>
    <MenuIcon className="h-12 w-12 stroke-heavens-down text-heavens-down cursor-pointer md:hidden hover:stroke-cantaloupe-800 active:stroke-cantaloupe-800 focus:stroke-cantaloupe-800" />
  </header>
);

export default Header;
