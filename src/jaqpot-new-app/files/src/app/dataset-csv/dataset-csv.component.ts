import { Component, OnInit, Input ,Output, EventEmitter } from '@angular/core';
import { FormArray, FormGroup, FormControl } from '@angular/forms'
import { Model } from '@euclia/jaqpot-client/dist/models/jaqpot.models';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { AskForIdComponent } from "../ask-for-id/ask-for-id.component"

@Component({
  selector: 'app-dataset-csv',
  templateUrl: './dataset-csv.component.html',
  styleUrls: ['./dataset-csv.component.scss']
})
export class DatasetCsvComponent implements OnInit {

  myformArray = new FormArray([])
  
  @Output() sendData = new EventEmitter<any>();
  @Input() _model: Model;
  
  constructor(
    private dialog: MatDialog
  ) { }

  ngOnInit(){}

  emitData() {
    this.sendData.emit(this.myformArray.controls)
  }

  uploadDataset(files: FileList){
    let reader: FileReader = new FileReader();
    let file: File = files.item(0);
    let currID = "";

    reader.readAsText(file);
    reader.onload = (e) => {
      var _csv = reader.result;
      _csv = _csv.toString()
      const rows = _csv.split(/\r?\n/)  
      let ids = rows[0].split(/,|;/);
      let dialogRef: MatDialogRef<AskForIdComponent>;
      
      dialogRef = this.dialog.open(AskForIdComponent);
      dialogRef.componentInstance.ids = ids
      
      
      dialogRef.afterClosed().subscribe(result =>{
          reader.abort()
          currID = result;

          this.myformArray = new FormArray([])

          let pos = ""

          let first = true;
          let mapping = {}
          let rowIter = 0
          rows.forEach((element) => {
            if (first){

              element.split(/,|;/).forEach(item => {
                mapping[element.split(/,|;/).indexOf(item)] = item;
              });
              first = false;
              pos = Object.keys(mapping).find(key => mapping[key] === currID)
            } else {
              const newGroup=new FormGroup({})

              let currRow = {}
              let iter = 0;

              element.split(/,|;/).forEach(item => {
                if (iter.toString()!==pos){
                  newGroup.addControl(mapping[iter],new FormControl(item))
                } else {
                  newGroup.addControl('ID',new FormControl(item))
                }
                iter = iter + 1;
              });
              if (currID == "None"){
                newGroup.addControl('ID',new FormControl(rowIter))
              }
              this.myformArray.push(newGroup)
            }        

            rowIter = rowIter + 1
          })
          this.emitData();
        })

      
    }
    
  }
  
  downloadTemplate(){
    var csvData:string = "";
    let i = 0;
    let indFeats: Map<string,string> = this._model.additionalInfo['independentFeatures'];
    for (let [key, value] of Object.entries(indFeats)){
      if(i != 0){
        csvData = csvData.concat("," + value)
      }
      else {
        csvData = csvData.concat(value)
      }
      i += 1;
    }

    var blob = new Blob(["\ufeff"+csvData], { type: 'text/csv; charset=utf-8' });
    var url = window.URL.createObjectURL(blob);
    const datasetName = "<%= title %>" + " - Predict Template.csv"
    if(navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, datasetName);
    } else {
      var a = document.createElement("a");
      a.href = url;
      a.download = datasetName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(url);
  }

}
