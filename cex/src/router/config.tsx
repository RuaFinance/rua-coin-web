/// <reference types="vite/client" />

/**
 * The `VITE_DEPLOY_ENV` variable's dynamic configuration 
 * is defined within the `ci.yaml` file.
 */
const DEPLOY_ENV = import.meta.env.VITE_DEPLOY_ENV;
export const BASE_URL = DEPLOY_ENV === 'GIT' ? '/rua-coin-web' : '';

export const formatUrl = (path: string): string => {
    return BASE_URL + path;
}
