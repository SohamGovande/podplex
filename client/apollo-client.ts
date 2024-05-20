import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const API_KEY = process.env.NEXT_PUBLIC_RUNPOD_API_KEY;

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `https://api.runpod.io/graphql?api_key=${API_KEY}`,
  }),
  cache: new InMemoryCache(),
});
