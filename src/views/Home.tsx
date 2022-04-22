import Link from "next/link";

const Home = (): JSX.Element => {
  return (
    <main className="flex justify-center items-center grow">
      <div className="flex flex-col justify-center items-center z-10">
        <p className="font-display text-2xl text-black bg-heavens-down-semi-trans rounded-xl p-2 mb-3">
          Create awesome{" "}
          <span className="text-red-wine-800 font-bold">
            D&D 5<span className="align-super text-sm">th</span> Edition
          </span>{" "}
          character sheets with this free and open-source online tool.
        </p>
        <Link href="/create">
          <a className="font-fantasy bg-red-wine-800 w-fit p-3 text-heavens-down text-2xl rounded-xl hover:bg-red-wine-700 active:bg-red-wine-600 active:translate-y-1">
            Get Started
          </a>
        </Link>
      </div>
    </main>
  );
};

export default Home;
