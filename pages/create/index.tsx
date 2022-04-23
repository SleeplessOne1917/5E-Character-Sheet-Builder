import { NextPage } from "next";
import { useEffect } from "react";
import { useRouter } from "next/router";

const CreatePage: NextPage = () => {
  const { replace } = useRouter();
  useEffect(() => {
    replace("/create/race");
  }, []); //eslint-disable-line

  return <div></div>;
};

export default CreatePage;
