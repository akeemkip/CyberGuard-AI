declare module 'file-type' {
  export interface FileTypeResult {
    ext: string;
    mime: string;
  }
  export function fromBuffer(buffer: Buffer | Uint8Array): Promise<FileTypeResult | undefined>;
}
