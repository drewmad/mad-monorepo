/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'next/link' {
  const Link: any;
  export default Link;
}

declare module 'next/navigation' {
  export const usePathname: any;
  export const useSearchParams: any;
  export const useRouter: any;
  export function redirect(url: string): never;
  export function notFound(): never;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
