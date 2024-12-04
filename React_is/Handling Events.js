import React, { useState } from 'react';

const App = () => {
  const [name, setName] = useState('');

  const handleChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div>
      <h1>Hello, {name}</h1>
      <input 
        type="text" 
        value={name} 
        onChange={handleChange} 
        placeholder="Enter your name"
      />
    </div>
  );
}

export default App;
