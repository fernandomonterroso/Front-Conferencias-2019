import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public user: User
  public status;
  public token;
  public identity;
  public loading: boolean;

  constructor(private _userService: UserService, private _router: Router) {
    this.user = new User('','', '', '', '', '', [{ productTableId: '', nombreProducto: '', cantidad: 0, precioIndividual: 0, totalProducto: 0 }], 0, '')    
  }

  ngOnInit() {
  }

  public activarCarga(){
    this.loading = true
  }

  public desactivarCarga(){
    this.loading = false
  }

  public cleanVarieables() {
    this.user = new User('','', '', '', '', '', [{ productTableId: '', nombreProducto: '', cantidad: 0, precioIndividual: 0, totalProducto: 0 }], 0, '')
  }

  public getToken() {
    this._userService.login(this.user, 'true').subscribe(
      response=>{
        this.token = JSON.stringify(response.token);   
        console.log('este es el token -- ' + this.token);
             
        if(this.token.length <= 0){
          this.status = 'error'
        }else{
          sessionStorage.setItem('token', this.token);
          this._router.navigate(['/home']);
          setTimeout(() => {  
            window.location.reload()
            setTimeout(() => {
              this._router.navigate(['/home']);    
            }, 100);
          }, 0); 
        }
      },
      error=>{
        var errorMessage = <any>error;
        console.log(errorMessage);
        if(errorMessage != null){
          this.status = 'error';
        }
      }
    )
  }    

  public login() {
    setTimeout(() => {
      this._userService.login(this.user).subscribe(
        response => {
          this.identity = response.user;               
          if(!this.identity){
            this.desactivarCarga();
            Swal.fire(response.message);
            this.status = 'error';
          }else{
            sessionStorage.setItem('identity', JSON.stringify(this.identity));
            this.getToken();
            sessionStorage.setItem('token', JSON.stringify(this.token))
            this.desactivarCarga();
            this.status = 'ok';            
                      
          }
        },
        error => {
          var errorMessage = <any>error;
          if (errorMessage != null) {
            Swal.fire(error.error.message);
            this.status = 'error';
            this.desactivarCarga()
            this.cleanVarieables()
          }
        }
      )
    }, 1500);
  }

}
