import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from '../services/authentication.service';
@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.sass']
})
export class ForgotPasswordComponent implements OnInit {
    send: boolean = false;
    email: string;

    constructor(private authenticationService: AuthenticationService) {}

    ngOnInit() {}
    onSubmit() {
        this.authenticationService.forgotPassword(this.email).subscribe(
            data => {
                this.send = true;
            }
        );
    }
}
