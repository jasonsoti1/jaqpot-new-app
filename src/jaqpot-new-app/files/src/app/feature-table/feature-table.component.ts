import { Component, AfterViewInit, OnInit, ViewChild, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms'
import { MatTable, MatTableDataSource } from '@angular/material/table'
import { Model, Prediction } from '@euclia/jaqpot-client/dist/models/jaqpot.models';
import { JaqpotService } from '../jaqpot-client/jaqpot-client.service';


export interface PredictionFields{
  id: any;
  pred: any;
}


@Component({
  selector: 'feature-table-component',
  styleUrls: ['feature-table.component.scss'],
  templateUrl: 'feature-table.component.html',
  
})


export class FeatureTableComponent implements OnInit {


  @ViewChild(MatTable, { static: true }) table: MatTable<any> 
  
  displayedColumns: string[] = ['ID'];
  displayedHead:string[]=['ID']
  displayedFields:string[] = ['ID'];
  
  myformArray = new FormArray([])
  dataSource = this.myformArray.controls;


  _model:Model

  goToPrediction:boolean = false
  sendFeatures = []
  ids = []
  columns: number = 0;

  constructor(
    private _jaqpotApi:JaqpotService
  ) { }



  ngOnInit() {
    
    this._jaqpotApi.getModelById("<%= modelId %>" ).subscribe(m =>{
      this._model = m
      let dict:{ [key: string]: any; } = m.additionalInfo.independentFeatures
      this.displayedColumns = this.displayedColumns.concat(Object.values(dict))
      this.displayedColumns.push("delete")
      this.displayedHead = this.displayedHead.concat(Object.values(dict))
      this.displayedFields = this.displayedFields.concat(Object.values(dict))
      this.columns = this.displayedHead.length+1  

      // add first row
      const newGroup=new FormGroup({})
      this.displayedFields.forEach(x=>{
        newGroup.addControl(x,new FormControl())
      })
      this.myformArray.push(newGroup)
  
      this.dataSource = [...this.myformArray.controls];
      
    })

  }

  receiveData($event){
    this.dataSource = $event
    this.myformArray.controls = $event
  }

  delete(index: number) {
    this.myformArray.removeAt(index);
    this.table.renderRows()
    this.dataSource = [...this.myformArray.controls];


  }
  add() {
    const newGroup=new FormGroup({});
    this.displayedFields.forEach(x=>{
      newGroup.addControl(x,new FormControl())
    })
    this.myformArray.push(newGroup)

    this.dataSource = [...this.myformArray.controls];
  }
  

  submit(){
    this.sendFeatures = [];
    this.ids = [];
    
    this.myformArray.controls.forEach( (element) => {
      this.ids.push(element.value.ID);
      this.sendFeatures.push((({ ID, ...o }) => o)(element.value))
    });
    
    this.goToPrediction = true;
  }

}
