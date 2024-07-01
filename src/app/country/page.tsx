"use client"
import CustomTable from "@/composables/data-table"
import { country } from "@/country";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { CountryType } from "@/country";

export const columns: ColumnDef<CountryType>[] = [
    {
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => {
                        column.toggleSorting(column.getIsSorted() === "asc");
                    }}
                >
                    Country ID
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        accessorKey: "id",
    },
    {
        header: "Address",
        accessorKey: "address",
    },
    {
        header: "City",
        accessorKey: "city",
    },
    {
        header: "Company Name",
        accessorKey: "company_name",
    },
    {
        header: "Country Code",
        accessorKey: "country_code",
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const country = row.original;
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="w-8 h-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => {
                                navigator.clipboard.writeText(country.city.toString());
                            }}
                        >
                            Copy person name
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

type Props = {};

const People = (props: Props) => {
    return (
        <div className="container py-10 mx-auto">
            <CustomTable columns={columns} data={country} isPaginationVisible={true} isAbleToSearch={false} />
        </div>
    );
};

export default People;