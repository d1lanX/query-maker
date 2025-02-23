export type OptionsFileType = 'readAsText' | 'readAsArrayBuffer';

export type ReadFileOptions = {
  file: Blob;
  readAs: OptionsFileType;
};

export type RecentQuery = {
  consecutivo: number;
  preview: string;
  content: string[];
};
