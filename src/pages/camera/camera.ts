import { Component, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FirebaseDatabasePicturesService } from '../../providers/firebase-database-pictures/firebase-database-pictures.service';

/**
 * Generated class for the CameraPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-camera',
  templateUrl: 'camera.html',
})
export class CameraPage {

  public pictureSrc: string;

  constructor(
    private _camera: Camera,
    private _firebaseDatabasePicturesService: FirebaseDatabasePicturesService,
    private _ngZone: NgZone,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad CameraPage');
  }

  public takePicture(): void {

    const options: CameraOptions = {
      quality:            25,
      destinationType:    this._camera.DestinationType.DATA_URL,
      sourceType:         this._camera.PictureSourceType.CAMERA,
      encodingType:       this._camera.EncodingType.PNG,
      saveToPhotoAlbum:   false,
      correctOrientation: true,
      allowEdit:          true,
      targetWidth:        200,
      targetHeight:       200
    };

    this._camera.getPicture(options).then(
      (base64Src) => {
        this._ngZone.run(() => {
          this.pictureSrc = 'data:image/png;base64,' + base64Src;
        });
      },
      (error) => {
        // Handle error:
        console.log(error);
      }
    );
  }

  public addPictureToDatabase(): void {
    this._firebaseDatabasePicturesService.addPicture(this.pictureSrc);
    // Reset source of picture:
    this.pictureSrc = null;
  }

  public cancel(): void {
    // Reset source of picture:
    this.pictureSrc = null;
  }
}
