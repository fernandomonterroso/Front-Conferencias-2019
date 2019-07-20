import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { text } from '@angular/core/src/render3';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.scss'],
  providers: [UserService]
})
export class RegistroComponent implements OnInit {
  public user: User;
  public status;
  public loading: boolean;
  public cont: number;
  public codigo: string;

  constructor(private _userService: UserService, private _router: Router) {
    this.user = new User('','', '', '', '', '', [{ productTableId: '', nombreProducto: '', cantidad: 0, precioIndividual: 0, totalProducto: 0 }], 0, '')
    this.loading = false
    this.cont = 0
    this.codigo = ""
  }

  ngOnInit() {
    this.nuevoCodigo()    
  }

  public cleanVarieables() {
    this.user = new User('','', '', '', '', '', [{ productTableId: '', nombreProducto: '', cantidad: 0, precioIndividual: 0, totalProducto: 0 }], 0, '')
  }

  public nuevoCodigo(){
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 6; i++ ) {
      this.codigo += characters.charAt(Math.floor(Math.random() * charactersLength));
    }    
  }

  public activarCarga() {
    this.loading = true;
  }

  public desactivarCarga() {
    this.loading = false;
  }

  public codigoVerificacion() {
    var correo = (<HTMLInputElement>document.getElementById('inputEmail')).value; 
    setTimeout(() => {
      if(correo){
      this._userService.confirmarEmail(correo, this.codigo).subscribe(
        response => {
          if (response ) {
            console.log(response)
            this.desactivarCarga()            
            Swal.fire(response.message)            
            this.status = 'OK'                            
          }        
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          this.loading = false;
          Swal.fire(error.error.message)
          this.status = 'error'
          this.cleanVarieables()
        }
      }
    )}else{
      this.desactivarCarga()            
      Swal.fire('No ha ingresado ningun correo')            
      this.status = 'OK'                            
      this.cleanVarieables()
    }
  }, 1500);
}

  public register() {
    var codigoVer = (<HTMLInputElement>document.getElementById('codigoVer')).value; 
    if( codigoVer != this.codigo){
      Swal.fire("El codigo ingresado no coincide")            
      this.status = 'OK'                            
      this.cleanVarieables();      
    }
    setTimeout(() => {
      this._userService.register(this.user).subscribe(
        response => {
          if (response) {
            console.log(response)
            this.desactivarCarga()            
              Swal.fire(response.message)            
              this.status = 'OK'       
              $("#ver").modal("hide");
              this._router.navigate(['/login']);
            }          
        },
        error => {
          var errorMessage = <any>error;
          if (errorMessage != null) {
            this.loading = false;
            Swal.fire(error.error.message)
            this.status = 'error'
            this.cleanVarieables()
          }
        }
      )
    }, 1500);
  }
}
