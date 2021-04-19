import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-ask-for-id',
  templateUrl: './ask-for-id.component.html',
  styleUrls: ['./ask-for-id.component.scss']
})

export class AskForIdComponent implements OnInit {

  selected = ''

  possible_ids:string[] = []
  csv:string;
  ids:string[] = []

  verify:boolean = false;

  constructor() { }

  ngOnInit() {
    this.possible_ids.push("None");
    this.ids.forEach(id => {
      this.possible_ids.push(id)
    })
  }

  idChanged($event){
    this.verify = true
  }

}