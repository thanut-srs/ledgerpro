import { IonicModule } from 'ionic-angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AddTransactionComponent } from './add-transaction/add-transaction';

@NgModule({
	declarations: [AddTransactionComponent],
	imports: [IonicModule],
	exports: [AddTransactionComponent],
	schemas: [ CUSTOM_ELEMENTS_SCHEMA ]

})
export class ComponentsModule {}
