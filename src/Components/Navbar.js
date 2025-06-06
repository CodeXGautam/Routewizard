import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';


const Navbar = (props) => {

    const isloggedIn = props.isloggedIn;
    const setLogin = props.setLogin;

    const navigate = useNavigate();

    return (
        <div className='flex justify-between items-center w-[100%] h-[100%] py-[0.7vw] px-[4vw] shadow-md text-slate-950'>
            <div>
                <NavLink to='/'>
                    <div className='text-lg font-bold'>
                        RouteWizard
                    </div>
                </NavLink>
            </div>

            <div className='flex justify-center gap-[2vw] items-center'>
                {isloggedIn &&
                    <NavLink to='/home'>
                        <div className='text-md font-semibold'>Home</div>
                    </NavLink>
                }

                {isloggedIn &&
                    <NavLink to='/search'>
                        <div className='text-md font-semibold'>Search</div>
                    </NavLink>

                }

                {isloggedIn &&
                    <NavLink to='/profile'>
                        <div className='text-md font-semibold'>Profile</div>
                    </NavLink>
                }

                {isloggedIn &&
                    <NavLink to='/' onClick={() => setLogin(false)}>
                        <div className='text-md font-semibold bg-sky-100 hover:bg-sky-200 rounded-lg p-2 text-gray-900'
                            onClick={() => {
                                toast.error('Logged Out')
                                navigate("/")
                            }}>Log Out </div>
                    </NavLink>
                }

                {!isloggedIn &&
                    <NavLink to='/login'>
                        <div className='text-md font-semibold  hover:bg-sky-100 rounded-lg p-2 text-gray-900'>Login</div>
                    </NavLink>
                }

                {!isloggedIn &&
                    <NavLink to='/register'>
                        <div className='text-md font-semibold  hover:bg-sky-100 rounded-lg p-2 text-gray-900'>Register</div>
                    </NavLink>
                }



            </div>
        </div>
    )
}

export default Navbar;