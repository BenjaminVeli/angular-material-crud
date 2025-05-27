export class EmployeeModel {
    empId: number;
    name: string;
    city: string;
    state: string;
    email: string;
    contactNo: string;
    address: string;
    pinCode: string;

    constructor() {
        this.empId = 0;
        this.name = '';
        this.city = '';
        this.state = '';
        this.email = '';
        this.contactNo = '';
        this.address = '';
        this.pinCode = '';
    }
}