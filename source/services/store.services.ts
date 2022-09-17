import { Connection, SqlClient, Error } from "msnodesqlv8";
import { Store, systemError } from "../entities";
import { ErrorCodes, ErrorMessages, DB_CONNECTION_STRING, Queries } from "../constants";
import { ErrorHelper } from "../helpers/error.helper";
import { SqlHelper } from "../helpers/SQL.helpers";
import * as _ from "underscore"

interface LocalStore {
    id: number;
    name_store: string;
}

interface IStoreService {
    getStores(): Promise<Store[]>;
    // getBoardType(id: number): Promise<Store>;
};

export class StoreService implements IStoreService {
    public getStores(): Promise<Store[]> {
        return new Promise<Store[]>((resolve, reject) => {
            const result: Store[] = [];
                    SqlHelper.executeQueryArrayResult<LocalStore>(Queries.StoresList)
                    .then((queryResult: Store[])=> {
                        queryResult.forEach((localStore: LocalStore) => {
                            result.push(this.parseLocalStore(localStore));
                        });
                        resolve(result)
                    });
                });
    };


    public getStoreById(id: number): Promise<Store> {
        return new Promise<Store>((resolve, reject) => {
            SqlHelper.executeQuerySingleResult<LocalStore>(Queries.StoreById, id)
            .then((queryResult: LocalStore) => {
                resolve(this.parseLocalStore(queryResult));
            })
            .catch((error: systemError) => {
                reject(error);
            });
        })
    }

    public getStoreByTitle(title: string): Promise<Store[]> {
        return new Promise<Store[]>((resolve, reject) =>[
            SqlHelper.executeQueryArrayResult<LocalStore>(Queries.StoreByTitle, `%${title}%`)
            .then((queryResult: LocalStore[]) =>{
                resolve(_.map(queryResult, (result: LocalStore) => this.parseLocalStore(result)));
            })
            .catch((error: systemError) =>{
                reject(error);
            })
        ])

    }
    public insertStore(store: Store): Promise<Store> {
        return new Promise<Store>((resolve, reject) => {
            SqlHelper.createNew<Store>(Queries.StoreInsert, store, store.name_store)
            .then((result: Store) => {
                resolve(result);
            })
            .catch((error: systemError)=>{
                reject(error);
            })
        })
    };

    public updateStoreById(store: Store): Promise<Store> {
        return new Promise<Store>((resolve, reject) => {
            let bool: boolean = false;
            SqlHelper.executeQueryNoResult(Queries.UpdateStore, false, store.name_store)
            .then(() =>{
                resolve(store);
            })
            .catch((error:systemError) =>{
                reject(error);
            })
        })
    }

    public deleteStore(id: number): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.executeQueryNoResult(Queries.DeleteStore, true, id)
            .then(() => {
                resolve();
            })
            .catch((error: systemError) => {
                reject(error);
            })
        })
    }

    private parseLocalStore(local: LocalStore): Store {
        return {
            id: local.id,
            name_store: local.name_store
        }
    }
}