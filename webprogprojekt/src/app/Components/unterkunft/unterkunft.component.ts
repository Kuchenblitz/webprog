import { Component, OnInit } from '@angular/core';
import { Unterkunft } from '../../models/Unterkunft';

@Component({
  selector: 'app-unterkunft',
  templateUrl: './unterkunft.component.html',
  styleUrls: ['./unterkunft.component.css']
})
export class UnterkunftComponent implements OnInit {
  unterkuenfte: Unterkunft[];
  constructor() { }
    
  ngOnInit() {
    this.unterkuenfte = [
      {
        id: 1,
        title: 'Berghütte',
        text: 'das ist eine Hütte auf nem Berg'
      },
      {
        id: 2,
        title: 'Seehütte',
        text: 'das ist eine Hütte an nem See'
      },
      {
        id: 3,
        title: 'Waldhütte',
        text: 'das ist eine Hütte in nem Wald'
      }
    ]
  }

}
