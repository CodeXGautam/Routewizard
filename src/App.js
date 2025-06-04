import { Route, Routes } from 'react-router';
import Navbar from './Components/Navbar';
import Start from './Pages/Start';
import Home from './Pages/Home';
import Search from './Pages/Search';
import { useState, } from 'react';
import Delhi from './Pages/Delhi';
import Register from './Pages/Register';
import Login from './Pages/Login';
import Profle from './Pages/Profile';

function App() {

  const [city, setCity] = useState('');

  const [isloggedIn, setLogin] = useState(false)

  function handleChange(city) {
    setCity(city);
    console.log(city)
  }

  return (
    <div className="flex flex-col overflow-auto h-screen w-[100%]">
      <div className='w-[100%] h-[8.5%]'>
        <Navbar isloggedIn={isloggedIn} setLogin={setLogin}/>
      </div>

      <div className='h-[100%] w-[100%]'>
      <Routes>
        <Route path= '*' element={<Start city={city} onDatachange={handleChange} />}/>
        <Route path='/' element={<Start city={city} onDatachange={handleChange} />} />
        <Route path='/register' element={<Register setLogin={setLogin}/>}/>
        <Route path='/login' element={<Login setLogin={setLogin}/>}/>
        <Route path='/home' element={<Home  city={city}/>} />
        <Route path='/search' element={<Search/>}/>
        <Route path='/delhi' element={<Delhi/>}/>
        <Route path='/profile' element= {<Profle/>}/>
      </Routes>
      </div> 

    </div>
  );
}

export default App;






