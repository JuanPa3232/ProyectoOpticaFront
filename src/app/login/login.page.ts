import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { LoadingController, MenuController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';



var photo: any;


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  providers: []
})
export class LoginPage implements OnInit {
  formularioLogin!: FormGroup;
  loginAttempts: number = 0;
  showRecoverPasswordOption: boolean = false;
  showPassword = false;
  photos: String[] = [];



  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private menuController: MenuController) {
  }

  ngOnInit() {
    this.formularioLogin = this.formBuilder.group({
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])]
    });
  }
  doCheck() {
    this.showLoading();

    this.userService.loginUser(this.formularioLogin.value).subscribe((data: any) => {
      this.loadingCtrl.dismiss();
      if (Object.is(data, null)) {
        this.presentAlert();
        console.log("El correo o la contraseña son incorrectos")
        if (this.loginAttempts >= 2) {
          this.showRecoverPasswordOption = true;
        } else {
          this.loginAttempts++;
        }
      }
      else {

        /*setTimeout(() => {
          this.router.navigate(['/home']);// Redirige a la página /home
        }, 2000); // Espera 2 segundos (2000 milisegundos) antes de redirigir
        this.photoEmitter.emit(photo);*/

        photo = data[0].photo;
        var base64String = photo;
        const imageElement = document.getElementById('base64-image') as HTMLImageElement;
        imageElement.src = base64String;
        this.formularioLogin.reset();
      }

    });
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
      header: 'Error',
      subHeader: 'Correo o constraseña invalidos',
      message: 'Ingrese los datos nuevamente',
      buttons: ['OK'],
    });

    await alert.present();
  }

  cerrarMenu() {
    this.menuController.close('end'); // 'end' es el lado del menú a cerrar
  }
}


