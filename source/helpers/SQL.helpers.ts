import { Connection, SqlClient, Error, Query } from "msnodesqlv8";
import { DB_CONNECTION_STRING, ErrorCodes, ErrorMessages, Queries } from "../constants";
import { ErrorHelper } from "./error.helper";
import { systemError } from "../entities";
import { parseConfigFileTextToJson } from "typescript";


export class SqlHelper {
    static Sql: SqlClient = require("msnodesqlv8");

    public static openConnection(): Promise<Connection>{
        return new Promise<Connection>((resolve, reject) => {
            SqlHelper.Sql.open(DB_CONNECTION_STRING, (connectionError: Error, connection: Connection) => {

                if (connectionError) {
                     reject(ErrorHelper.parseError(ErrorCodes.ConnectionError, ErrorMessages.DbConnectionError));
                }
                else {
                    resolve(connection);
                }
            });
        });
    }


    public static executeQueryArrayResult<T>(query: string, ...params: (string | number)[]): Promise<T[]> {
        return new Promise<T[]>((resolve, reject) => {

            SqlHelper.openConnection()
                .then((connection: Connection) => {
                    connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SqlQueryError));
                        }
                        else {
                            if (queryResult !== undefined) {
                                resolve(queryResult);
                            }
                            else {
                                resolve([]);
                            }
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }


    public static executeQuerySingleResult<T>(query: string, ...params: (number | string)[]): Promise<T> {
        return new Promise<T> ((resolve, reject) => {
            this.openConnection()
            .then((connection: Connection) =>{
                connection.query(query, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                    if (queryError) {
                        reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SqlQueryError));
                        }
                    else {
                        const notFoundError: systemError = ErrorHelper.parseError(ErrorCodes.NoData, ErrorMessages.NoDataFound);
                        if (queryResult !== undefined && queryResult !== null && queryResult.length !== 0) {
                            resolve(queryResult[0])
                        }
                        else {
                            reject(notFoundError);
                        }
                    }
                });
            })   
        });
    }


    public static executeQueryNoResult(query: string, ignoreNoRowsAffected: boolean, ...params: (string | number)[]): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            SqlHelper.openConnection()
                .then((connection: Connection) => {
                    const q: Query = connection.query(query, params, (queryError: Error | undefined) => {
                        if (queryError) {
                            switch (queryError.code) {
                                case 547:
                                    reject(ErrorHelper.parseError(ErrorCodes.DeletionConflict, ErrorMessages.DeletionConflict));
                                   break;
                                default:
                                    reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SqlQueryError));
                                    break;
                            }
                        }
                    });

                    q.on('rowcount', (rowCount: number) => {
                        // If not ignoring rows affected AND ALSO rows affected equals zero then
                        if (!ignoreNoRowsAffected && rowCount === 0) {
                            reject(ErrorHelper.parseError(ErrorCodes.NoData, ErrorMessages.NoDataFound));
                            return;
                        }

                        resolve();
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                });
        });
    }

    public static createNew<T>(query: string, original: T, ...params: (string | number)[]): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            SqlHelper.openConnection()
                .then((connection: Connection) => {
                    const queries: string[] = [query, Queries.SelectIdentity];
                    const executedQuery: string = queries.join(";");
                    let executionCounter: number = 0;
                    connection.query(executedQuery, params, (queryError: Error | undefined, queryResult: T[] | undefined) => {
                        if (queryError) {
                            reject(ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SqlQueryError));
                        }
                        else {
                            executionCounter++;
                            const badQueryError: systemError = ErrorHelper.parseError(ErrorCodes.QueryError, ErrorMessages.SqlQueryError);

                            if (executionCounter === queries.length) {
                                if (queryResult !== undefined) {
                                    if (queryResult.length === 1) {
                                        (original as any).id = (queryResult[0] as any).id;
                                        resolve(original);
                                    }
                                    else {
                                        reject(badQueryError);
                                    }
                                }
                                else {
                                    reject(badQueryError);
                                }
                            }
                        }
                    });
                })
                .catch((error: systemError) => {
                    reject(error);
                })
        });
    }
}


































