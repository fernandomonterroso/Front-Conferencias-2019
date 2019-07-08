import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from "../../models/user.model";

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [UserService]
})
export class PerfilComponent implements OnInit {
public users: User
  constructor() { }

  ngOnInit() {
  }

}
