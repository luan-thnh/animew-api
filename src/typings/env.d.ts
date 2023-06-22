declare namespace NodeJS {
  export interface ProcessEnv {
    APP_PORT: string;
    APP_SECRET: string;
    DB_PASSWORD: string;
    DB_URL: string;
  }
}
