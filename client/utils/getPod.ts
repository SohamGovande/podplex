import { gql } from '@apollo/client';

export const GET_POD = gql`
  fragment GpuFragment on GPU {
    id
    type
    utilization
  }

  fragment PodRegistryFragment on Registry {
    id
    url
  }

  fragment PodRuntimeFragment on Runtime {
    id
    type
    version
  }

  query pod($input: PodFilter) {
    pod(input: $input) {
      lowestBidPriceToResume
      aiApiId
      apiKey
      consumerUserId
      gpus {
        ...GpuFragment
      }
      registry {
        ...PodRegistryFragment
      }
      runtime {
        ...PodRuntimeFragment
      }
    }
  }
`;