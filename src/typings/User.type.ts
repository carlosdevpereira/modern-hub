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