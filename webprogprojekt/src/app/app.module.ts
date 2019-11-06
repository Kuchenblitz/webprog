import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { FreizeitverwaltungComponent } from './Components/freizeitverwaltung/freizeitverwaltung.component';
import { CarouselComponent } from './Components/carousel/carousel.component';
import { UnterkunftComponent } from './Components/unterkunft/unterkunft.component';

@NgModule({
  declarations: [
    AppComponent,
    FreizeitverwaltungComponent,
    CarouselComponent,
    UnterkunftComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
