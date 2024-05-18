import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const API_KEY = "E9D2TYFUE8";

export const client = new ApolloClient({
  link: new HttpLink({
    uri: `https://api.runpod.io/graphql?api_key=${API_KEY}`,
  }),
  cache: new InMemoryCache(),
});
