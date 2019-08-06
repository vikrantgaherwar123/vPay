import { Injectable, Inject } from '@angular/core';
import { StorageService, LOCAL_STORAGE } from 'ngx-webstorage-service';

var STORAGE_KEY = 'local_todolist';
@Injectable({
  providedIn: 'root'
})
export class NewProductService {
 
 anotherTodolist = [];
  constructor(@Inject(LOCAL_STORAGE) private storage: StorageService) { }
  
  public storeOnLocalStorage(mtitle: string, murl: string, mprice: string): void {

    // get array of tasks from local storage
    const currentTodoList = this.storage.get(STORAGE_KEY) || [];
    // push new task to array
    currentTodoList.push({
      title: mtitle,
      url: murl,
      price: mprice,
      isChecked: false
    });
    // insert updated array to local storage
    this.storage.set(STORAGE_KEY, currentTodoList);
    console.log(this.storage.get(STORAGE_KEY) || 'LocaL storage is empty');
  }

  public getLocalStorage(){
    return this.storage.get(STORAGE_KEY);
  }
}
