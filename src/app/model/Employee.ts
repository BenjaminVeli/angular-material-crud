export class EmployeeModel {
    _id?: string;
    name: string;
    email: string;
    position: string;
    phone: string;
    address: string;

    constructor() {
        this._id = '';
        this.name = '';
        this.email = '';
        this.position = '';
        this.phone = '';
        this.address = '';
    }
}