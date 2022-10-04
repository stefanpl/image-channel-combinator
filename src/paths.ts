import { join } from "path";

interface Paths {
  BASE_DIR: string;
  INPUT_FILES_DIR: string;
  OUT_DIR: string;
}

export function getPath(): Paths {
  const compiledFilePath = new URL(import.meta.url);

  const BASE_DIR = join(compiledFilePath.pathname, "./../../");

  const INPUT_FILES_DIR = join(BASE_DIR, "input-files/");
  const OUT_DIR = join(BASE_DIR, "out/");

  return {
    BASE_DIR,
    INPUT_FILES_DIR,
    OUT_DIR,
  };
}
