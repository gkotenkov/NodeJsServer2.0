export class ErrorCodes {
    public static GeneralError: number = 99;
    public static ConnectionError: number = 100;
    public static QueryError: number = 101;
    public static NoData: number = 102;
    public static NonNumericInput: number = 103;
    public static InputParameterNotSupplied: number = 104;
    public static DeletionConflict: number = 105;
}

export class ErrorMessages {
    public static GeneralErrorMessage: string = "General error. DEBUG me!!!";
    public static DbConnectionError: string = "DB server connection error";
    public static SqlQueryError: string = "Incorrect query";
    public static NoDataFound: string = "Not found";
    public static NonNumericInput: string = "Non numeric input supplied";
    public static InputParameterNotSupplied: string = "Input parameter not supplied";
    public static DeletionConflict: string = "Delete failed due to conflict";
}


export class SqlParameters {
    public static Id: string = "id";
}


export class Queries {
    public static StoresList: string = "SELECT * FROM store";
    public static SelectIdentity: string = "SELECT SCOPE_IDENTITY() AS id;";
    public static StoreById: string = `SELECT * FROM store WHERE id = ?`;
    public static StoreByTitle: string = "SELECT * FROM store WHERE store LIKE ?";
    public static UpdateStore: string = "UPDATE store SET store = ? WHERE id = ?";
    public static StoreInsert: string = "INSERT INTO store (name_store) VALUES (?)";
    public static DeleteStore: string = "DELETE FROM store WHERE id = ?";
}

export const DB_CONNECTION_STRING: string = "server=MSI\\SQLEXPRESS;Database=stores;Trusted_Connection=Yes;Driver={SQL Server Native Client 11.0}";
export const NON_EXISTENT_ID: number = -1;


