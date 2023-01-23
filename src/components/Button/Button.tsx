import React from 'react';

const Button = () => {
  const handleClick = () => {
    console.log('Clicado');
  };

  return <button onClick={handleClick}>Botão</button>;
};

export default Button;
