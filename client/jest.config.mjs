import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const axiosPath = resolve(__dirname, 'node_modules/axios/index.js');

export default {
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jsdom", 
  transformIgnorePatterns: ["/node_modules/(?!axios)"],
  moduleNameMapper: {
    "^axios$": axiosPath,
  },
};
