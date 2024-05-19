import { gql } from "@apollo/client";

export const STOP_POD = gql`
  mutation podStop($input: PodStopInput!) {
    podStop(input: $input) {
      id
    }
  }
`;
