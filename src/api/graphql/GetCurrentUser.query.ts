import gql from 'graphql-tag'

export interface User {
    name: string
    login: string
    avatarUrl: string
}

export interface CurrentUser extends User {
    organizations: { nodes: UserOrganization[] }
    watching: { nodes: { name: string, owner: { avatarUrl: string, login: string } }[] }
}

export interface UserOrganization {
    name: string
    login: string
    avatarUrl: string
    membersWithRole: { nodes: User[] }
    teams: { nodes: OrganizationTeam[] }
}

export interface OrganizationTeam {
    name: string
    slug: string
    avatarUrl: string
    members: { nodes: User[] }
}

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