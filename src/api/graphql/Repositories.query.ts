import gql from 'graphql-tag'

const query = gql(`
    query GetRepositories {
        viewer {
            name
            repositories(last: 3) {
                nodes {
                    name
                }
            }
        }
        
    }
`)

export default query