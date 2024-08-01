import React, { useState, useContext, useEffect } from 'react';
import useCart from "../../hooks/useCart";
import { FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import { AuthContext } from "../../context/AuthProvider";
import { Link, useNavigate } from 'react-router-dom';

const CartSummary = () => {
    const [cart, refetch] = useCart();
    const { user } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;

    const deleteHandler = (item) => {
        fetch(`http://localhost:4000/cart/${item._id}`, {
            method: "DELETE"
        })
            .then(res => res.json())
            .then(data => {
                if (data.deletedCount > 0) {
                    refetch();
                }
            })
            .catch(error => {
                console.error('Error deleting item:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to delete item'
                });
            });
    };

    const updateCartItemQuantity = (item, newQuantity) => {
        if (newQuantity <= 0) return;

        fetch(`http://localhost:4000/cart/${item._id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json; charset=UTF-8",
            },
            body: JSON.stringify({ quantity: newQuantity }),
        })
            .then(res => res.json())
            .then(data => {
                if (data.message === 'Quantity updated successfully') {
                    refetch();
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: "Failed to update quantity"
                    });
                }
            })
            .catch(error => {
                console.error('Error updating quantity:', error);
                Swal.fire({
                    icon: 'error',
                    title: "Error updating quantity"
                });
            });
    };

    const increaseHandler = (item) => {
        updateCartItemQuantity(item, item.quantity + 1);
    };

    const decreaseHandler = (item) => {
        if (item.quantity > 1) {
            updateCartItemQuantity(item, item.quantity - 1);
        } else {
            Swal.fire({
                icon: 'error',
                title: "CANNOT BE ZERO"
            });
        }
    };

    const calculatePrice = (item) => {
        return item.price * item.quantity;
    };

    const calculateTotalPrice = () => {
        return cart.reduce((total, item) => total + calculatePrice(item), 0);
    };

    const totalPages = Math.ceil(cart.length / itemsPerPage);

    const renderCartItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const slicedCart = cart.slice(startIndex, startIndex + itemsPerPage);

        return (
            <tbody className="bg-white border">
                {slicedCart.map((item, idx) => (
                    <tr key={item._id}>
                        <td className="text-center">{startIndex + idx + 1}</td>
                        <td>
                            <div className="flex items-center gap-3">
                                <div className="avatar">
                                    <div className="rounded-full h-20 w-20 border">
                                        <img src={item.image} alt={item.name} />
                                    </div>
                                </div>
                            </div>
                        </td>
                        <td className="font-medium">{item.name}</td>
                        <td>
                            <button className="py-2 px-4 bg-red text-white active:bg-gray-200" onClick={() => decreaseHandler(item)}>-</button>
                            <input
                                type="number"
                                value={item.quantity}
                                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-10 mx-2 text-center overflow-hidden appearance-none"
                                readOnly />
                            <button className="py-2 px-4 bg-green text-white active:bg-gray-200" onClick={() => increaseHandler(item)}>+</button>
                        </td>
                        <td className="text-green">${calculatePrice(item).toFixed(2)}</td>
                        <th> <button className="p-4 bg-red text-white text-2xl active:bg-gray-200" onClick={() => deleteHandler(item)}> <FaTrash /> </button> </th>
                    </tr>
                ))}
            </tbody>
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };


    return (
        <div className="section-container">
            <h1 className="text-5xl font-medium text-center p-8">
                Cart Summary
            </h1>
            {/* CART TABLE */}
            <div>
                <div className="overflow-x-auto">
                    <table className="table">
                        {renderCartItems()}
                    </table>
                </div>
            </div>
            <hr />
            {/* PAGINATION */}
            {totalPages > 1 && (
                <div className="flex justify-center p-4">
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <button
                            key={index + 1}
                            onClick={() => handlePageChange(index + 1)}
                            className={`mx-2 py-4 px-7 ${currentPage === index + 1 ? "bg-red text-white" : "bg-gray-300"}`}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            )}
            {/* CUSTOMER DETAILS */}
            <div className="p-8 flex flex-col md:flex-row justify-between items-center">
                <div className="space-y-3">
                    <h2 className="font-bold">User Cart Summary</h2>
                    <p>Total Items: {cart.length}</p>
                    <p>SubTotal: ${calculateTotalPrice().toFixed(2)}</p>
                </div>
                <div className="space-y-2">
                    <h2 className="font-bold">User Information</h2>
                    <p>Email: {user.email}</p>
                    <p>Name: {user.displayName}</p>
                </div>
                <Link to="/checkout">
                    <button className="p-7 bg-red text-white font-medium"> Go To Checkout</button>
                </Link>
            </div>
        </div>
    );
};

export default CartSummary;
