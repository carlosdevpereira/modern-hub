import AppLayout from '@/layouts/AppLayout/index.vue'
import DashboardView from '@/views/Guarded/Dashboard/DashboardView.vue'
import { createRouter, createWebHistory, type NavigationGuardNext, type RouteLocation } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/',
			name: 'ApplicationLayout',
			component: AppLayout,
			meta: {
				guarded: true,
			},
			children: [
				{
					path: '/',
					name: 'Dashboard',
					component: DashboardView,
				},
				{
					path: '/workspace/:workspaceId',
					name: 'WorkspaceDashboard',
					component: DashboardView,
				},
				{
					path: '/workspace/:workspaceId/team/:teamSlug',
					name: 'WorkspaceTeamDashboard',
					component: DashboardView,
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

const RouterAuthGuard = (to: RouteLocation,
	from: RouteLocation,
	next: NavigationGuardNext) => {
	const authToken = localStorage.getItem('_access_token_')

	if (to.meta && to.meta.guarded && !authToken) next({ name: 'Login' })
	else if (to.meta && to.meta.auth && authToken) next('/')
	else next()
}

router.beforeEach(RouterAuthGuard)

export default router
export {
	RouterAuthGuard
}
