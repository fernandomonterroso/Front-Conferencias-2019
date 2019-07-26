import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Conferencia } from '../../models/conferencia.model';
import { ConferenciaService } from '../../services/conferenica.service';
import * as jsPDF from 'jspdf';
import Swal from 'sweetalert2';
import { Auxiliar } from 'src/app/models/auxiliar.model';

@Component({
  selector: 'app-conferencias',
  templateUrl: './conferencias.component.html',
  styleUrls: ['./conferencias.component.scss'],
  providers: [UserService, ConferenciaService]
})
export class ConferenciasComponent implements OnInit {
  @ViewChild('timeConf') formValues;
  public conferencias: Conferencia;
  public conferenciaModel: Conferencia;
  public conferenciaSeleccionada: Conferencia;
  public identity;
  public token;
  public status;
  public admin: boolean;
  public loading: boolean;
  public usuarioPdf:boolean = false;
  public auxiliarVariable: Auxiliar;
 

  constructor(private _conferenceService: ConferenciaService, private _userService: UserService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.conferenciaModel = new Conferencia('', '', '', '', '', 0,'' , 0, '','');
    this.conferenciaSeleccionada = new Conferencia('', '', '', '', '', 0, '', 0, '','');
    this.admin = false;
    this.activarCarga();
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

  public notificarRecordatorioCorreo(id) {
    setTimeout(() => {
      this._conferenceService.NotificarConferencia(id).subscribe(
        response => {
          console.log("RESPONSE::"+response)
          if (response.message) {
            console.log(response.message);
            this.desactivarCarga(); 
            Swal.fire({
              text: response.message,
              type: 'success'
            })
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

  public addConference() {
    console.log();
    this.conferenciaModel.fecha = this.conferenciaModel.fecha+ ' '+ this.formValues.nativeElement.value
    setTimeout(() => {
      this._conferenceService.addConference(this.token, this.conferenciaModel).subscribe(
        response => {
          console.log(response.charla)
          if (response.charla) {
            console.log(response.charla);
            this.desactivarCarga(); 
            Swal.fire({
              text: 'Conferencia creada',
              type: 'success'
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

  asistir(id){
    this.correoQR();
    this.auxiliarVariable = new Auxiliar(this.extraccionHTML.innerHTML);
    this._conferenceService.assistConference(id, this.auxiliarVariable).subscribe(
      response=>{
        console.log(JSON.stringify(response));        
        if(response.message){          
          this.status='error';
          this.desactivarCarga()
          Swal.fire({
            text: response.message,
            type: 'success'
          })          
          
          if(response.message == "inscripcion generada exitosamente"){
            this.descargarPdf();  
          }
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
  }

  public extraccionHTML
  correoQR(){
    var x = Math.floor((Math.random() * 100) + 1);
    var y = Math.floor((Math.random() * 100) + 1);
    var doc = new jsPDF('l', 'pt','a5',false);
    this.extraccionHTML = document.getElementById('print'); 

        var specialElementHandlers = {
            '#bypassme': function (element, renderer) {
                return true
            }
        };
      const  margins = {
            top: 20,
            bottom: 20,
            left: 20,
            width: 530,
        };

        doc.fromHTML(
            this.extraccionHTML, 
            margins.left,  
            margins.top, { 
                'width': margins.width, 
                'elementHandlers': specialElementHandlers
            },
            
            
        );
   
 
    
    // console.log(this.adios.innerHTML) 
  }


  descargarPdf(){
    var x = Math.floor((Math.random() * 100) + 1);
    var y = Math.floor((Math.random() * 100) + 1);
    var doc = new jsPDF('l', 'pt','a5',false);
    var source = document.getElementById('print'); 

        var specialElementHandlers = {
            '#bypassme': function (element, renderer) {
                return true
            }
        };
      const  margins = {
            top: 20,
            bottom: 20,
            left: 20,
            width: 530,
        };

        doc.fromHTML(
            source, 
            margins.left,  
            margins.top, { 
                'width': margins.width, 
                'elementHandlers': specialElementHandlers
            },
            
            function (dispose) {
              doc.save('Entrada'+x+'-'+y+'.pdf');
            }, margins
        );
   
 
    console.log(doc)
  }
}