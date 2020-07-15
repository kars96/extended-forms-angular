import { Component, OnInit } from '@angular/core';
import { ExtendedFormBuilder } from '../lib/extended-forms/ExtendedFormBuilder';
import { ExtendedFormControl, FormControlMetadata } from 'src/lib/extended-forms/ExtendedFormControl';
import { Validators } from '@angular/forms';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'extended-forms';
  constructor(private readonly formBuilder: ExtendedFormBuilder){
  }

  ngOnInit() {
    console.log(this.formBuilder);
    let fg = this.formBuilder.group({
      'name': [
        ({
          initialValue: 'karthik',
          label: 'Name',
          validators: [{
            message: 'Name is required',
            name: 'required'
          }]
        } as FormControlMetadata),
        [Validators.required]
      ]
    });
    console.log(fg);
  }

}
