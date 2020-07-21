import { FormBuilder, FormControl, ValidatorFn, AbstractControlOptions, AsyncValidatorFn, Validators, FormGroup, AbstractControl } from '@angular/forms';
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
            if (validatorOrOpts.length > 0 && 'validatorName' in validatorOrOpts[0]) {
                validators = (validatorOrOpts as ValidatorWithMeta[]).map(val => val.validatorRef);
                validatorMeta = (validatorOrOpts as ValidatorMetadata[]).map(val => ({ ...val, active: true }));
            } else if (validatorOrOpts.length) {
                validators = (validatorOrOpts as ValidatorFn[]);
            }
        } else {
            if ('validatorName' in validatorOrOpts) {
                validators = [(validatorOrOpts as ValidatorWithMeta).validatorRef];
                validatorMeta.push({ ...(validatorOrOpts as ValidatorWithMeta), active: true });
            } else {
                validators = validatorOrOpts as ValidatorFn[];
            }
        }
        const formControl = new ExtendedFormControl(formState.initialValue, validators, asyncValidator);
        (formControl as ExtendedFormControl).metadata = formState;
        (formControl as ExtendedFormControl).metadata.validators = validatorMeta;

        return formControl;
    }

    public fromJson(root: object): FormGroup {
        return this.group(root);
    }

    public group(root: object): FormGroup {
        let fg;
        let fcObj: {[key: string]: AbstractControl} = {};
        Object.keys(root).forEach(
            key => {
                if (root[key] && 'initialValue' in root[key]) {
                    // ExtendedFormCOntrol
                    fcObj[key] = this.controlFromJson(root[key]);
                } else if(root[key]) {
                    // formGroup
                    fcObj[key] = this.group(root[key]);
                }
            }
        );
        return new FormGroup(fcObj);

    }
    controlFromJson(formControlMetadata: FormControlMetadata): ExtendedFormControl {
        const fc = new ExtendedFormControl(formControlMetadata.initialValue);
        const validators = [];
        if(formControlMetadata.validators !== null){

            formControlMetadata.validators.forEach(val =>{
                const validatr = this.getValidatorInstance(val);
                validators.push(validatr);
                val.validatorRef = validatr;
                val.active = true;
            } );
        }
        fc.setValidators(validators);
        fc.metadata = formControlMetadata;
        return fc;
    }

    getValidatorInstance(validatorMeta: ValidatorWithMeta): ValidatorFn {
        let validatorIns;

        switch (validatorMeta.validatorName) {
            case 'min':
                validatorIns = Validators.min(validatorMeta.min);
                break;
            case 'max':
                validatorIns = Validators.max(validatorMeta.max);
                break;
            case 'required':
                validatorIns = Validators.required;
                break;
            case 'requiredTrue':
                validatorIns = Validators.requiredTrue;
                break;
            case 'email':
                validatorIns = Validators.email;
                break;
            case 'minLength':
                validatorIns = Validators.minLength(validatorMeta.minLength);
                break;
            case 'pattern':
                validatorIns = Validators.pattern(validatorMeta.pattern);
                break;
            case 'nullValidator':
                validatorIns = Validators.nullValidator;
                break;
            default:
                throw new Error(`${validatorMeta.validatorName} doesn;t have a mapped validaotr instance`);
        }
        return validatorIns;
    }
}
