import { FormBuilder, FormControl, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, Validators } from '@angular/forms';
import { FormControlMetadata, ExtendedFormControl } from './ExtendedFormControl';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExtendedFormBuilder extends FormBuilder {
    control(formState: FormControlMetadata, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
            asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null): FormControl {
        const validators: ValidatorFn[] = [];
        if(Array.isArray(validatorOrOpts)) {
            validatorOrOpts.forEach(
                validatorFn => {
                    const validatorName = this.getValidatorName(validatorFn);
                    if(validatorName) {
                        const metadata = formState.validators.find(
                            vm => vm.name = validatorName
                        );
                        metadata.active = true;
                    }
                }
            )
        } else if('updateOn' in validatorOrOpts) {
            // AbstractControlOpts

        } else {
            // single validator
        }
        const formControl = super.control({value: formState.initialValue}, validatorOrOpts, asyncValidator);
        (formControl as ExtendedFormControl).metadata = formState;
        return formControl;
    }
    getValidatorName(validatorFn: ValidatorFn): string {
        if(validatorFn === Validators.required){
            return 'required';
        }
    }
}
