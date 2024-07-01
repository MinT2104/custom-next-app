"use client"
import { CustomMultiForm } from "@/composables/multi-form";
import { DefinedFieldType } from "@/types/type";
import React, { MutableRefObject, RefObject, useRef } from "react";

type Props = {};

const page = (props: Props) => {

    const btnSumitRef = useRef<HTMLButtonElement>(null);

    const DEFINED_FIELDS: DefinedFieldType[] = [
        {
            name: 'username', type: 'string', min: 2, message: 'Username must be at least 2 characters.', inputType: "text", onInputChange(e) {
                console.log(e)
            },
        },
        { name: 'password', type: 'string', min: 6, message: 'Password must be at least 6 characters.', inputType: "text" },
        { name: 'email', type: 'string', email: true, message: 'Invalid email address.', inputType: "text" },
        { name: 'age', type: 'string', inputType: "text" },
        { name: 'address', type: 'string', min: 5, message: 'Address must be at least 5 characters.', inputType: "text" },
        { name: 'bio', type: 'string', inputType: "text" }, // Field without validation
        { name: 'website', type: 'string', inputType: "text" },// Field without validation
        {
            name: 'avatar', type: 'file', inputType: "file", onInputChange(e) {
                console.log(e)
            },
        }, // Example of a file input field 
        {
            name: 'dob', type: 'date', inputType: "date", onInputChange(e) {
                console.log(e)
            },
        },
        {
            name: 'n', type: 'date', inputType: "date", onInputChange(e) {
                console.log(e)
            },
        }

    ]

    const handleSubmit = (data: any) => {
        console.log(data)
    }



    return <div className="w-2/3 m-auto mt-20 border rounded-xl p-6">
        <CustomMultiForm btnSumitRef={btnSumitRef} defined_fields={DEFINED_FIELDS} wrapperInputClass="outline-none" wrapperFormClass="grid grid-cols-2 gap-4" labelHidden={false} submitFn={handleSubmit} />
        <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
                btnSumitRef.current?.click()
            }}
        >
            Custom Submit
        </button>
    </div>;
};

export default page;
