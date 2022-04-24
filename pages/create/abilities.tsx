import { GetStaticPropsResult, NextPage } from "next";

import AbilitiesView from "../../src/views/create/abilities/Abilities";
import { SrdItem } from "../../src/types/common";
import { getAbilities } from "../../src/graphql/srdClientService";

type AbilitiesPageProps = {
  abilities: SrdItem[];
};

const AbilitiesPage: NextPage<AbilitiesPageProps> = ({
  abilities,
}: AbilitiesPageProps) => <AbilitiesView abilities={abilities} />;

export default AbilitiesPage;

export const getStaticProps = async (): Promise<
  GetStaticPropsResult<AbilitiesPageProps>
> => {
  const abilities = await getAbilities();

  return {
    props: {
      abilities,
    },
  };
};
