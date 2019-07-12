import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './global.service';
import { Conferencia } from "../models/conferencia.model";
import { Observable } from 'rxjs';
import { UserService } from './user.service';
import { Auxiliar } from '../models/auxiliar.model';

@Injectable()
export class ConferenciaService {
    public url: string;
    public identity;
    public token;

    constructor(public _http: HttpClient, public _userService: UserService) {
        this.url = GLOBAL.url;
    }

    addConference(token, conferencia: Conferencia): Observable<any> {
        let params = JSON.stringify(conferencia);
        let headers = new HttpHeaders().set('Content-type', 'application/json').set('Authorization', token);
        return this._http.post(this.url + '/charla/register', params, { headers: headers });
    }

    getConferences(): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.get(this.url + '/charla/list', { headers: headers })
    }

    getConference(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this._http.get(this.url + '/charla/search/' + id, { headers: headers })
    }

    updateConference(id,conferencia: Conferencia): Observable<any>{
        let params = JSON.stringify(conferencia);
        let headers = new HttpHeaders().set('Content-type','application/json').set('Authorization', this._userService.getToken());
        console.log(conferencia+" params"+params)
        return this._http.put(this.url + '/charla/edit/'+id,params, {headers: headers});
    }

    deleteConference(token, id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', token);
        
        return this._http.delete(this.url + '/charla/delete/' + id, { headers: headers })
    }

    assistConference(id,doc: Auxiliar):Observable<any>{        
        let headers = new HttpHeaders().set('Content-type','application/json').set('Authorization', this._userService.getToken());
        
        let params = JSON.stringify(doc);
        console.log("service"+params +" Token: "+this._userService.getToken())
        return this._http.put(this.url + '/charla/occupy/'+id, params ,{headers: headers});
    }

}