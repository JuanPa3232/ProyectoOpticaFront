import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class UserService {
url = environment.api;
  constructor(public http:HttpClient) {
  }

    registerUser(form:any){
      let request;
    console.log(form);
    return this.http.post(this.url+'/users/create',
    form);
    }
    loginUser(form:any){
      let request
      return this.http.post(this.url+'/users/login',form)
    }
    recoverPass(form:any){
      let request
      return this.http.post(this.url+'/users/forgotpass',form)
    }

    
}
