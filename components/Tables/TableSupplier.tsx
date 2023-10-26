"use client";
import { useEffect, useState } from "react";
import { Supplier } from "@/types/supplier";
import Link from "next/link";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa"; // Import icons


const TableSupplier = () => {
    const [fetchedSuppliers, setFetchedSuppliers] = useState<Supplier[]>([]);

    async function fetchSuppliers() {
        try {
            const response = await fetch("/api/supplier/getSs", {
                method: "GET",
            });

            if (!response.ok) {
                throw new Error("Failed to fetch suppliers");
            }

            const data = await response.json();
            setFetchedSuppliers(data.allSuppliers)
            console.log("fetched suppliers are", fetchedSuppliers);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    }
    async function deleteSupplier(SupplierId: string) {
        try {
            const response = await fetch('/api/supplier/deleteP', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    supplierId: SupplierId,
                }),
            });

            if (response.ok) {
                // Supplier was successfully deleted
                // Remove the deleted Supplier from the state
                setFetchedSuppliers((prevSuppliers) =>
                    prevSuppliers.filter((Supplier) => Supplier._id !== SupplierId)
                );
                return 'Supplier deleted successfully';
            } else if (response.status === 404) {
                // Supplier not found
                return 'Supplier not found';
            } else {
                // Other error
                return 'Failed to delete Supplier';
            }
        } catch (error: any) {
            // Network or other errors
            return 'Error deleting Supplier: ' + error.message;
        }
    }

    function handleDeleteSupplier(SupplierId: any) {
        const confirmation = window.confirm(
            'Are you sure you want to delete this Supplier?'
        );
        if (confirmation) {
            deleteSupplier(SupplierId);
        }
    }
    // Use useEffect to fetch suppliers when the component loads
    useEffect(() => {
        fetchSuppliers();
    }, []);

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
                <div className="flex justify-between items-center">
                    <h4 className="text-xl font-semibold text-black dark:text-white">
                        All suppliers
                    </h4>
                    <Link href="/suppliers/addSupplier">
                        <button
                            className="text-xl font-semibold hover:underline cursor-pointer"
                        >
                            Add supplier
                        </button>
                    </Link>

                </div>

            </div>

            <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Supplier Name</p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex">
                    <p className="font-medium">Contact Person</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">Phone</p>
                </div>

                <div className="hidden sm:flex col-span-1 items-center">
                    <p className="font-medium">Address</p>
                </div>
            </div>
            {fetchedSuppliers && fetchedSuppliers.length > 0 ? (
                fetchedSuppliers.map((supplier, key) => (
                    <div
                        className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                        key={key}
                    >
                        <div className="col-span-2 flex items-center">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                <p className="text-sm text-black dark:text-white">
                                    {supplier.name}
                                </p>
                            </div>
                        </div>
                        <div className="col-span-2 hidden items-center sm:flex">
                            <p className="text-sm text-black dark:text-white">
                                {supplier.contactPerson}
                            </p>
                        </div>
                        <div className="col-span-2 flex items-center">
                            <p className="text-sm text-black dark:text-white">
                                {supplier.phone}
                            </p>
                        </div>

                        <div className="hidden sm:flex col-span-1 items-center">
                            <p className="text-sm text-black">{supplier.address}</p>
                        </div>
                        <div className="col-span-1 flex items-center">
                            {/* View, Edit and Delete icons */}
                            <Link href={`/suppliers/viewSupplier/${supplier._id}`}>
                                <FaEye className="text-green-600 hover:cursor-pointer mx-2" />
                            </Link>
                            <Link href={`/suppliers/updateSupplier/${supplier._id}`}>
                                <FaEdit className="text-blue-600 hover:cursor-pointer mx-2" />
                            </Link>

                            <FaTrash
                                onClick={() => handleDeleteSupplier(supplier._id)}
                                className="text-red-600 hover:cursor-pointer mx-2"
                            />

                        </div>
                    </div>
                ))
            ) : (
                <div>No suppliers available.</div>
            )}

        </div>
    );
};

export default TableSupplier;