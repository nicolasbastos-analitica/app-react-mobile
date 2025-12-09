export interface UserData {
    company_code: number;
    company_id: number;
    company_unit_code: number;
    company_unit_id: number;
    employee_code: number;
    login: string;
    name: string;
    password: string;
    status_embedded: number;
    user_id: number;
}

export interface UserDataFile {
    data: UserData[];
}