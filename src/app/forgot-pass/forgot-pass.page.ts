import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { MenuController } from '@ionic/angular';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-pass',
  templateUrl: './forgot-pass.page.html',
  styleUrls: ['./forgot-pass.page.scss'],
})
export class ForgotPassPage implements OnInit {
  formularioForgPass!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private menuController: MenuController,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertController: AlertController,) {
  }


  ngOnInit() {
    this.formularioForgPass = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])]
    });


  }
  doSend() {
    this.showLoading();
    this.userService.recoverPass(this.formularioForgPass.value).subscribe((data: any) => {
      this.loadingCtrl.dismiss();
      this.presentAlert();
      this.formularioForgPass.reset();
      setTimeout(() => {
        this.router.navigate(['/login']);// Redirige a la página /home
      }, 2000); // Espera 2 segundos (2000 milisegundos) antes de redirigir
      
    })

  }
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Cargando informacion, espere...',
      //duration: 2000,

    });

    return await loading.present();
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Contraseña recuperada',
      subHeader: 'Correo enviado',
      message: 'Revisa tu bandeja de entrada',
      buttons: ['OK'],
    });

    await alert.present();
  }



  cerrarMenu() {
    this.menuController.close('end'); // 'end' es el lado del menú a cerrar
  }

}
