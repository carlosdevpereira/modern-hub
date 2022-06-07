import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'

// Cache implementation
const cache = new InMemoryCache()

export default function GithubApi() {
	const accessToken = localStorage.getItem('_access_token_')

	const httpLink = createHttpLink({
		uri: 'https://api.github.com/graphql',
		headers: {
			authorization: accessToken ? `Bearer ${accessToken}` : ''
		}
	})

	return new ApolloClient({
		link: httpLink,
		cache,
	})
}