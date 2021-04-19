import { Component, OnInit, Input, AfterViewInit, ViewChild, OnChanges } from '@angular/core';
import { JaqpotService } from '../jaqpot-client/jaqpot-client.service';
import { MatTableDataSource } from '@angular/material/table'
import { MatSort } from '@angular/material/sort';


export interface PredictionFields{
  id: any;
  pred: any;
}

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.scss']
})

export class PredictionsComponent implements OnInit, AfterViewInit {

  constructor(
    private _jaqpotApi:JaqpotService
  ) { }

  @Input() sendFeatures: Array<Object>;
  @Input() ids: Array<string>;

  calcPrediction:boolean = false;
  predsOK:boolean = false;
  independent = "";

  tablePreds = new MatTableDataSource();

  predColumns:string[] = ['id', 'pred']
  predsSource: PredictionFields[] = []

  @ViewChild(MatSort) sort: MatSort;


  ngOnInit() {}
  

  ngAfterViewInit() {
    this.tablePreds.sort = this.sort;
  }

  predict(){
    const predsSource = []    
    this.calcPrediction = true

    this._jaqpotApi.predict("<%= modelId %>" ,this.sendFeatures).subscribe(m =>{
            this.independent = Object.keys(m.predictions[0])[0]
            const predictions = m.predictions.map(col => col[this.independent]);
            
            for (let i in this.ids) {
  
              predsSource.push({
                  id: this.ids[i],
                  pred: predictions[i]
              })
            }

            this.tablePreds.data = predsSource;

            this.calcPrediction = false
            this.predsOK = true
    })
  }

  ngOnChanges(changes) {
    this.predict();  
  }
  
}
