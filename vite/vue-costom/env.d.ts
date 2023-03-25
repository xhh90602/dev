/// <reference types="vite/client" />

// 定义环境变量的类型
interface ImportMetaEnv {
  readonly VITE_TEST_TEXT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
