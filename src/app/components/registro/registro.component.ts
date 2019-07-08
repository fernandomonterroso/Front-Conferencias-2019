import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import Swal from 'sweetalert2';

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

  constructor(private _userService: UserService) {
    this.user = new User('','', '', '', '', '', [{ productTableId: '', nombreProducto: '', cantidad: 0, precioIndividual: 0, totalProducto: 0 }], 0, '')
    this.loading = false
    this.cont = 0
  }

  ngOnInit() {
  }

  public cleanVarieables() {
    this.user = new User('','', '', '', '', '', [{ productTableId: '', nombreProducto: '', cantidad: 0, precioIndividual: 0, totalProducto: 0 }], 0, '')
  }

  public activarCarga() {
    this.loading = true;
  }

  public desactivarCarga() {
    this.loading = false;
  }

  public register() {
    setTimeout(() => {
      this._userService.register(this.user).subscribe(
        response => {
          if (response) {
            console.log(response)
            this.desactivarCarga()            
              Swal.fire(response.message)            
              this.status = 'OK'                            
              this.cleanVarieables()
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
