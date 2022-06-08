import { InMemoryCache, type NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';

let apolloClient: ApolloClient<NormalizedCacheObject>;

export default function GithubApi() {
	if (apolloClient) {
		return apolloClient;
	}

	const accessToken = localStorage.getItem('_access_token_')

	return apolloClient = new ApolloClient({
		link: createHttpLink({
			uri: "https://api.github.com/graphql",
			headers: {
				authorization: accessToken ? `Bearer ${accessToken}` : ''
			}
		}),

		cache: new InMemoryCache(),
	});
}