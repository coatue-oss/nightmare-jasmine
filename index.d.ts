import * as Nightmare from 'nightmare';
export interface Context<T extends Object> {
    baseURL: string;
    params: T;
    nightmare: Nightmare;
}
export interface Options<T extends Object> {
    isDebug?: boolean;
    params?: T;
    specFiles: string[];
}
export declare function run<T extends Object>(baseURL: string, options: Options<T>): Promise<{}>;
