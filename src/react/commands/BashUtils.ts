// BashUtils.ts
/**
 * This BashUtils module provides different file and OS utility functions. Those functions should
 * work across all our supported operating systems including Linux, macOS and Windows.
 * 
 * @module
 */
const readdirProm = window.utilAPI.promisify(window.fsAPI.readdir);

/**
 * Check for the existence of a file or a directory on the filesystem.
 * 
 * @param filename The path to the file or directory.
 * 
 * @returns Returns true if the file or directory exists. Returns false if not.
 */
const doesFileExist = (filename: string): boolean => {
  try {
    window.fsAPI.accessSync(filename, window.fsAPI.constantsFOK);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Check for the existence of a directory on the filesystem.
 * 
 * @param directory The path to the directory.
 * 
 * @returns Returns true if the directory exists. Returns false if not.
 */
const doesDirectoryExist = (directory: string): boolean => {
  if (doesFileExist(directory)) {
    return window.fsAPI.statSync(directory).isDirectory();
  }
  return false;
}

/**
 * Check if we can write a file in a directory.
 * 
 * @param directory The path to the directory.
 * 
 * @returns Returns true if the directory is writable and if a file can be written in the
 *          directory. Returns false if not.
 */
const isDirectoryWritable = (directory: string): boolean => {
  let tempFile = null;
  try {
    window.fsAPI.accessSync(directory, window.fsAPI.constantsWOK);

    /**
    * On Windows, checking for W_OK on a directory is not enough to tell if we can write a file in
    * it. We need to actually write a temporary file to check.
    */
    tempFile = window.tmpAPI.fileSync({ keep: false, tmpdir: directory });

    return true;
  } catch (err) {
    return false;
  } finally {
    if (tempFile != null) {
      tempFile.removeCallback();
    }
  }
}

/**
 * Find the first file whom filename starts with some value in a directory.
 * 
 * @param directory The path to the directory.
 * @param startsWith Filename match to look for.
 * 
 * @returns Returns a Promise<string> that includes the path to the file if found. Returns empty
 *          string if not found.
 */
const findFirstFile = async (directory: string, startsWith: string): Promise<string> => {
  const entries = await readdirProm(directory, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isFile() && entry.name.startsWith(startsWith)) {
      return window.pathAPI.join(directory, entry.name);
    }
  }

  return "";
}

export {
  doesFileExist,
  doesDirectoryExist,
  isDirectoryWritable,
  findFirstFile
};