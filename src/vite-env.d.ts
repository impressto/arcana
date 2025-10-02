/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SAMPLE_SPEC_DOCUMENT_PATH: string
  readonly VITE_SAMPLE_MEMORY_DOCUMENT_PATH: string
  // Add other env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}