import { SqlProvider } from './../../providers/sql/sql';
import { Component, NgModule } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ActionSheetController } from 'ionic-angular';
import { FormBuilder, Validators, FormGroup, NgModel } from '@angular/forms';

/**
 * Generated class for the AddTransactionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-transaction',
  templateUrl: 'add-transaction.html',
})
export class AddTransactionPage {
  public transaction: FormGroup;
  public tag: NgModel;
  public type: NgModel;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public actionSheetCtrl:ActionSheetController,
    private formBuilder: FormBuilder,
    private sql: SqlProvider
    ) {
      
      this.transaction = this.formBuilder.group({
        amount: ['', Validators.required],
        memo: [''],
      });
  }

  ngOnInit() {
  
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddTransactionPage');
  }
  logForm(){
    console.log(this.transaction.value,"||",this.tag, "||",this.type);
    
  }
  onDeleteTable(){
    this.sql.dropTable();
  }
  onAddTable(){
    this.sql.createTable();
  }
}