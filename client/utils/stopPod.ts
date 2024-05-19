import { gql } from "@apollo/client";

"mutation stopPod($input: PodStopInput!) {\n  podStop(input: $input) {\n    id\n    desiredStatus\n    lastStatusChange\n    __typename\n  }\n}\n"


export const STOP_POD = gql`
  mutation podStop($input: PodStopInput!) {
    podStop(input: $input) {
      id
    }
  }
`;
