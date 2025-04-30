import { Route, Routes } from 'react-router';
import Navbar from './Components/Navbar';
import Start from './Pages/Start';
import Home from './Pages/Home';
import Search from './Pages/Search';
import { useState, } from 'react';
import Delhi from './Pages/Delhi';

function App() {

  // const [data, setData] = useState([
  //   {
  //     lat: '51.5072',
  //     lon: '-0.1276'
  //   },
  //   {
  //     lat: '51.5072',
  //     lon: '-0.1276'
  //   }
  // ]);

  const [city, setCity] = useState('');

  function handleChange(city) {
    setCity(city);
    console.log(city)
  }

  return (
    <div className="flex flex-col overflow-x-hidden">
      <div>
        <Navbar />
      </div>


      <Routes>
        <Route path='/' element={<Start city={city} onDatachange={handleChange} />} />
        {/* <Route path='home' element={<Home lat={data[0]['lat']} lon={data[0]['lon']} />} /> */}
        <Route path='home' element={<Home  city={city}/>} />
        <Route path='search' element={<Search/>}/>
        <Route path='delhi' element={<Delhi/>}/>

      </Routes>

    </div>
  );
}

export default App;






