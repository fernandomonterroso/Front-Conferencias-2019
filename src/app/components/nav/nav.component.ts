import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
  providers: [UserService]
})
export class NavComponent implements OnInit {
  public identity;
  public token;
  public admin:boolean;
  constructor(private _userService: UserService, private _router: Router) { 
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.admin = false
  }

  ngOnInit() {
    
    if(this.identity){
      if(this.identity.rol == 'ROLE_ADMIN'){
        console.log('hola admin')
        this.admin = true;
      }else{
        console.log('hola user')
      }
    }else{
      console.log('no estas logueado')
    }
  }

  cerrarSesion(){
    sessionStorage.clear();    
    setTimeout(() => {  
      window.location.reload()
      setTimeout(() => {
        this._router.navigate(['/home']);    
      }, 100);
    }, 0);
  }
}
