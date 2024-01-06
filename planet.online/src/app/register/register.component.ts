import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.css"],
})
export class RegisterComponent implements OnInit {
  user = { username: "", password: "" };

  constructor(private http: HttpClient, private router: Router) {}
  ngOnInit(): void {}

  addUser() {
    this.http.post("/api/register", this.user).subscribe(
      (res) => {
        console.log(res);
        alert("Registration successful");
        this.router.navigate(["/login"]);
      },
      (err) => {
        if (err.status === 409) {
          console.log(err);
          alert("Username already taken");
          this.router.navigate(["/register"]);
        } else {

          alert("Error! Please try again");
          this.router.navigate(["/register"]);
        }
      }
    );
  }

  cancel() {
    this.router.navigate(["/home"]);
  }

  gotoHome() {
    console.log("add working");
  }
}
