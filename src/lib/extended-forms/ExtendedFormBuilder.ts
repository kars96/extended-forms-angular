import { FormBuilder, FormControl, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, Validators } from '@angular/forms';
import { FormControlMetadata, ExtendedFormControl, ValidatorMetadata, ValidatorWithMeta } from './ExtendedFormControl';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExtendedFormBuilder extends FormBuilder {
    control(formState: FormControlMetadata, validatorOrOpts?: ValidatorFn | ValidatorFn[] |
        ValidatorWithMeta | ValidatorWithMeta[] | AbstractControlOptions | null,
            asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControl {
        let validators: ValidatorFn[] = [];
        let validatorMeta: ValidatorMetadata[] = [];
        if (Array.isArray(validatorOrOpts)) {
            if (validatorOrOpts.length > 0 && 'name' in validatorOrOpts[0]) {
                validators = (validatorOrOpts as ValidatorWithMeta[]).map(val => val.validatorRef);
                validatorMeta = (validatorOrOpts as ValidatorMetadata[]).map(val => ({...val, active: true}));
            } else if (validatorOrOpts.length) {
                validators = (validatorOrOpts as ValidatorFn[]);
            }
        } else {
            if ('name' in validatorOrOpts) {
                validators = [(validatorOrOpts as ValidatorWithMeta).validatorRef];
                validatorMeta.push({...(validatorOrOpts as ValidatorWithMeta), active: true});
            } else {
                validators = validatorOrOpts as ValidatorFn[];
            }
        }
        const formControl = new ExtendedFormControl( formState.initialValue , validators, asyncValidator);
        (formControl as ExtendedFormControl).metadata = formState;
        (formControl as ExtendedFormControl).metadata.validators = validatorMeta;
        
        return formControl;
    }
    
}
