import { GET_POD } from "@/utils/getPod";
import { useLazyQuery } from "@apollo/client";
import { Button } from "@mantine/core";

type Props = {
  podId: string;
};

const PodStatus = ({ podId }: Props) => {
  const [getPod, { data, loading, error }] = useLazyQuery(GET_POD, {
    variables: {
      input: {
        podId,
      },
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1>Pod Details</h1>
      <p>API Key: {data?.pod.apiKey}</p>
      <p>Lowest Bid Price to Resume: {data?.pod.lowestBidPriceToResume}</p>
      <p>Docker ID: {data?.pod.dockerId}</p>

      <Button onClick={() => getPod()}>Fetch Pod Status</Button>
    </div>
  );
};

export default PodStatus;
