import { defineStore } from 'pinia'

type WorkspaceType = 'user' | 'org'

export const useNavigationStore = defineStore({
	id: 'Navigation',

	state: () => ({
		workspaceType: 'user' as WorkspaceType,
		workspace: '' as string,
		team: '' as string
	}),
})
