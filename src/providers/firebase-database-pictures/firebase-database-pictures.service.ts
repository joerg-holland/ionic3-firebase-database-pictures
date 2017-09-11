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
