/// <reference types="vite/client" />
/// <reference types="node" />
/// <reference types="react" />

declare global {
  interface Window {
    prompt: (message?: string) => string | null;
    localStorage: Storage;
  }
  
  namespace NodeJS {
    interface Timeout {}
    interface Timer {}
  }
}

// Add React to global scope
import React from 'react';
declare global {
  const React: typeof React;
}

export {};
