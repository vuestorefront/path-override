import { sync } from 'glob';
import { resolve } from 'path';
import { CreateFileMappingParams, Source, SourcesMap } from '../types';
import { getFilesGlob, getFilePathFromSource, getIgnoredPaths } from './helpers';

export default function createFileMapping({ config }: CreateFileMappingParams): SourcesMap {
  return config.copy.from.reduce((map, source) => {
    // Get all paths to all files in source directory
    const files = getFilePaths(source);

    // Add all files to map, overriding previous entries
    return files.reduce((map, file) => map.set(file, source.path), map);
  }, new Map());
}

function getFilePaths (source: Source): string[] {
  const options = {
    ignore: getIgnoredPaths(source),
    follow: true,
    nodir: true,
    dot: true
  };

  return sync(getFilesGlob(source.path), options)
    .map(filePath => resolve(filePath))
    .map(filePath => getFilePathFromSource(filePath, source.path));
}
