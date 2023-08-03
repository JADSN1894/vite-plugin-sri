import { test } from 'vitest'
import sri from '../src'

const plugin = sri()

test('ok_plugin_name_is_correct', async (testContext) => {
    testContext.expect(plugin.name).toBe('vite-plugin-subresource-integrity')
})

test('ok_plugin_apply_is_for_build', async (testContext) => {
    testContext.expect(plugin.apply, 'build')
})

test('ok_plugin_apply_is_for_post_modification', async (testContext) => {
    testContext.expect(plugin.enforce, 'post')
})
