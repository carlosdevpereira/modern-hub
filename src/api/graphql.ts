import possibleTypes from '@/api/possibleTypes.json';
import { InMemoryCache, IntrospectionFragmentMatcher, type NormalizedCacheObject } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';

// Required to be able to use Github Fragments
const fragmentMatcher = new IntrospectionFragmentMatcher({
	introspectionQueryResultData: possibleTypes
})

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

		cache: new InMemoryCache({ fragmentMatcher }),
	});
}