declare module "kevoree-registry-api" {
    module e {
        export function auth(user: any):Q.Promise<any>
        export function refresh():Q.Promise<any>
        export const config: { host: string, port: number }
        export function whoami(identity:string): string
        export function createTdef(token: string, namespace: string, name: string, version: string , data: string): void;
        export function deleteTdef(token: string, namespace: string, name: string, version: string): void;
        export function getTdefs(namespace: string, name: string, version: string):any
    }
    export = e;
}