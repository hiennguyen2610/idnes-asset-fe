import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenStorageService } from 'src/app/service/token-storage.service';
import { AuthService } from 'src/app/service/auth.service';
import { ShareService } from 'src/app/service/share.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  formGroup: FormGroup;
  successMessage: string;
  invalidLogin = false;
  loginSuccess = false;
  errorMessage = '';
  roles: string[] = [];
  returnUrl: string;

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService,
    private formBuild: FormBuilder,
    private tokenStorageService: TokenStorageService,
    private authService: AuthService,
    private shareService: ShareService,
    private route: ActivatedRoute,
    
  ) {}
  ngOnInit(): void {

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/shopping-plan';

    this.formGroup = this.formBuild.group({
      email: [''],
      password: [''],
      remember_me: ['']
    }
  );

  
  if (this.tokenStorageService.getToken()) {
    const user = this.tokenStorageService.getUser();
    this.authService.isLoggedIn = true;
    this.roles = this.tokenStorageService.getUser().roles[0];
    this.email = this.tokenStorageService.getUser().email;
  }

  }


  onSubmit() {
    this.authService.login(this.formGroup.value).subscribe(
      data => {
        if (this.formGroup.value.remember_me) {
          this.tokenStorageService.saveTokenLocal(data.accessToken);
          this.tokenStorageService.saveUserLocal(data);
        } else {
          this.tokenStorageService.saveTokenSession(data.accessToken);
          this.tokenStorageService.saveUserLocal(data);
        }

        this.authService.isLoggedIn = true;
        this.email = this.tokenStorageService.getUser().email;
        this.roles = this.tokenStorageService.getUser().roles;
        this.formGroup.reset();
        this.router.navigateByUrl(this.returnUrl);
        this.shareService.sendClickEvent();

      },
      err => {
        console.log("loi k dang nhap dc")
      }
    );
  }



  login(email: string, password: string) {
    const apiUrl = 'http://kongproxy-egp-dev.apps.egp.local/api/assetidnes/api/v1/authentication/login';
    const requestData = { email, password };
    this.http.post(apiUrl, requestData).subscribe(
      (response: any) => {
        console.log(response)
        localStorage.clear();
        localStorage.setItem('jwtToken', response.jwt);
        localStorage.setItem('refreshToken', response.refreshToken);
        localStorage.setItem('name', response.name);
        localStorage.setItem('role', response.roles);
        this.openSnackBar('Đăng nhập thành công');
        // this.router.navigate(['/admin/shopping-plan']); 
        this.router.navigateByUrl(this.returnUrl);

      },
      (error) => {
        this.openSnackBar('Thông tin tài khoản không chính xác hoặc chưa được kích hoạt');
      }
    );

  }
  
  goToShoppingPlan() {
    this.router.navigate(['/admin/shopping-plan']); 
  }

  openSnackBar(message: string, action: string = 'Đóng') {
    this.snackBar.open(message, action, {
      duration: 5000, // Thời gian hiển thị thông báo (miligiây)
    });
  }
}
