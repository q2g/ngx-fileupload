import { GroupedValidator } from "./grouped.validator";
import { ValidationErrors } from "../../api";

export class AndValidator extends GroupedValidator {

    public validate(file: File): ValidationErrors | null {

        const validationResult: ValidationErrors = {};
        let hasErrors = false;

        for (const validator of this.validators) {
            const result = this.execValidator(validator, file);

            if (result !== null) {
                Object.assign(validationResult, result);
                hasErrors = true;
            }
        }
        return hasErrors ? validationResult : null;
    }
}
