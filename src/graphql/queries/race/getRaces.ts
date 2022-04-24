import { gql } from "urql";

const GET_RACES = gql`
  query Races {
    races {
      index
      name
    }
  }
`;

export default GET_RACES;
