import Router, { RouterAuthGuard } from '@/router'
import type { RouteLocation } from 'vue-router'

describe('Router', () => {
	const routes = Router.getRoutes()

	describe('Authentication Routes', () => {
		it('registers the Login view', () => {
			Router.push({ name: 'Dashboard' })

			const route = routes.find(r => r.name === 'Login')

			expect(route).toBeDefined()
			expect(route?.meta.auth).toBe(true)
		})

		it('redirects to the application layout when user is logged in', async () => {
			const getItemSpy = vi.spyOn(window.localStorage.__proto__, 'getItem')
			getItemSpy.mockImplementationOnce(() => 'TOKEN')

			const nextFn = vi.fn()

			const route: RouteLocation = { name: 'Login', fullPath: '/login', path: '/login', meta: { auth: true }, hash: '', matched: [], params: {}, query: {}, redirectedFrom: undefined }
			RouterAuthGuard(route, route, nextFn)

			expect(window.localStorage.__proto__.getItem).toHaveBeenCalled()
			expect(window.localStorage.__proto__.getItem).toHaveBeenCalledWith('_access_token_')

			expect(nextFn).toHaveBeenCalled()
			expect(nextFn).toHaveBeenCalledWith('/')
		})
	})

	describe('Guarded Routes', () => {
		it('registers the application layout route', () => {
			const route = routes.find(r => r.name === 'ApplicationLayout')

			expect(route).toBeDefined()
			expect(route?.meta.guarded).toBe(true)
		})

		it('redirects to the login screen when user is not logged in', async () => {
			const getItemSpy = vi.spyOn(window.localStorage.__proto__, 'getItem')
			getItemSpy.mockImplementationOnce(() => undefined)

			const nextFn = vi.fn()

			const route: RouteLocation = { name: 'Dashboard', fullPath: '/', path: '/', meta: { guarded: true }, hash: '', matched: [], params: {}, query: {}, redirectedFrom: undefined }
			RouterAuthGuard(route, route, nextFn)

			expect(window.localStorage.__proto__.getItem).toHaveBeenCalled()
			expect(window.localStorage.__proto__.getItem).toHaveBeenCalledWith('_access_token_')

			expect(nextFn).toHaveBeenCalled()
			expect(nextFn).toHaveBeenCalledWith({ name: 'Login' })
		})

		it('registers the dashboard view', async () => {
			const route = routes.find(r => r.name === 'Dashboard')
			expect(route).toBeDefined()
		})
	})
})