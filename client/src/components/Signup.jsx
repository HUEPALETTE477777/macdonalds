import React, { useContext, useState } from "react";
import { FaFacebookF, FaGithub, FaGoogle } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import { AuthContext } from "../context/AuthProvider";

const Signup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { createUser } = useContext(AuthContext);

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = (data) => {
        const email = data.email;
        const password = data.password;
        createUser(email, password)
            .then(() => {
                alert("ACCOUNT CREATED");
                document.getElementById('login-modal').close()
                navigate(from, {replace: true})
            })
            .catch((error) => {
                setErrorMessage(error.message);
            });
    }

    return (
        <div className="max-w-md mx-auto flex justify-center my-20 item-center bg-white shadow w-full border-2">
            <div className="modal-action flex flex-col justify-center mt-0">
                <form className="card-body" onSubmit={handleSubmit(onSubmit)} method="dialog">
                    <h2 className="text-xl">CREATE ACCOUNT OR NO FOOD</h2>
                    {/* EMAIL */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text mt-2">Email:</span>
                        </label>
                        <input type="email" placeholder="COME ENTER EMAIL" className="text-input" {...register("email")} />
                    </div>
                    {/* PASSWORD */}
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text mt-2">Password:</span>
                        </label>
                        <input type="password" placeholder="enter ur password" className="text-input" {...register("password")} />
                        <label className="label mt-1">
                            <a href="#" className="label-text-alt link link-hover text-blue">forgot el password?</a>
                        </label>
                    </div>
                    {/* ERROR MESSAGE */}
                    {errorMessage && <p className="text-red">{errorMessage}</p>}
                    {/* SUBMIT BUTTON */}
                    <div className="form-control">
                        <input type="submit" value="Sign Up" className="btn font-medium text-white bg-red mt-3" />
                    </div>
                    <p className="text-center mt-4">Already have an account? <button className="text-red underline" onClick={() => document.getElementById('login-modal').showModal()}>Log In!</button></p>
                </form>
                <div className="text-center space-x-3 mb-5">
                    <button className="btn rounded-none hover:bg-red hover:text-white">
                        <FaGoogle />
                    </button>
                    <button className="btn rounded-none hover:bg-red hover:text-white">
                        <FaFacebookF />
                    </button>
                    <button className="btn rounded-none hover:bg-red hover:text-white">
                        <FaGithub />
                    </button>
                </div>
            </div>
            <Modal />
        </div>
    )
}

export default Signup;
