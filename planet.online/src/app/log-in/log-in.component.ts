// Log-in component. May need to re-visit, but currently takes the user
// to '/home', which is 'post-list.component'.
// When the user logs in, the Topics are displayed to the user, which
// the user can click upon to view respective posts.

// Things to fix:
// 1. Validators: Is the username email?

import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { AppService } from "../app.service";

@Component({
  selector: "app-log-in",
  templateUrl: "./log-in.component.html",
  styleUrls: ["./log-in.component.css"],
})
export class LogInComponent {
  loginForm: FormGroup;
  username: string = "";
  password: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private service: AppService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ["", [Validators.required, Validators.minLength(5)]],
      password: ["", [Validators.required, Validators.minLength(5)]],
    });
  }

  onSubmit() {
    const formData = this.loginForm.value;
    this.http
      .post("/api/loggedin", {
        username: formData.username,
        password: formData.password,
      })
      .subscribe(
        (response: any) => {
          if (response.status === "success") {
            this.service.setLoggedIn(true);
            this.service.setUsername(formData.username);
            // @ts-ignore
            this.router.navigateByUrl([response.url]);
          } else {
            alert(response.message);
          }
        },
        (error) => {
          console.error(error);
        }
      );
  }
  cancel() {
    this.router.navigate(["/home"]);
  }
}
