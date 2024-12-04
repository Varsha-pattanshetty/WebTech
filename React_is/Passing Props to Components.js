import React from 'react';

const Greeting = ({ name }) => {
  return <h2>Hello, {name}!</h2>;
};

const App = () => {
  return (
    <div>
      <Greeting name="React Developer" />
    </div>
  );
}

export default App;
