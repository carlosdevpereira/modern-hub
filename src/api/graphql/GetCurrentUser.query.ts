import gql from 'graphql-tag'

const query = gql(`
    query GetCurrentUser {
        viewer {
            login
            avatarUrl(size: 50)
            name
            organizations(first: 100) {
                nodes {
                    avatarUrl(size: 50)
                    login
                    name
                    membersWithRole(first: 50) {
                        nodes {
                            avatarUrl(size: 50)
                            name
                            login
                        }
                    }
                    teams(first: 20) {
                        nodes {
                            avatarUrl(size: 50)
                            name
                            slug
                            members(first: 50) {
                                nodes {
                                    avatarUrl(size: 50)
                                    login
                                    name
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