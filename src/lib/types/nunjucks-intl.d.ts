declare module 'nunjucks-intl' {
  import nunjucks from 'nunjucks';

  export function registerWith(env: typeof nunjucks): void;
}
