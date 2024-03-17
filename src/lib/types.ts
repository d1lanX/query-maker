export type OptionsFileType = 'readAsText' | 'readAsArrayBuffer';

export type ReadFileOptions = {
  file: Blob;
  readAs: OptionsFileType;
}

export type RecentQuery = {
  preview: string;
  content: string[]
}