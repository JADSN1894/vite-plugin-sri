import { assertEquals } from "https://deno.land/std@0.196.0/assert/assert_equals.ts";

import subresourceIntegrity from "./index.ts"

const plugin = subresourceIntegrity()

Deno.test('ok_plugin_is_name_correct', () => {
  assertEquals(plugin.name, 'vite-plugin-subresource-integrity')
});

Deno.test('ok_plugin_apply_is_equals_to_build', () => {
  assertEquals(plugin.apply, 'build')
});

Deno.test('ok_plugin_apply_is_equals_to_post', () => {
  assertEquals(plugin.enforce, 'post')
});
