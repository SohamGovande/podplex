import { gql } from "@apollo/client";

export const GET_ALL_PODS = gql`
  query Pods {
    myself {
      pods {
        id
        name
        runtime {
          uptimeInSeconds
          ports {
            ip
            isIpPublic
            privatePort
            publicPort
            type
          }
          gpus {
            id
            gpuUtilPercent
            memoryUtilPercent
          }
          container {
            cpuPercent
            memoryPercent
          }
        }
      }
    }
  }
`;
