import { Component, OnInit, Input } from '@angular/core';
import { Unterkunft } from 'src/app/models/Unterkunft';

@Component({
  selector: 'app-unterkunft-item',
  templateUrl: './unterkunft-item.component.html',
  styleUrls: ['./unterkunft-item.component.css']
})
export class UnterkunftItemComponent implements OnInit {
  @Input() unterkunft: Unterkunft;

  constructor() { }

  ngOnInit() {
  }

}
