import { NavLink, useNavigate } from "react-router";
import image from '../images/imgroute.avif';
import { useState } from "react";
import toast from "react-hot-toast"; 




const Register = (props) => {


    const url = 'http://localhost:4000/'; 

    const setLogin = props.setLogin;
    const navigate = useNavigate();

    // const [showpassword, setShowPassword] = useState(false);
    // const [showconfirmPassword, setShowConfirmPassword] = useState(false);

    const [registerData, setRegisterData] = useState({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const changeHandler = (event) => {
        setRegisterData((prev) => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }


    const submitHandler = async (event) => {
        event.preventDefault();
        if (registerData.password !== registerData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        if(!(registerData.firstName || registerData.lastName || registerData.userName || registerData.email || registerData.password || registerData.confirmPassword)) {
            toast.error("All fields are required. Please fill in all fields.");
            return;
        }

        else {
            // Here you would typically send the registerData to your backend API
            // For example, using fetch or axios:
            await fetch(`${url}api/register`, {
                method: 'POST',  // // Adjust the URL to your backend endpoint   
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            })
                .then(response => response.json())
                .then(response => {


                    if (response.message === "All fields are required") {
                        console.error('Error:', response.message);
                        toast.error("All fields are required. Please fill in all fields.");
                        return;
                    }

                    else if (response.message === "Password must be at least 6 characters long") {
                        console.error('Error:', response.message);
                        toast.error("Password must be at least 6 characters long.");
                        setRegisterData({
                            password: "",
                            confirmPassword: ""
                        });
                        return;
                    }

                    else if (response.message === "User already exists") {
                        console.error('Error:', response.message);
                        toast.error("User already exists. Please try a different username or email.");
                        setRegisterData({
                            firstName: "",
                            lastName: "",
                            userName: "",
                            email: "",
                            password: "",
                            confirmPassword: ""
                        });
                        return;
                    }

                    else if (response.message === "Failed to create user") {
                        console.error('Error:', response.message);
                        toast.error("Failed to create user. Please try again.");
                        return;
                    }

                    else if (response.message === "Internal server error") {
                        console.error('Error:', response.message);
                        toast.error("Failed to create user. Please try again.");
                        return;
                    }


                    // If registration is successful    

                    else {
                        console.log('Success:', response);
                        // Handle success, e.g., redirect to login or home page
                        toast.success("Account Created");
                        setLogin(true);
                        navigate('/home');

                        setRegisterData({
                            firstName: "",
                            lastName: "",
                            userName: "",
                            email: "",
                            password: "",
                            confirmPassword: ""
                        });

                        console.log("Form submitted");
                        console.log(registerData);
                    }

                }
                )

                .catch((error) => {
                    console.error('Error:', error);
                    // Handle error, e.g., show an error message
                    toast.error("Registration failed. Please try again.");
                });

        }

    }



    return (
        <div className="flex flex-col gap-10 w-[100%] justify-center items-center p-4 md:flex-row lg:flex-row sm:gap-6">

            <div className="flex flex-col gap-6 min-w-[300px] w-[70%] md:w-[45%] lg:w[45%] rounded-lg px-8  py-6 border-2 justify-center shadow-lg">

                <h1 className="text-2xl flex text-gray-900">Register Now</h1>

                <form className="flex flex-col gap-3 w-[100%]" onSubmit={submitHandler}>

                    <span className="flex flex-col gap-3 lg:flex-row lg:gap-4">
                        <label className="text-gray-800 text-sm flex flex-col gap-2 w-[100%]">First Name
                            <input type="text" onChange={changeHandler} name="firstName" id="firstName" value={registerData.firstName}
                                className="text-gray-900 border-2 border-gray-600 p-2 rounded-md" />
                        </label>

                        <label className="text-gray-800 text-sm flex flex-col gap-2 w-[100%]">Last Name
                            <input type="text" onChange={changeHandler} name="lastName" id="lastName" value={registerData.lastName}
                                className="text-gray-900 border-2 border-gray-600 p-2 rounded-md" />
                        </label>
                    </span>

                    <label className="text-gray-800 text-sm flex flex-col gap-2">Username
                        <input type="text" onChange={changeHandler} name="userName" id="userName" value={registerData.userName}
                            className="text-gray-900 border-2 border-gray-600 p-2 rounded-md" />
                    </label>

                    <label className="text-gray-800 text-sm flex flex-col gap-2">Email
                        <input type="email" onChange={changeHandler} name="email" id="email" value={registerData.email}
                            className="text-gray-900 border-2 border-gray-600 p-2 rounded-md" />
                    </label>

                    <label className="text-gray-800 text-sm flex flex-col gap-2">Password
                        <input type="password" onChange={changeHandler} name="password" id="password" value={registerData.password}
                            className="text-gray-900 border-2 border-gray-600 p-2 rounded-md" />
                    </label>

                    <label className="text-gray-800 text-sm flex flex-col gap-2">Confirm Password
                        <input type="password" onChange={changeHandler} name="confirmPassword" id="confirmPassword" value={registerData.confirmPassword}
                            className="text-gray-900 border-2 border-gray-600 p-2 rounded-md" />
                    </label>
                    <span className="text-md text-gray-800">Already have a account ? <NavLink to={'/login'} className="text-blue-400 font-semibold">Login</NavLink></span>
                    <button className="text-md font-semibold bg-blue-500 rounded-lg p-3 text-white"> Register </button>
                </form>
            </div>

            <div className="w-[50%] h-[100%] flex items-center justify-center flex-col gap-4 hidden md:flex lg:flex">
                <h1 className="font-bold hidden sm:flex sm:text-2xl md:text-3xl md:flex lg:flex lg:text-4xl justify-center text-slate-950">RouteWizard</h1>
                <p className="text-md flex justify-center text-slate-950">Optimizing Movement. Enhancing Efficiency.</p>
                <img src={image} alt="map" className="w-[90%]" />
            </div>
        </div>
    )
}

export default Register;