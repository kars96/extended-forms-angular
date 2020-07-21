
import { AbstractControl, ValidatorFn } from '@angular/forms';

export interface IValidationMessage {
    message: string;
    [key: string]: string;
}

export class ExtendedValidator {
    validatorName: string;
    validatorRef: ValidatorFn;
    staticMessage?: string;
    private constructor(name: string, validatorRef: ValidatorFn, staticMessage?: string) {
        this.validatorName = name;
        this.validatorRef = validatorRef;
        this.staticMessage = staticMessage;
    }
    public static create(name: string, fn: (_: AbstractControl) => null | IValidationMessage): ExtendedValidator {
        return new ExtendedValidator(
            name,
            (control: AbstractControl) => {
                const res = fn(control);
                console.log(res)
                if (res != null) {
                    const obj = {
                        [name]: res
                    };
                    console.log(obj)
                    return obj
                }
            }
        );
    }
}
