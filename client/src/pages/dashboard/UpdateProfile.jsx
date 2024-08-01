import React, { useContext } from 'react';
import { useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthProvider";
import { useLocation, useNavigate } from 'react-router-dom';

const UpdateProfile = () => {
    const { updateUserProfile } = useContext(AuthContext);
    const { register, handleSubmit, formState: { errors } } = useForm();

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const onSubmit = async (data) => {
        const { name, photoURL } = data;
        try {
            await updateUserProfile({ name, photoURL });
            navigate(from, { replace: true });
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl p-30">
                <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
                    <h3 className="text-xl text-center">UPDATE YOUR PROFILE</h3>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">NAME</span>
                        </label>
                        <input
                            type="text"
                            placeholder="YOUR NAME"
                            className="text-input"
                            required
                            {...register("name", { required: "Name is required" })}
                        />
                        {errors.name && <p className="error-text">{errors.name.message}</p>}
                    </div>
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">UPLOAD A PHOTO</span>
                        </label>
                        <input
                            type="text"
                            placeholder="photo-url"
                            className="text-input"
                            required
                            {...register("photoURL", { required: "Photo URL is required" })}
                        />
                        {
                            errors.photoURL && <p className="error-text">{errors.photoURL.message}</p>
                        }
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn bg-red text-white hover:bg-white hover:text-red hover:border-red" type="submit">UPDATE</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateProfile;
