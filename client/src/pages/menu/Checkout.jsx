import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from "../../context/AuthProvider";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';
import useCart from "../../hooks/useCart"; 

const Checkout = () => {
    const [cart, refetch] = useCart();
    const { user } = useContext(AuthContext);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const [isReadOnly, setIsReadOnly] = useState(false);

    const [formValues, setFormValues] = useState({
        email: user ? user.email : '',
        firstName: '',
        lastName: '',
        streetAddress: '',
        apartment: '',
        state: '',
        country: '',
        zipCode: '',
        townCity: '',
        SSN: '',
        creditCardNumber: ''
    });

    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        setFormValues(prevValues => ({
            ...prevValues,
            email: user ? user.email : ''
        }));
    }, [user]);

    const handleChange = (e) => {
        if (!isReadOnly) {
            const { id, value } = e.target;
            setFormValues(prevValues => ({
                ...prevValues,
                [id]: value
            }));
        }
    };
    

    const validateForm = () => {
        const errors = {};
        const { email, firstName, lastName, streetAddress, apartment, state, country, zipCode, townCity, SSN, creditCardNumber } = formValues;

        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            errors.email = 'A valid email is required!';
        }

        if (!firstName) errors.firstName = 'First name is required!';
        if (!lastName) errors.lastName = 'Last name is required!';
        if (!streetAddress) errors.streetAddress = 'Street address is required!';
        if (!apartment) errors.apartment = 'Apartment Address is required';
        if (!state) errors.state = 'State is required!';
        if (!country) errors.country = 'Country/Region is required!';
        if (!zipCode) errors.zipCode = 'Zip code is required!';
        if (!townCity) errors.townCity = 'Town/City is required!';
        if (!SSN || SSN.length !== 4 || isNaN(SSN)) errors.SSN = 'Last 4 digits of SSN must be numeric and 4 digits long!';
        if (!creditCardNumber || !/^\d{16}$/.test(creditCardNumber.replace(/\s/g, ''))) errors.creditCardNumber = 'Give me credit card number in correct format';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch('http://localhost:4000/checkout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formValues),
                });
        
                const result = await response.json();
                console.log('Order placed successfully:', result);
        
                await Swal.fire({
                    icon: 'success',
                    title: 'Order Received',
                    text: 'Your order has been sent successfully!',
                    confirmButtonText: 'OK'
                });
                
                setFormValues({
                    email: user ? user.email : '',
                    firstName: '',
                    lastName: '',
                    streetAddress: '',
                    apartment: '',
                    state: '',
                    country: '',
                    zipCode: '',
                    townCity: '',
                    SSN: '',
                    creditCardNumber: ''
                });
                refetch();
            } catch (error) {
                console.error('Failed to submit order:', error);
                await Swal.fire({
                    icon: 'error',
                    title: 'Submission Failed',
                    text: 'There was an issue submitting your order.',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    const handleConfirmInformation = () => {
        setIsReadOnly(true);
    };
    
    const handleProcessPayment = (e) => {
        e.preventDefault();
        handleSubmit(e); 
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
                        <td className="text-center">{item.quantity}</td>
                        <td className="text-green">${calculatePrice(item).toFixed(2)}</td>
                    </tr>
                ))}
            </tbody>
        );
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-5xl font-semibold text-center mb-8">Checkout</h1>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white shadow-lg p-6 rounded-lg">
                    <h2 className="text-2xl font-semibold mb-6">Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 relative">
                            <input
                                id="email"
                                type="email"
                                value={formValues.email}
                                onChange={handleChange}
                                readOnly={isReadOnly}
                                className={`floating-label-input ${formErrors.email ? 'border-red-500' : ''}`}
                            />
                            <label htmlFor="email" className="floating-label">Email</label>
                            {formErrors.email && <p className="text-red text-xs">{formErrors.email}</p>}
                        </div>

                        <h2 className="text-2xl font-semibold mb-6">Shipping</h2>
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="flex-1 relative">
                                <input
                                    id="firstName"
                                    type="text"
                                    value={formValues.firstName}
                                    onChange={handleChange}
                                    readOnly={isReadOnly}
                                    className={`floating-label-input ${formErrors.firstName ? 'border-red-500' : ''}`}
                                />
                                <label htmlFor="firstName" className="floating-label">First Name</label>
                                {formErrors.firstName && <p className="ml-1 mt-1 text-red text-xs">{formErrors.firstName}</p>}
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    id="lastName"
                                    type="text"
                                    value={formValues.lastName}
                                    onChange={handleChange}
                                    readOnly={isReadOnly}
                                    className={`floating-label-input ${formErrors.lastName ? 'border-red-500' : ''}`}
                                />
                                <label htmlFor="lastName" className="floating-label">Last Name</label>
                                {formErrors.lastName && <p className="ml-1 mt-1 text-red text-xs">{formErrors.lastName}</p>}
                            </div>
                        </div>

                        <div className="mb-4 relative">
                            <input
                                id="streetAddress"
                                type="text"
                                value={formValues.streetAddress}
                                onChange={handleChange}
                                readOnly={isReadOnly}
                                className={`floating-label-input ${formErrors.streetAddress ? 'border-red-500' : ''}`}
                            />
                            <label htmlFor="streetAddress" className="floating-label">Street Address</label>
                            {formErrors.streetAddress && <p className="ml-1 mt-1 text-red text-xs">{formErrors.streetAddress}</p>}
                        </div>

                        <div className="mb-4 relative">
                            <input
                                id="apartment"
                                type="text"
                                value={formValues.apartment}
                                onChange={handleChange}
                                readOnly={isReadOnly}
                                className="floating-label-input"
                            />
                            <label htmlFor="apartment" className="floating-label">Apartment, Unit, Suite, etc.</label>
                            {formErrors.apartment && <p className="ml-1 mt-1 text-red text-xs">{formErrors.apartment}</p>}
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            <div className="flex-1 relative">
                                <input
                                    id="state"
                                    type="text"
                                    value={formValues.state}
                                    onChange={handleChange}
                                    readOnly={isReadOnly}
                                    className={`floating-label-input ${formErrors.state ? 'border-red-500' : ''}`}
                                />
                                <label htmlFor="state" className="floating-label">State</label>
                                {formErrors.state && <p className="ml-1 mt-1 text-red text-xs">{formErrors.state}</p>}
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    id="country"
                                    type="text"
                                    value={formValues.country}
                                    onChange={handleChange}
                                    readOnly={isReadOnly}
                                    className={`floating-label-input ${formErrors.country ? 'border-red-500' : ''}`}
                                />
                                <label htmlFor="country" className="floating-label">Country/Region</label>
                                {formErrors.country && <p className="ml-1 mt-1 text-red text-xs">{formErrors.country}</p>}
                            </div>
                            <div className="flex-1 relative">
                                <input
                                    id="zipCode"
                                    type="text"
                                    value={formValues.zipCode}
                                    onChange={handleChange}
                                    readOnly={isReadOnly}
                                    className={`floating-label-input ${formErrors.zipCode ? 'border-red-500' : ''}`}
                                />
                                <label htmlFor="zipCode" className="floating-label">Zip Code</label>
                                {formErrors.zipCode && <p className="ml-1 mt-1 text-red text-xs">{formErrors.zipCode}</p>}
                            </div>
                        </div>

                        <div className="mb-4 relative">
                            <input
                                id="townCity"
                                type="text"
                                value={formValues.townCity}
                                onChange={handleChange}
                                readOnly={isReadOnly}
                                className={`floating-label-input ${formErrors.townCity ? 'border-red-500' : ''}`}
                            />
                            <label htmlFor="townCity" className="floating-label">Town/City</label>
                            {formErrors.townCity && <p className="ml-1 mt-1 text-red text-xs">{formErrors.townCity}</p>}
                        </div>

                        <div className="mb-4 relative">
                            <input
                                id="SSN"
                                type="text"
                                value={formValues.SSN}
                                onChange={handleChange}
                                readOnly={isReadOnly}
                                className={`floating-label-input ${formErrors.SSN ? 'border-red-500' : ''}`}
                            />
                            <label htmlFor="SSN" className="floating-label">Last 4 Digits of Social Security Number</label>
                            {formErrors.SSN && <p className="ml-1 mt-1 text-red text-xs">{formErrors.SSN}</p>}
                        </div>

                        <div className="mb-4 relative">
                            <input
                                id="creditCardNumber"
                                type="text"
                                value={formValues.creditCardNumber}
                                onChange={handleChange}
                                readOnly={isReadOnly}
                                className={`floating-label-input ${formErrors.creditCardNumber ? 'border-red-500' : ''}`}
                            />
                            <label htmlFor="creditCardNumber" className="floating-label">Credit Card Number (0000 0000 0000 0000)</label>
                            {formErrors.creditCardNumber && <p className="ml-1 mt-1 text-red text-xs">{formErrors.creditCardNumber}</p>}
                        </div>

                        <button type="button" className="text-white bg-red p-2 rounded" onClick={handleConfirmInformation}>Confirm Information</button>
                    </form>
                </div>

                <div className="flex-1 bg-gray-100 border border-gray-300 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {renderCartItems()}
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center p-4">
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`mx-2 py-2 px-4 ${currentPage === index + 1 ? "bg-red text-white" : "bg-gray-300"}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    )}
                    <div className="flex justify-between p-4">
                        <div className="space-y-2">
                            <p>Total Items: {cart.length}</p>
                            <p>SubTotal: ${calculateTotalPrice().toFixed(2)}</p>
                        </div>
                        <button type="submit" onClick={handleProcessPayment} className="p-7 bg-red text-white font-medium rounded">Process Payment</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
