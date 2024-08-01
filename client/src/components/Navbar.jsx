import React, { useContext, useEffect, useState } from 'react';
import logo from '/logo.svg';
import { FaRegUser } from "react-icons/fa";
import Modal from "./Modal";
import { AuthContext } from "../context/AuthProvider";
import Profile from "../components/Profile";
import { useNavigate } from 'react-router-dom';
import useCart from "../hooks/useCart";
import Swal from 'sweetalert2';

const Navbar = () => {
    const [isSticky, setSticky] = useState(false);
    const { user } = useContext(AuthContext);
    const [cart, refetch] = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const scrollHandler = () => {
            const offset = window.scrollY;
            setSticky(offset > 0);
        };

        window.addEventListener("scroll", scrollHandler);
        return () => {
            window.removeEventListener("scroll", scrollHandler);
        };
    }, []);

    useEffect(() => {
        if (user?.email) {
            refetch();
        }
    }, [user, refetch]);

    const handleCartClick = () => {
        if (user) {
            navigate('/cart-page');
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Log In Chimp',
                text: 'You get no rights if you don\'t log in'
            });
        }
    };

    const navItems = (
        <>
            <li>
                <a href="/">Home</a>
            </li>
            <li><a href="/menu">Our Menu</a></li>
            <li tabIndex={0}>
                <details>
                    <summary>McDelivery</summary>
                    <ul className="p-3 bg-white">
                        <li><a>McApp</a></li>
                        <li><a>Black UberEats</a></li>
                    </ul>
                </details>
            </li>
            <li><a>About Our Food</a></li>
            <li><a>Gift Cards</a></li>
        </>
    );

    const navSearch = (
        <button className="btn btn-ghost btn-circle hidden lg:flex">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
        </button>
    );

    const navCart = (
        <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle mr-5 hidden lg:flex items-center justify-center"
            onClick={handleCartClick} 
        >
            <div className="indicator">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span className="badge badge-sm indicator-item bg-secondaryBG border-none text-white">
                    {cart.length || 0}
                </span>
            </div>
        </div>
    );

    return (
        <header className={`max-w-screen-2xl container mx-auto bg-gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100% text-black ${isSticky ? "fixed top-0 z-50 shadow-md" : ""} transition ease-in-out text-black animate-fade-in`}>
            <div className="navbar xl:px-24">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow bg-primaryBG">
                            {navItems}
                        </ul>
                    </div>
                    <a href="/" className="flex items-center">
                        <img src={logo} />
                        <h2>ACDONALDS</h2>
                    </a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navItems}
                    </ul>
                </div>
                <div className="navbar-end">
                    {navSearch}
                    {navCart} {/* Updated to use div with onClick */}
                    {
                        user ? <Profile user={user} /> :
                            <button
                                className="btn bg-red border-none rounded-full px-6 text-white flex items-center gap-3"
                                onClick={() => document.getElementById('login-modal').showModal()}>
                                <FaRegUser /> Login
                            </button>
                    }
                    <Modal />
                </div>
            </div>
        </header>
    );
};

export default Navbar;
