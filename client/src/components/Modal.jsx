import React, { useContext, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { FaGoogle, FaFacebookF, FaGithub } from "react-icons/fa"
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/AuthProvider"

const Modal = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signUpWithGmail, login } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState("")

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const onSubmit = (data) => {
        const email = data.email;
        const password = data.password;
        login(email, password)
            .then((result) => {
                const user = result.user;
                document.getElementById("login-modal").close()
                navigate(from, { replace: true })
            })
            .catch((error) => {
                const errorMessage = error.message;
                setErrorMessage("BAD LOGIN CREDENTIALS BOY")
            })
    };


    const loginHandler = () => {
        signUpWithGmail()
            .then((result) => {
                const user = result.user;
                alert("YOU'RE IN")
                navigate(from, { replace: true })
            })
            .catch((error) => console.log(error))
    }

    return (
        <dialog id="login-modal" className="modal modal-middle sm:modal-middle">
            <div className="modal-box">
                <div className="modal-action flex flex-col justify-center mt-0">
                    <form className="card-body" onSubmit={handleSubmit(onSubmit)} method="dialog">
                        <h2 className="text-xl">LOGIN OR NO FOOD AT ALL</h2>
                        {/* EMAIL */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text mt-2">Email:</span>
                            </label>
                            <input type="email" placeholder="ENTER SKIDIKI EMAIL" className="text-input" {...register("email")} />
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
                        {errorMessage && <p className="text-red text-sm">{errorMessage}</p>}

                        {/* SUBMIT BUTTON */}
                        <div className="form-control">
                            <input type="submit" value="Login Here" className="btn font-medium text-white bg-red mt-3" />
                        </div>
                        <p className="text-center mt-4">Don't have an account? <Link to="/signup" className="text-red underline"> Sign Up Here! </Link> </p>
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" htmlFor="login-modal" onClick={() => document.getElementById('login-modal').close()}>✕</button>
                    </form>
                    <div className="text-center space-x-3 mb-5">
                        <button className="btn rounded-none hover:bg-red hover:text-white" onClick={loginHandler}>
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
            </div>
        </dialog>
    )
}

export default Modal