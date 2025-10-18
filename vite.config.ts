import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    dir: 'src',
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/useCases',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/infra/http/controllers',
          environment:
            './prisma/vitestEnvironmentPrisma/prismaTestEnvironment.ts',
        },
      },
    ],
  },
});
