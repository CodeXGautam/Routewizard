import { NavLink, useNavigate } from "react-router";
import mapImage from '../images/map.png'
import { useState } from "react";
import { toast } from "react-hot-toast";



const Login = (props) => {

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


    function submitHandler(event) {
        event.preventDefault();
        if (loginData.email === "" || loginData.password === "") {
            toast.error("Please fill all the fields");
            return;
        }

        else {
            toast.success("Login successful");
            setLoginData({
                email: "",
                password: ""
            });

            console.log(loginData);
            console.log("Form submitted");
            setLogin(true);
            navigate('/home');
        }

    }

    return (
        <div className="overflow-hidden h-[100%] w-[100%]">
            <div className="flex items-center justify-center h-[100%] z-10 relative w-[100%]" >
                <img src={mapImage} alt="Map" className="w-full h-[100%] object-cover opacity-20 absolute" />
                <div className="flex flex-col items-center p-6 gap-3 bg-white bg-opacity-30 rounded-lg shadow-lg w-[32%] z-10">
                    <div className="flex flex-col items-center gap-2">
                        <h1 className="font-bold text-4xl">Welcome Back !</h1>
                        <p className="text-gray-700 text-md">Hey, glad to see you back here</p>
                    </div>
                    <form className="flex flex-col gap-4 w-[100%] mt-0" onSubmit={submitHandler}>
                        <input type="email" placeholder="Email / Username" value={loginData.email} id="email" name="email"
                             className="text-gray-900 border-2 border-gray-600 p-2 rounded-md" onChange={changeHandler} />
                        <input type="password" placeholder="Password" value={loginData.password} name="password" id="password"
                            className="text-gray-900 border-2 border-gray-600 p-2 rounded-md" onChange={changeHandler} />
                        <span className="text-sm text-gray-800">Do not have an account?
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