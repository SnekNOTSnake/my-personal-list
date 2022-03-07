import { build } from 'vite'

await build({ configFile: 'packages/main/vite.config.ts' })
await build({ configFile: 'packages/common/vite.config.ts' })
await build({ configFile: 'packages/renderer/vite.config.ts' })
