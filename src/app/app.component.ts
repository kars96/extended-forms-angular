import { Component, OnInit } from '@angular/core';
import { ExtendedFormBuilder } from '../lib/extended-forms/ExtendedFormBuilder';
import { ExtendedFormControl, FormControlMetadata } from 'src/lib/extended-forms/ExtendedFormControl';
import { Validators, FormGroup, AbstractControl } from '@angular/forms';
import { IValidationMessage, ExtendedValidator } from 'src/lib/extended-forms/ExtendedValidator';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'extended-forms';
  fg: FormGroup;
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
      }
    });
    console.log(this.fg);
    (this.fg.controls.name as ExtendedFormControl).addValidator(ExtendedValidator.create('illegalChar#', this.illegalChar('#')));
    (this.fg.controls.name as ExtendedFormControl).addValidator(ExtendedValidator.create('illegalChar*', this.illegalChar('*')));
  }

  public illegalChar(char: string) {

    return (control: AbstractControl): IValidationMessage => {
      if(control.value && (control.value as string).includes(char)) {
        return {
          message: char + ' is illegal' 
        }
      }
      return null;
    }
  }

}
