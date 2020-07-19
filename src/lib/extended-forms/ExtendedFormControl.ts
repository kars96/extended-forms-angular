
import { FormControl, ValidatorFn, AbstractControl, AbstractControlOptions, AsyncValidatorFn } from '@angular/forms';

export interface FormControlMetadata {
    initialValue: any;
    disabled?: boolean;
    label: string;
    [key: string]: any;
    validators?: ValidatorMetadata[];
}

export interface ValidatorWithMeta {
    validatorRef: ValidatorFn;
    staticMessage: string;
    name: string;
    [key: string]: any;
}

export interface ValidatorMetadata extends ValidatorWithMeta {
    active: boolean;
}


export class ExtendedFormControl extends FormControl {
    metadata: FormControlMetadata;

    constructor(formState?: any, validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
                asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
        super(formState, validatorOrOpts, asyncValidator);
    }
    setValidators(newValidator: ValidatorFn | ValidatorFn[] | null | ValidatorWithMeta | ValidatorWithMeta[]): void {
        let validatorFns: ValidatorFn[] = [];
        let validatorMetadata: ValidatorMetadata[] = [];
        if (newValidator && 'name' in newValidator) {
            // Validatorwithmeta
            validatorFns = [(newValidator as ValidatorWithMeta).validatorRef];
            validatorMetadata.push({ ...(newValidator as ValidatorWithMeta), active: true });
        } else if (Array.isArray((newValidator))) {
            // validatorFn[] or ValidaotrWithMeta[]
            if (newValidator.length > 0 && 'name' in newValidator[0]) {
                // ValidatorWithMeta[]
                validatorFns = (newValidator as ValidatorWithMeta[]).map(val => val.validatorRef);
                validatorMetadata = (newValidator as ValidatorWithMeta[])
                    .map(val => ({ ...(val as ValidatorWithMeta), active: true }));
            } else if (newValidator.length > 0) {
                // ValdiatroFn[]
                validatorFns = (newValidator as ValidatorFn[]);

            }
        } else if (newValidator) {
            // ValidatorFn
            validatorFns = [(newValidator as ValidatorFn)];
        }
        this.metadata = { ...this.metadata, validators: validatorMetadata };
        super.setValidators(validatorFns);
    }
    
    
    public getAttr(attr: string): object  {
        return this.metadata[attr];
    }

    public getError(err: string): string | null {
        const errobj = super.getError(err);
        if (errobj instanceof Object && 'message' in errobj) {
            err = errobj.message;
        } else if (errobj && this.metadata.validators) {
            const validatorsMeta = this.metadata.validators.find(
                validatorMeta => validatorMeta.name === err
            );
            if (validatorsMeta) {
                err = validatorsMeta.staticMessage;
            }
        }
        return errobj && err;
    }

    public errorKeys(): string[] {
        return Object.keys(this.errors);
    }

    public addValidator(validatorMeta: ValidatorWithMeta): void {
        let validators: ValidatorFn[] = [];
        if(this.metadata.validators) {
            validators = this.metadata.validators.filter(val => val.active).map(val => val.validatorRef);
        } else {
            this.metadata.validators = [];
        }
        validators.push(validatorMeta.validatorRef);
        this.metadata.validators.push({...validatorMeta, active: true});
        this.setValidators(validators);

    }
}
