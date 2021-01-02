require('dotenv').config();

import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    verbose: true,
    testEnvironment: "node",
    setupFiles: ["./setupTests.ts"],
  };
};