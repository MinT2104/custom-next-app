export type DefinedFieldType = ({
    name: string;
    type: string;
    min?: undefined;
    message?: undefined;
    email?: undefined;
    inputType?: string;
    labelHidden?: boolean;
    onInputChange?: (data?: any) => any;
} |
{
    name: string;
    type: string;
    min: number;
    message: string;
    email?: undefined;
    inputType?: string;
    labelHidden?: boolean;
    onInputChange?: (data?: any) => any;
} | {
    name: string;
    type: string;
    email: boolean;
    message: string;
    min?: undefined;
    inputType?: string;
    labelHidden?: boolean;
    onInputChange?: (data?: any) => any;
})