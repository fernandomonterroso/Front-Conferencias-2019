import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { Conferencia } from 'src/app/models/conferencia.model';
import { ConferenciaService } from 'src/app/services/conferenica.service';
import * as jsPDF from 'jspdf';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-conferencias',
  templateUrl: './conferencias.component.html',
  styleUrls: ['./conferencias.component.scss'],
  providers: [UserService, ConferenciaService]
})
export class ConferenciasComponent implements OnInit {
  public conferencias: Conferencia;
  public conferenciaModel: Conferencia;
  public conferenciaSeleccionada: Conferencia;
  public identity;
  public token;
  public status;
  public admin: boolean;
  public loading: boolean;

  constructor(private _conferenceService: ConferenciaService, private _userService: UserService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.conferenciaModel = new Conferencia('', '', '', '', '', 0, new Date(Date.now()), 0, '');
    this.conferenciaSeleccionada = new Conferencia('', '', '', '', '', 0, new Date(Date.now()), 0, '');
    this.admin = false;
    this.activarCarga();
  }

  ngOnInit() {
    if (this.identity.rol == 'ROLE_ADMIN') {
      console.log('hola admin')
      this.admin = true;
    }
    this.getConferences()
  }

  public activarCarga() {
    this.loading = true;
  }

  public desactivarCarga() {
    this.loading = false;
  }

  public getConferences() {
    this._conferenceService.getConferences().subscribe(
      response => {
        if (response.charlas) {
          console.log(response.charlas);
          this.desactivarCarga();
          this.conferencias = response.charlas;
          this.status = 'OK'
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          Swal.fire(error.error.message)
          this.status = 'error'
        }
      }
    )
  }

  public getConference(id) {
    this._conferenceService.getConference(id).subscribe(
      response => {
        if (response.charla) {
          console.log(response.charla);
          this.conferenciaSeleccionada = response.charla;
          this.status = 'OK';
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error'
        }
      }
    )
  }

  public addConference() {
    setTimeout(() => {
      this._conferenceService.addConference(this.token, this.conferenciaModel).subscribe(
        response => {
          console.log(response.charla)
          if (response.charla) {
            console.log(response.charla);
            this.desactivarCarga(); 
            Swal.fire({
              text: 'Conferencia creada',
              type: 'error'
            })
            this.getConferences();
            this.status = 'Ok'
          } else {
            this.desactivarCarga()
            console.log(response)
          }
        },
        error => {
          var errorMessage = <any>error;
          console.log(errorMessage)
          if (errorMessage != null) {
            this.desactivarCarga()
            Swal.fire({
              text: error.error.message,
              type: 'error'
            })
            this.status = 'error'
          }
        }
      )
    }, 1500);
  }

  updateConference(id){
    setTimeout(() => {
      this._conferenceService.updateConference(id,this.conferenciaSeleccionada).subscribe(      
        response => {          
          if(!response.charla){          
            this.status='error';
            this.desactivarCarga()
            Swal.fire({
              text: response.message,
              type: 'error'
            })
          }else{
            this.status = 'ok';          
            this.desactivarCarga()
            Swal.fire({
              text: 'La conferencia se a editado',
              type: 'success'
            })
            this.getConferences()          
          }        
        },
        error => {        
          var errorMessage = <any>error;
          this.desactivarCarga()
          console.log(errorMessage);
          if(errorMessage != null){
            this.status = 'error';
          }
        }
      )
    }, 1500);
  }

  deleteConference(id){
    setTimeout(() => {
      this._conferenceService.deleteConference(this.token, id).subscribe(
        response=>{
          this.getConferences();
          if(response.conferencia){
            Swal.fire({
              text: 'Conferencia Eliminada',
              type: 'success'
            })          
            this.desactivarCarga()
            this.conferenciaSeleccionada =  response.conferencia;          
            this.status='OK';
          } 
        },
        error=>{
          var errorMessage = <any>error;
          console.log(errorMessage);
          this.desactivarCarga()
          if(errorMessage != null){
            Swal.fire({
              text: error.error.message,
              type: 'error'
            })
            this.status = 'error'
          }
        }      
      )    
    }, 1500);
  }

  descargarPdf(){
    var x = Math.floor((Math.random() * 100) + 1);
    var y = Math.floor((Math.random() * 100) + 1);
    const doc = new jsPDF();
    doc.text('Hola esta es tu entrada para poder entrar al solon de la charla', 15,25);
    doc.save('Entrada'+x+'-'+y+'.pdf');

    console.log(doc)
  }

}
