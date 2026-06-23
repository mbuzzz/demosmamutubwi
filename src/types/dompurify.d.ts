declare module 'dompurify' {
  interface DOMPurifyI {
    sanitize(dirty: string): string;
  }
  const DOMPurify: DOMPurifyI;
  export default DOMPurify;
}
