vi.mock("uno.css", () => vi.fn());
vi.mock('vue', () => ({
	createApp: vi.fn(() => ({
		use: vi.fn(),
		mount: vi.fn()
	}))
}))
vi.mock('@carlosdevpereira/mr-components', () => ({
	default: vi.fn()
}))

import '@/main';
import { createApp } from 'vue';

describe('Main', () => {
	it('creates an instance of a Vue app', () => {
		expect(createApp).toHaveBeenCalled()
	})
})