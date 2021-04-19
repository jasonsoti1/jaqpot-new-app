import { JaqpotAppsSchematics } from "./schema";
import {
  apply,
  forEach,
  mergeWith,
  Rule,
  SchematicContext,
  SchematicsException,
  template,
  Tree,
  url, 
} from '@angular-devkit/schematics';

import { NodePackageInstallTask } from "@angular-devkit/schematics/tasks"

export interface Deps {
  [propertyName: string]: string;
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function jaqpotNewApp(_options: JaqpotAppsSchematics): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const workspaceConfigBuffer = tree.read("angular.json");

    if (!workspaceConfigBuffer) {
      throw new SchematicsException("Not an Angular CLI workspace");
    }

    if (tree.exists('package.json')){
      const jsonStr = tree.read('package.json') !.toString('utf-8');
      const json = JSON.parse(jsonStr)

      const type = 'dependencies';
      if (!json[type]){
        json[type] = {}; 
      }

      const packages:Deps = {
        "@angular/animations": "^11.0.9",
        "@angular/cdk": "^11.2.7",
        "@angular/common": "~11.0.1",
        "@angular/compiler": "~11.0.1",
        "@angular/core": "~11.0.1",
        "@angular/flex-layout": "^11.0.0-beta.33",
        "@angular/forms": "^11.0.9",
        "@angular/material": "^11.2.7",
        "@angular/platform-browser": "~11.0.1",
        "@angular/platform-browser-dynamic": "~11.0.1",
        "@angular/router": "~11.0.1",
        "@euclia/jaqpot-client": "^1.0.4",
        "angular-auth-oidc-client": "^11.6.4",
        "material-design-icons": "^3.0.1",
        "oidc-client": "^1.11.5",
        "rxjs": "~6.6.0",
        "tslib": "^2.0.0",
        "zone.js": "~0.10.2"
      }

      for (let key of Object.keys(packages)) {
        if (!json[type][key]){
          json[type][key] = packages[key];
        }
      }

      tree.overwrite('package.json', JSON.stringify(json, null, 2));
      _context.addTask(new NodePackageInstallTask())
    } else {
      throw new SchematicsException("Cannot find package.json. Please make sure you are on the root of the project!");
    }
    
    const sourceTemplate = url("./files"); 

    const sourceParametrizedTemplate = apply(sourceTemplate, [
      template({
        ..._options,
      }),
      forEach((fileEntry) => {
        if (tree.exists(fileEntry.path)) {
          tree.overwrite(fileEntry.path, fileEntry.content);
          return null;
        }
        return fileEntry;
    })
      
    ]); 
  
    return mergeWith(sourceParametrizedTemplate)(tree,_context);
  };
}