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
        <div className='flex justify-around'>
            <Map city={city} />

            <div className='flex flex-col justify-around'>
                <div className='flex flex-col mt-8 gap-4 items-center'>
                    <h1 className='text-[2.3vw] font-bold'>Get your desired route </h1>
                    <button className='rounded-full bg-blue-300 text-white p-2 font-semibold text-[1.2vw]
                        w-[220px] shadow-2xl hover:w-[240px] hover:p-2.5 duration-[700ms]' onClick={clickHandler1}> Search Now </button>
                </div>

                <div className='flex flex-col mt-8 gap-4 items-center'>
                    <h1 className='text-[1.3vw] font-semibold'>Or want to know the traffic congestion to plan your journey ?</h1>
                    <div className='text-sm flex flex-col items-center'>
                    <span>Right now we have data only for Delhi.</span>
                    <span> Still want to know the congestion</span>
                    </div>
                    <button  className='rounded-full bg-blue-300 text-white p-2 font-semibold text-[1.2vw]
                        w-[130px] shadow-2xl hover:w-[150px] hover:p-2.5 duration-[700ms]' onClick={clickHandler}>Know </button>
                </div>
            </div>

        </div>
    )
}

export default Home; 