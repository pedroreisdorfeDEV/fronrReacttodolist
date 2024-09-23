import './App.css';
import React from 'react';
import AdicaoTarefas from './components/AdicaoTarefas.js';
import './components/TarefasPage.css';
import './components/rodapeLayout.css';
import Rodape from './components/Rodape.js';

function App() {


  return (
      <div className="App">
        <AdicaoTarefas />
        <Rodape />  
      </div>
    );
}

export default App;
