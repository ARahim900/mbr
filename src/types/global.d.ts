/// <reference types="node" />
/// <reference types="react" />

declare global {
  interface Window {
    prompt: (message?: string) => string | null;
    localStorage: Storage;
  }
  
  namespace NodeJS {
    interface Timeout {}
  }
}

export {};
