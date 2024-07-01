import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DefinedFieldType } from "@/types/type";
import { RefObject } from "react";

type PropsType = {
    defined_fields?: DefinedFieldType[];
    wrapperInputClass?: string;
    wrapperFormClass?: string;
    slotName?: string;
    labelHidden?: boolean;
    submitFn?: any
    btnSumitRef?: RefObject<HTMLButtonElement>; // Add this line to accept a form ref
};

export function CustomMultiForm(props: PropsType) {
    const FormSchema = props.defined_fields?.reduce((schema, field: DefinedFieldType) => {
        switch (field.type) {
            case 'string':
                let stringSchema = z.string({});
                if (field.min) {
                    stringSchema = stringSchema.min(field.min, { message: field.message });
                }
                if (field.email) {
                    stringSchema = stringSchema.email({ message: field.message });
                }
                schema[field.name] = stringSchema;
                break;
            case 'number':
                let numberSchema = z.number({});
                if (field.min) {
                    numberSchema = numberSchema.min(field.min, { message: field.message });
                }
                schema[field.name] = numberSchema;
                break;
            case 'file':
                schema[field.name] = z.string();
                break;
            case 'date':
                schema[field.name] = z.string().refine((value) => !isNaN(Date.parse(value)), {
                    message: `${field.name.charAt(0).toUpperCase() + field.name.slice(1)} is required.`,
                });
                break;
            default:
                throw new Error(`Unsupported field type: ${field.type}`);
        }
        return schema;
    }, {}) || {};

    const formSchema = z.object(FormSchema);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: props.defined_fields?.reduce((values, field) => {
            values[field.name] = "";
            return values;
        }, {}) || {},
    });

    function onSubmit(data: z.infer<typeof formSchema>) {
        props.submitFn && props.submitFn(data);
        return data
    }
    const uploadFileAndGetUrl = async (file: any) => {
        // Replace this with your actual API call
        const formData = new FormData();
        formData.append('file', file);

        try {
            // const response = await fetch('your-api-endpoint', {
            //     method: 'POST',
            //     body: formData,
            // });

            // if (!response.ok) {
            //     throw new Error('Failed to upload file');
            // }

            // const data = await response.json();
            // return data.url; // Assuming the API returns a JSON object with a 'url' field
            return "https://scr.vn/wp-content/uploads/2020/07/avt-cute.jpg"
        } catch (error) {
            console.error('Error uploading file:', error);
            throw error;
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, field: any, each: DefinedFieldType) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            try {
                const url = await uploadFileAndGetUrl(file);

                // Update the hidden field with the URL
                form.setValue(each.name, url); // Update the form value with the new URL
                each.onInputChange && each.onInputChange(url); // Call any additional handler
            } catch (error) {
                console.error('Failed to handle file change:', error);
            }
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(props.submitFn)} className={`w-full ${props.wrapperFormClass && props.wrapperFormClass}`}>
                {
                    props.slotName ?
                        props.slotName === "test-form" &&
                        props.defined_fields && props.defined_fields.map((each: DefinedFieldType) => (
                            <FormField
                                key={each.name}
                                control={form.control}
                                name={each.name}
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        {props.labelHidden ? null : <label style={{ display: each.labelHidden ? "none" : "inline" }}>{each.name.charAt(0).toUpperCase() + each.name.slice(1)}</label>}
                                        <FormControl>
                                            {each.type === 'file' ? (
                                                <>
                                                    {/* <Input
                                                        className={props.wrapperInputClass}
                                                        type="file"
                                                        onChange={(e) => handleFileChange(e, field, each)}
                                                    />
                                                    <Input
                                                        type="hidden"
                                                        {...field}
                                                    /> */}
                                                    {/* {field.value && <img src={field.value} alt="Uploaded file" className="mt-2" />} */}

                                                    <div className="flex items-center justify-center w-full">
                                                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                                            {field.value ? <img src={field.value} alt="Uploaded file" className="mt-2 w-40 h-auto" />
                                                                :    
                                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                                                </svg>
                                                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                                            </div>
                                                            }
                                                            <Input onChange={(e) => handleFileChange(e, field, each)} id="dropzone-file" type="file" className="hidden" />
                                                        </label>
                                                    </div>
                                                </>
                                            ) : each.type === 'date' ? (
                                                <Input
                                                    className={props.wrapperInputClass}
                                                    type="date"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        each.onInputChange && each.onInputChange(e);
                                                    }}
                                                />
                                            ) : (
                                                <Input
                                                    className={props.wrapperInputClass}
                                                    type={each.inputType === undefined ? 'text' : each.inputType}
                                                    placeholder={each.name}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        each.onInputChange && each.onInputChange(e);
                                                    }}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        ))
                        :
                        props.defined_fields && props.defined_fields.map((each: DefinedFieldType) => (
                            <FormField
                                key={each.name}
                                control={form.control}
                                name={each.name}
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        {props.labelHidden ? null : <label style={{ display: each.labelHidden ? "none" : "inline" }}>{each.name.charAt(0).toUpperCase() + each.name.slice(1)}</label>}
                                        <FormControl>
                                            {each.type === 'file' ? (
                                                <>
                                                    <Input
                                                        className={props.wrapperInputClass}
                                                        type="file"
                                                        onChange={(e) => handleFileChange(e, field, each)}
                                                    />
                                                    <Input
                                                        type="hidden"
                                                        {...field}
                                                    />
                                                    {field.value && <img src={field.value} alt="Uploaded file" className="mt-2" />}
                                                </>
                                            ) : each.type === 'date' ? (
                                                <Input
                                                    className={props.wrapperInputClass}
                                                    type="date"
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        each.onInputChange && each.onInputChange(e);
                                                    }}
                                                />
                                            ) : (
                                                <Input
                                                    className={props.wrapperInputClass}
                                                    type={each.inputType === undefined ? 'text' : each.inputType}
                                                    placeholder={each.name}
                                                    {...field}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        each.onInputChange && each.onInputChange(e);
                                                    }}
                                                />
                                            )}
                                        </FormControl>
                                        <FormMessage>{fieldState.error?.message}</FormMessage>
                                    </FormItem>
                                )}
                            />
                        ))
                }

                <Button className="hidden" ref={props.btnSumitRef} type="submit">Submit</Button>
            </form>
        </Form>
    );
}
