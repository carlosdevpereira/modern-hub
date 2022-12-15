import gql from 'graphql-tag'

const query = gql(`
    query GetOrganizationRepositories($organization: String!) {
      organization(login: $organization) {
        repositories(first: 50, orderBy: {field: PUSHED_AT, direction: DESC}) {
          edges {
            node {
              id
              name
              isPrivate
              pullRequests(
                first: 50
                orderBy: {field: UPDATED_AT, direction: DESC}
                states: OPEN
              ) {
                nodes {
                  author {
                    avatarUrl(size: 50)
                    login
                  }
                  baseRefName
				  additions
				  deletions
				  repository {
					name
				  }
                  comments {
                    totalCount
                  }
                  headRefName
                  isDraft
                  number
                  participants(first: 5) {
                    totalCount
                    nodes {
                      avatarUrl(size: 50)
                      name
                    }
                  }
                  reviewDecision
                  title
                  updatedAt
                  createdAt
                  url
                  reviews(last: 30) {
                    totalCount
                    nodes {
                      state
                      updatedAt
                      authorAssociation
                      author {
                        avatarUrl(size: 50)
                        login
                      }
                      comments {
                        totalCount
                      }
                    }
                  }
                  reviewRequests(last: 15) {
                    nodes {
                      requestedReviewer {
                        ... on User {
                          id
                          name
                          login
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
`)

export default query
