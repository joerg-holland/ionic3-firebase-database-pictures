import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { FirebaseListObservable } from 'angularfire2/database';
import { FirebaseDatabasePicturesService } from '../../providers/firebase-database-pictures/firebase-database-pictures.service';

/**
 * Generated class for the GalleryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-gallery',
  templateUrl: 'gallery.html',
})
export class GalleryPage {

  public picturesDatabase: FirebaseListObservable<any[]>;

  constructor(
    private _firebaseDatabasePicturesService: FirebaseDatabasePicturesService,
    private _sanitizer: DomSanitizer,
    public navCtrl: NavController,
    public navParams: NavParams
  ) {
    this.picturesDatabase = this._firebaseDatabasePicturesService.getPictures();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad GalleryPage');
  }

  public setPictureDatabaseSource(pictureSrc: string): any {
    return this._sanitizer.bypassSecurityTrustUrl(pictureSrc);
  }

  public removePictureDatabase(id: string): void {
    this._firebaseDatabasePicturesService.removePicture(id);
  }
}
