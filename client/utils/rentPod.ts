import { gql } from "@apollo/client";

// RTX A6000, 0.55, 1 GPU, 48 GB,  

export const POD_RENT_MUTATION = gql`
  mutation podRentInterruptable($input: PodRentInterruptableInput!) {
    podRentInterruptable(input: $input) {
      id
    }
  }
`;
