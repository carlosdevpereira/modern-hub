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
                  state
                  title
                  updatedAt
                  url
                  reviews(last: 30) {
                    nodes {
                      state
                      updatedAt
                      author {
                        avatarUrl(size: 50)
                        login
                      }
                    }
                  }
                }
              }
            }
          }
        }
        membersWithRole(first: 50) {
          nodes {
            avatarUrl(size: 50)
            name
            login
          }
        }
      }
    }
`)

export default query