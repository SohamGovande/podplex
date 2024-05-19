import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const API_KEY = "CZIZ7HIRD8WP96NLMXVWHUF612RLYKSOJBR3YT4S";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `https://api.runpod.io/graphql?api_key=${API_KEY}`,
  }),
  cache: new InMemoryCache(),
});
