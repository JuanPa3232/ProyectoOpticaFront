import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserService } from '../shared/services/user.service';
import { AlertController, IonDatetime, LoadingController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Toast } from '@capacitor/toast';

var JSON;
var photo64: any;
const IMAGE_DIR = 'stored-images'
@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  providers: []
})
export class RegistroPage implements OnInit {

  showPassword = false;
  showDatePicker = false;
  photos: String[] = [];
  formularioRegistro!: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private loadingCtrl: LoadingController,
    private router: Router,
    private alertController: AlertController,
    private menuController: MenuController,
    private plt: Platform,) {


  }
  ngOnInit(): void {

    this.formularioRegistro = this.formBuilder.group({
      'name': [null, Validators.compose([
        Validators.required
      ])],
      'lastname': [null, Validators.compose([
        Validators.required
      ])],
      'username': [null, Validators.compose([
        Validators.required
      ])],
      'email': [null, Validators.compose([
        Validators.required
      ])],
      'birth': [null, Validators.compose([
        Validators.required
      ])]
      ,
      'age': [null, Validators.compose([
        Validators.required
      ])],
      'phone': [null, Validators.compose([
        Validators.required
      ])],
      'password': [null, Validators.compose([
        Validators.required
      ])],

    });

  }

  doSave() {

    if (!this.isValidEmail(this.formularioRegistro.value.email)) {
      this.presentAlert();
      this.formularioRegistro.reset();
      return;
    }

    this.showLoading();
    JSON=this.formularioRegistro.value
   JSON.photo=photo64;
    this.userService.registerUser(JSON).subscribe((data: any)=>{
      this.loadingCtrl.dismiss();

     
      if (Object.is(data,null)) {
        Toast.show({
          text: 'Error al registrar el usuario: El correo ingresado esta ya estaba registrado',
        });
      } else {
        Toast.show({
          text: 'Usuario registrado con exito',
        });
      }
      setTimeout(() => {
        this.router.navigate(['/login']);// Redirige a la página /home
      }, 2000); // Espera 2 segundos (2000 milisegundos) antes de redirigir
      this.formularioRegistro.reset();
    })
  }



  isValidEmail(email: string): boolean {
    const emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailPattern.test(email);
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
      subHeader: 'Correo denegado',
      message: 'Ingrese un correo valido',
      buttons: ['OK'],
    });

    await alert.present();
  }

  cerrarMenu() {
    this.menuController.close('end'); // 'end' es el lado del menú a cerrar
  }
  async takePhoto(){
    const photo = await Camera.getPhoto({
      resultType:CameraResultType.Uri,
      source:CameraSource.Prompt,
      quality:100
    });
    if (photo.webPath) {
      this.photos.shift();
      this.photos.unshift(photo.webPath);

    }
    if (photo) {
      this.saveImage(photo)
    }
  }
    // Create a new file from a capture image
    async saveImage(photo: Photo) {
      const base64Data = await this.readAsBase64(photo);
      photo64= base64Data
      const fileName = new Date().getTime() + '.jpeg';
      const savedFile = await Filesystem.writeFile({
        path: `${IMAGE_DIR}/${fileName}`,
        data: base64Data,
        directory: Directory.Data,
        
      });
      console.log(fileName);
      
  
    }
  
    // https://ionicframework.com/docs/angular/your-first-app/3-saving-photos
    private async readAsBase64(photo: Photo) {
      if (this.plt.is('hybrid')) {
        const file = await Filesystem.readFile({
          path: photo.path || ''
        });
        console.log(file)
        return file.data;
      }
      else {
        // Fetch the photo, read as a blob, then convert to base64 format
        const response = await fetch(photo.webPath || '');
        const blob = await response.blob();
  
        return await this.convertBlobToBase64(blob) as string;
      }
    }
  
    // Helper function
    convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
      const reader = new FileReader;
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}





