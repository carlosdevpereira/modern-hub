import AppLayout from '@/layouts/AppLayout/index.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			component: AppLayout,
			meta: {
				guarded: true,
			},
			children: [
				{
					path: '/',
					name: 'Dashboard',
					component: () => import('@/views/Guarded/Dashboard/DashboardView.vue'),
				},
				{
					path: '/workspace/:workspaceId',
					name: 'WorkspaceDashboard',
					component: () => import('@/views/Guarded/Dashboard/DashboardView.vue'),
				},
				{
					path: '/workspace/:workspaceId/team/:teamSlug',
					name: 'WorkspaceTeamDashboard',
					component: () => import('@/views/Guarded/Dashboard/DashboardView.vue'),
				},
			]
		},
		{
			path: '/login',
			name: 'Login',
			meta: {
				auth: true
			},
			component: () => import('@/views/Auth/Login.vue'),
		},
	],
})

router.beforeEach((to, from, next) => {
	const authToken = localStorage.getItem('_access_token_')

	if (to.meta && to.meta.guarded && !authToken) next({ name: 'Login' })
	else if (to.meta && to.meta.auth && authToken) next('/')
	else next()
})

export default router
