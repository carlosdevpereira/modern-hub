import gql from 'graphql-tag'

export interface Repository {
    node: UserRepository
}

export interface UserRepository {
    id: string
    name: string
    isPrivate: boolean
    collaborators: { nodes: UserRepositoryCollaborator[] }
    pullRequests: { nodes: RepositoryPullRequest[] }
}

export interface UserRepositoryCollaborator {
    name: string
    login: string
    avatarUrl: string
}

export interface RepositoryPullRequest {
    baseRefName: string
    isDraft: boolean,
    number: number
    state: string
    title: string
    updatedAt: string
    url: string
    author: { avatarUrl: string, login: string }
    comments: { totalCount: number }
    participants: { totalCount: number, nodes: PullRequestParticipant[] }
    reviews: { nodes: PullRequestReview[] }
}

export interface PullRequestParticipant {
    avatarUrl: string
    login: string
}

export interface PullRequestReview {
    state: string
    updatedAt: string
    author: { avatarUrl: string, login: string }
}

const query = gql(`
    query GetUserRepositories($user: String!) {
        user(login: $user) {
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
        }
      }
`)

export default query