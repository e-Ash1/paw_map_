import { useEffect } from 'react';
import { getUserId } from './utils/userSession.js';
import { BrowserRouter } from "react-router-dom";
import PetResources from './api/PetResources.jsx';
import './index.css';

function App() {

  useEffect(()=>{
    getUserId()
  });
  return (
    <div>
      <BrowserRouter>
          <PetResources />
      </BrowserRouter>,
    </div>
  );
}

export default App;
