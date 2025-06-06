import Map from '../Components/Map';
import { useNavigate } from 'react-router';




const Home = ({ city }) => {

    const navigate = useNavigate();


    const clickHandler = () => {
        navigate('/delhi');
    }

    const clickHandler1 = () => {
        navigate('/search');
    }

    return (
        <div className='flex justify-around flex-col sm:flex-row lg:flex-row md:flex-row items-center w-[100%] mt-2 mb-4'>
            <div className='w-[80%] sm:w-[58%] lg:w-[58%] md:w-[58%] h-[100vh] items-center flex justify-center'>
            <Map city={city} />
            </div>

            <div className='flex flex-col gap-20 w-[100%] sm:w-[40%] lg:w-[40%] md:w-[40%] justify-center items-center'>
                <div className='flex flex-col mt-8 gap-4 items-center'>
                    <h1 className='text-2
                    xl sm:text-2xl md:text-2xl lg:text-2xl font-semibold font-bold'>Get your desired route </h1>
                    <button className='rounded-full bg-blue-400 text-white p-2 font-semibold text-md
                        w-[220px] shadow-2xl hover:w-[240px] hover:p-2.5  hover:bg-blue-500 duration-[700ms]' onClick={clickHandler1}> Search Now </button>
                </div>

                <div className='flex flex-col mt-8 gap-4 items-center justify-center w-[90%]'>
                    <h1 className='text-lg sm:text-md md:text-md lg:text-lg font-semibold flex justify-center items-center'>Want to know the traffic congestion to plan your journey ?</h1>
                    <div className='text-md sm:text-sm md:text-sm lg:text-sm flex flex-col items-center'>
                    <span className='flex w-[100%] m-auto'>Right now we have data only for Delhi.</span>
                    <span className='flex w-[100%] m-auto'> Still want to know the congestion for analysis</span>
                    </div>
                    <button  className='rounded-full bg-blue-400 text-white p-2 font-semibold text-md
                        w-[130px] shadow-2xl hover:w-[150px] hover:p-2.5  hover:bg-blue-500 duration-[700ms] mb-2' onClick={clickHandler}>Know </button>
                </div>
            </div>

        </div>
    )
}

export default Home; 