// import { circleMarker } from "leaflet";
import WorldMap from "../Components/Worldmap";
import { useState, } from "react";
import { useNavigate } from "react-router-dom";



// const Start = ({data, onDatachange}) => {

//     const url = 'https://geocode.maps.co/search?';
//     const apiKey = '67f54d4946420224742584krhcd6abb';

//     const [location, setLocation] = useState({
//         city: '',
//     }
//     )

//     const navigate = useNavigate();

//     const api_url = url +`q=${location.city}` + `&api_key=${apiKey}`;
//     console.log(api_url);


//     async function fetchData() {
//         try {
//             const output = await fetch(api_url);
//             var data = await output.json();
//             console.log(data);
//             onDatachange(data);
//         }

//         catch (error) {
//             console.log(error);
//             console.log("Error in finding coordinates of the searched city");
//             setLocation('');
//         }
//     }

//     function changeHandler(events) {
//         setLocation((prev) => {

//             const { name, value, checked, type } = events.target;

//             return {
//                 ...prev,
//                 [name]: type === "checkbox" ? checked : value
//             }

//         }
//         )
//     };

//     // console.log(location.city);
//     // console.log(data);

//     function submitHandler(events) {
//         events.preventDefault();
//         fetchData();
//         console.log('Button pressed');
//         navigate('/home');
//     }


//     return (
//         <div>
//             <div className='w-[100%] h-[100%] relative flex justify-center items-center'>
//                 <WorldMap data={data} />
//                 <div className='absolute flex flex-col gap-[15px] w-full justify-center items-center z-10'>
//                     <h1 className='text-5xl font-bold'>
//                         Welcome to RouteWizard
//                     </h1>
//                     <form className='flex flex-col gap-[10px] justify-center items-center w-[70%]' onSubmit={submitHandler}>
//                         <input placeholder='Enter your location' className='p-[5px] rounded-full text-center w-[100%] text-black border-none'
//                             name="city" id="city" value={location.city} onChange={changeHandler} />
//                         <button className='bg-blue-300 text-white rounded-full py-[8px] w-[40%]'>Get Started</button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     )
// }

const Start = ({city, onDatachange}) => {

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
        // fetchData();
        console.log('Button pressed');
        onDatachange(location.city)
        navigate('/home');
    }

    return (
        <div>
            <div className='w-[100%] h-[100%] relative flex justify-center items-center'>
                <WorldMap/>
                <div className='absolute flex flex-col gap-[15px] w-full justify-center items-center z-10'>
                    <h1 className='text-5xl font-bold'>
                        Welcome to RouteWizard
                    </h1>
                    <form className='flex flex-col gap-[10px] justify-center items-center w-[70%]' onSubmit={submitHandler}>
                        <input placeholder='Enter your location' className='p-[5px] rounded-full text-center w-[100%] text-black border-none'
                            name="city" id="city" value={location.city} onChange={changeHandler} />
                        <button className='bg-blue-300 text-white rounded-full py-[8px] w-[40%]'>Get Started</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Start;