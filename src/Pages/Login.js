import { NavLink, useNavigate } from "react-router";
import mapImage from '../images/map.png'
import { useState } from "react";
import { toast } from "react-hot-toast";





const Login = (props) => {

    const url = 'http://localhost:4000/'

    const setLogin = props.setLogin;

    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const changeHandler = (event) => {
        setLoginData((prev) => {
            return {
                ...prev,
                [event.target.name]: event.target.value
            }
        })
    }


    const submitHandler = async (event) => {
        event.preventDefault();
        console.log(loginData)
        if (loginData.email === "" || loginData.password === "") {
            toast.error("Please fill all the fields");
            return;
        }

        else {
            // Here you would typically send the loginData to your backend API
            // For example, using fetch or axios:

             await fetch(`${url}api/login`, {
                method: 'POST',  // // Adjust the URL to your backend endpoint   
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            })
                .then(response => response.json())
                .then(response => {

                    if(!response) {
                        toast.error("Login failed. Please try again."); 
                        return;
                    }

                    else if(response.message === "All fields are required"){
                        toast.error("All fields are required. Please fill in all fields.");
                        console.log('Error: ', response.message);
                        return;
                    }

                    else if (response.message === "User not found") {
                        toast.error("User not found. Please check your email or username."); 
                        console.log('Error: ', response.message);
                        return;
                    }
                    
                    else if (response.message === "Invalid password") {
                        toast.error("Invalid password. Please try again."); 
                        console.log('Error: ', response.message);
                        return;
                    }

                    else {
                        toast.success("Login successful");
                        console.log('Login successful:', response);
                        setLogin(true);
                        navigate('/home');
                        setLoginData({
                            email: "",
                            password: ""
                        });

                    } 
                })
                .catch(error => {
                    toast.error("An error occurred during login");
                    console.error("Error during login:", error);
                    
                });
        }

    }

    return (
        <div className="overflow-hidden h-[100%] w-[100%]">
            <div className="flex items-center justify-center h-[100%] z-10 relative w-[100%]" >
                <img src={mapImage} alt="Map" className="w-full h-[100%] object-cover opacity-20 absolute" />
                <div className="flex flex-col items-center p-6 gap-3 bg-white bg-opacity-30 rounded-lg shadow-lg w-[35%] min-w-[300px] z-10">
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="font-bold text-3xl sm:text-3xl md:text-3xl lg:text-4xl">Welcome Back !</h1>
                        <p className="text-gray-700 text-md sm:text-md md:text-md lg:text-lg">Hey, glad to see you back here</p>
                    </div>
                    <form className="flex flex-col gap-4 w-[100%] mt-0" onSubmit={submitHandler}>
                        <input type="email" placeholder="Email" value={loginData.email} id="email" name="email"
                            className="text-gray-900 border-2 border-gray-600 p-2 rounded-md" onChange={changeHandler} />
                        <input type="password" placeholder="Password" value={loginData.password} name="password" id="password"
                            className="text-gray-900 border-2 border-gray-600 p-2 rounded-md" onChange={changeHandler} />
                        <span className="text-md text-gray-800">Do not have an account?
                            <NavLink to={'/register'} className="text-blue-400 font-semibold"> Register Now</NavLink>
                        </span>
                        <button className="text-md font-semibold bg-blue-500 rounded-lg p-3 text-white"> Login </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;