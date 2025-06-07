// import { circleMarker } from "leaflet";
import WorldMap from "../Components/Worldmap";
import { useState, } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";


const Start = ({ city, onDatachange , isloggedIn}) => {

    const [location, setLocation] = useState({
        city: '',
    }
    )



    const navigate = useNavigate();

    function changeHandler(events) {
        setLocation((prev) => {

            const { name, value, checked, type } = events.target;

            return {
                ...prev,
                [name]: type === "checkbox" ? checked : value
            }

        }
        )
    };

    function submitHandler(events) {
        events.preventDefault();

        if (location.city.trim() === '') {
            toast.error("Please enter a valid city name");
            return;
        }
        else {
            if (isloggedIn) {
                console.log('Button pressed');
                onDatachange(location.city)
                navigate('/home');  
            } 
            else {
                toast.success("Please register or login to continue");
                navigate('/register');
            }
        }
        // fetchData();

    }

    return (
        <div className=" h-screen">
            <div className='w-[100%] h-screen relative overflow-hidden flex justify-center items-center'>
                <WorldMap />
                <div className='absolute flex flex-col gap-[15px] w-full justify-center items-center z-10'>
                    <h1 className='text-3xl sm:text-5xl md:text-5xl lg:text-5xl font-bold flex justify-center items-center w-[100%]'>
                        Welcome to RouteWizard
                    </h1>
                    <form className='flex flex-col gap-[10px] justify-center items-center w-[60%] min-w-[300px]' onSubmit={submitHandler}>
                        <input placeholder='Enter your location' className='p-[5px] rounded-full text-center w-[100%] text-black border-none'
                             name="city" id="city" value={location.city} onChange={changeHandler} />
                        <button className='bg-blue-500  hover:bg-blue-600 text-white rounded-full py-[8px] w-[33%]'>Get Started</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Start;