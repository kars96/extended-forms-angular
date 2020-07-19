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
  fg: any;
  constructor(private readonly formBuilder: ExtendedFormBuilder) {
  }

  ngOnInit() {
    console.log(this.formBuilder);
    this.fg = this.formBuilder.group({
      'name': {
        initialValue: '',
        label: 'Name',
        maxLength: 4,
        validators: [{
          validatorName: 'required',
          staticMessage: 'Name is required'
        }]
      }});
    console.log(this.fg);
  }

}
