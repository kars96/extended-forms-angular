
import { FormControl, ValidatorFn } from '@angular/forms';
export interface ValidatorMetadata {
    name: string;
    message: string;
    active: boolean;
    [key: string]: any;
}

export interface FormControlMetadata {
    initialValue: any;
    disabled?: boolean;
    label: string;
    validators?: ValidatorMetadata[];
}

export class ExtendedFormControl extends FormControl {
    metadata: FormControlMetadata;

    setValidators(newValidator: ValidatorFn | ValidatorFn[] | null): void {
        if ('entries' in newValidator) {
            // array
            // let get
            // for(let validator in newValidator) {
                
            // }
        } else {
            // single

        }

        super.setValidators(newValidator);
    }
}
