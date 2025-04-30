import {NavLink} from 'react-router-dom';

const Navbar = () =>{
    return(
    <div className='flex justify-between items-center w-[100vw] py-[0.7vw] px-[4vw]'>
        <div>
            <NavLink to='/'>
                <div className='text-lg font-bold'>
                    RouteWizard
                </div>
            </NavLink>
        </div>

        <div className='flex justify-center gap-[2vw] items-center'>
            <NavLink to='/home'>
                <div className='text-md font-semibold'>Home</div>
            </NavLink>

            <NavLink to='/search'>
                <div className='text-md font-semibold'>Search</div>
            </NavLink>

            <NavLink to='/about'>
                <div className='text-md font-semibold'>About</div>
            </NavLink>
       </div>
    </div>
    ) 
}

export default Navbar;