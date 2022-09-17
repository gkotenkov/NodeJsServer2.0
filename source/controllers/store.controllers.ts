/** source/controllers/posts.ts */
import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import { Store, systemError } from '../entities';
import { StoreService } from '../services/store.services';
import { ErrorCodes, ErrorMessages, NON_EXISTENT_ID } from '../constants';
import { ErrorHelper } from '../helpers/error.helper';
import { ResponseHelper } from '../helpers/response.helper';
import { RequestHelper } from '../helpers/request.helper';

const storeService: StoreService = new StoreService();

export const getStoresList = async (req: Request, res: Response, next: NextFunction) => {
    storeService.getStores()
        .then((result: Store[]) => {
            return res.status(200).json({
                message: result
            });
        })
        .catch((error: systemError) => {
            switch (error.code) {
                case ErrorCodes.ConnectionError:
                    return res.status(408).json({
                        errorMessage: error.message
                    });
                case ErrorCodes.QueryError:
                    return res.status(406).json({
                        errorMessage: error.message
                    });
                default:
                    return res.status(400).json({
                        errorMessage: error.message
                    });
            }
        });
};

export const getStoreById = async (req: Request, res: Response, next: NextFunction) => {
    let id: number = -1;
    const sId: string = req.params.id;

    if (isNaN(Number(req.params.id))) {
        return res.status(777).json({
            errorMessage: "Wrong ID request"
        });
    }

    if (sId !== null && sId !== undefined) {
        id = parseInt(sId);
    }
    else {
        // TODO: Error handling
    }

    if (id > 0) {
        storeService.getStoreById(id)
            .then((result: Store) => {
                return res.status(200).json({
                    result
                });
            })
            .catch((error: systemError) => {
                switch (error.code) {
                    case ErrorCodes.ConnectionError:
                        return res.status(408).json({
                            errorMessage: error.message
                        });
                    case ErrorCodes.QueryError:
                        return res.status(406).json({
                            errorMessage: error.message
                        });
                    default:
                        return res.status(400).json({
                            errorMessage: error.message
                        });
                }
            });
    }
    else {
        // TODO: Error handling
    }
}

export const updateStore = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(req.params.id)
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            const body: Store = req.body;

            storeService.updateStoreById({
                id: numericParamOrError,
                name_store: body.name_store
            })
                .then((result: Store) => {
                    return res.status(200).json(result);
                })
                .catch((error: systemError) => {
                    return ResponseHelper.handleError(res, error);
                });
        }
        else {
            // TODO: Error handling
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError);
    }
};


export const insertStores = async (req: Request, res: Response, next: NextFunction) => {
    const body: Store = req.body;

    storeService.insertStore({
        id: NON_EXISTENT_ID,
        name_store: body.name_store
    })
        .then((result: Store) => {
            return res.status(200).json(result);
        })
        .catch((error: systemError) =>{
            return ResponseHelper.handleError(res, error);
        });
};

export const getStoreByTitle = async (req: Request, res: Response, next: NextFunction) =>{
    let title: string = req.params.title;
    storeService.getStoreByTitle(title)
    .then((result: Store[]) => {
        return res.status(200).json(result);
    })
    .catch((error: systemError) =>{
        return ResponseHelper.handleError(res, error);
    })
}

export const deleteStore = async (req: Request, res: Response, next: NextFunction) => {
    const numericParamOrError: number | systemError = RequestHelper.ParseNumericInput(req.params.id)
    if (typeof numericParamOrError === "number") {
        if (numericParamOrError > 0) {
            storeService.deleteStore(numericParamOrError)
                .then(() => {
                    return res.sendStatus(200);
                })
                .catch((error: systemError) => {
                    return ResponseHelper.handleError(res, error);
                });
        }
        else {
            // TODO: Error handling
        }
    }
    else {
        return ResponseHelper.handleError(res, numericParamOrError);
    }
};