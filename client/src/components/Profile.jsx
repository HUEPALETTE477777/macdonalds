import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { Link, useNavigate } from 'react-router-dom';

const Profile = ({ user }) => {
    const { logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const logoutHandler = () => {
        logOut()
            .then(() => {
                navigate('/');
            })
            .catch(() => {

            })
    }
    return (
        <div>
            <div className="drawer drawer-end z-20">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <label htmlFor="my-drawer-4" className="drawer-button btn btn-ghost btn-circle avatar bg-gradient-to-r from-[#FAFAFA] from-0% to-[#FCFCFC] to-100%">
                        <div className="w-10 rounded-full">
                            {
                                user.photoURL ? <img src={user.photoURL} />
                                    : <img src="https://i.ytimg.com/vi/WePNs-G7puA/maxresdefault.jpg" />
                            }
                        </div>
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                        {/* Sidebar content here */}
                        <li><a href="/update-profile">Profile</a></li>
                        <li><a>Order</a></li>
                        <li><a>User Settings</a></li>
                        <li><a onClick={logoutHandler}>Log Out</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Profile