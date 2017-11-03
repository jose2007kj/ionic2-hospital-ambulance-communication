import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
@Injectable()

export class LoginData {
  constructor(public storage: Storage) {
  }

  setData(data) {
    this.storage.set('Data', data);
  }
  setName(data) {
    this.storage.set('Name', data);
  }

  getData() {
    return this.storage.get('Data').then((value) => {
      console.log("inside Data provider and data is :" + value);
      return value;
    });
  }
  getName() {
    return this.storage.get('Name').then((value) => {
      console.log("inside Data provider and name is :" + value);
      return value;
    });
  }
  
}
