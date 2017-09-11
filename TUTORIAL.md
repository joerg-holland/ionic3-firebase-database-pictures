# Tutorial
Ionic-Firebase-Database-Pictures Template

Last Update: 08. September 2017

## How to create this template?

1. Open the folder where the project should be created and run the command below. If you are in folder 'c:\projects\' the folder 'c:\projects\ionic-firebase-database-pictures' will be created with all necessary files of the ionic project.
  ```bash
  $ ionic start ionic-firebase-database-pictures blank
  ```
2. Open the folder, which you created the step before and run the command below. If everything was installed successfully a web browser will be open and show you the Ionic blank page of the project.
  ```bash
  $ ionic serve
  ```
3. Generate two tabs with command below. The name of the tabs-page is 'tabs' and the names of the single tabs are 'gallery' and 'camera'.
  ```bash
  $ ionic g tabs tabs
  ```
4. Add the 'TabsPage' to the 'app.module.ts'.
  ```bash
  declarations: [ ... TabsPage, ... ], 
  entryComponents: [ ... TabsPage, ... ],
  ```
5. Import the page 'TabsPage' and change the rootPage from 'HomePage' to 'TabsPage' in the file '/src/app/app.component.ts'.
  ```bash
  import { TabsPage } from '../pages/tabs/tabs';
  rootPage: any = TabsPage;
  ```
6. Install the Ionic Native plugin 'camera' and the packages 'angularfire2' and 'firebase' to the file '/package.json'::
  ```bash
  $ npm install @ionic-native/camera@3.12.1
  $ npm install angularfire2@4.0.0-rc.2
  $ npm install firebase@4.3.0
  ```
7. Add the Cordova plugin 'cordova-plugin-camera' to the file '/config.xml':
  ```bash
  $ ionic cordova plugin add cordova-plugin-camera@2.4.1
  ```
8. Create the folder '/src/environments':
  ```bash
  /src/environments/
  ```
9. Add the file '/src/environments/environment.ts' with your Firebase credentials to the folder '/src/environments':
  ```ts
  export const environment = {
    production: false,
    firebase: {
      apiKey:             "yourApiKey",
      authDomain:         "domain.firebaseapp.com",
      databaseURL:        "https://domain.firebaseio.com",
      storageBucket:      "domain.appspot.com",
      messagingSenderId:  "yourSenderId"
    }
  };
  ```
10. Create the folder '/src/providers/':
  ```bash
  /src/providers/
  ```
11. Create the folder '/src/providers/firebase-database-pictures':
  ```bash
  /src/providers/firebase-database-pictures/
  ```
12. Add the file '/src/providers/firebase-database-pictures/firebase-database-pictures.service.ts':
  ```ts
  import { Injectable } from '@angular/core';
  import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
  
  @Injectable()
  export class FirebaseDatabasePicturesService {
  
    private _path: string = '/pictures/';
  
    constructor(
      public angularFireDatabase: AngularFireDatabase
    ) {}
  
    addPicture(name: string): void {
      this.angularFireDatabase.list(this._path).push(name);
    }
  
    getPictures(): FirebaseListObservable<any[]> {
      return this.angularFireDatabase.list(this._path);
    }
  
    removePicture(id: string): void {
      this.angularFireDatabase.list(this._path).remove(id);
    }
  }
  ```
13. Add the module 'AngularFireDatabaseModule' to the file '/src/app/app.module.ts':
  ```ts
  import { AngularFireDatabaseModule } from 'angularfire2/database';
  imports: [ ...  AngularFireDatabaseModule, ... ],
  ```
14. Add the module 'AngularFireModule' with your Firebase credentials to the file '/src/app/app.module.ts':
  ```ts
  import { AngularFireModule } from 'angularfire2';
  import { environment } from '../environments/environment';
  imports: [ ... AngularFireModule.initializeApp(environment.firebase), ... ],
  ```
15. Add the provider 'FirebaseDatabasePicturesService' to the file '/src/app/app.module.ts':
  ```ts
  import { FirebaseDatabasePicturesService } from '../providers/firebase-database-pictures/firebase-database-pictures.service';
  providers: [ ... FirebaseDatabasePicturesService ... ]
  ```
16. Add the provider 'Camera' to the '/src/app/app.module.ts':
  ```ts
  import { Camera } from '@ionic-native/camera';
  providers: [ ... Camera ... ]
  ```
17. Add the following code to the page '/src/pages/camera/camera.ts':
  ```ts
  import { Component, NgZone } from '@angular/core';
  import { IonicPage, NavController, NavParams } from 'ionic-angular';
  import { Camera, CameraOptions } from '@ionic-native/camera';
  import { FirebaseDatabasePicturesService } from '../../providers/firebase-database-pictures/firebase-database-pictures.service';

  public pictureSrc: string;

  constructor(
    private _camera: Camera,
    private _firebaseDatabasePicturesService: FirebaseDatabasePicturesService,
    private _ngZone: NgZone
  ) {}
  
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
  ```
18. Add the following code to the page '/src/pages/camera/camera.html':
  ```html
  <ion-content padding>
    <!-- No picture taken -->
    <div *ngIf="!pictureSrc">
      <p ion-text>No Picture taken.</p>
      <button ion-button full (click)="takePicture()">Take Picture</button>
    </div>
    <!-- Picture taken -->
    <div *ngIf="pictureSrc">
      <img [src]="pictureSrc">
      <button ion-button full (click)="addPictureToDatabase()">Send to Database</button>
      <button ion-button full color="danger" (click)="cancel()">Cancel</button>
    </div>
  </ion-content>
  ```
19. Add the following code to the page '/src/pages/gallery/gallery.ts':
  ```ts
  import { DomSanitizer } from '@angular/platform-browser';
  import { FirebaseListObservable } from 'angularfire2/database';
  import { FirebaseDatabasePicturesService } from '../../providers/firebase-database-pictures/firebase-database-pictures.service';
  
  public picturesDatabase: FirebaseListObservable<any[]>;
  
  constructor(
    private _firebaseDatabasePicturesService: FirebaseDatabasePicturesService,
    private _sanitizer: DomSanitizer
  ) {
    this.picturesDatabase = this._firebaseDatabasePicturesService.getPictures();
  }
    
  public setPictureDatabaseSource(pictureSrc: string): any {
    return this._sanitizer.bypassSecurityTrustUrl(pictureSrc);
  }

  public removePictureDatabase(id: string): void {
    this._firebaseDatabasePicturesService.removePicture(id);
  }
  ```
20. Add the following code to the page '/src/pages/gallery/gallery.html':
  ```html
  <ion-content padding>
    <ion-card *ngFor="let picture of picturesDatabase | async">
      <img [src]="setPictureDatabaseSource(picture.$value)"/>
      <ion-card-content>
        <button ion-button color="danger" full (click)="removePictureDatabase(picture.$key)">Remove Picture</button>
      </ion-card-content>
    </ion-card>
  </ion-content>
  ```
21. Build the project:
  ```bash
  $ npm run build
  ```
