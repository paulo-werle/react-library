import React from 'react';

const Button = () => {
  const handleClick = () => {
    console.log('Button - handleClick');
  };

  return <button onClick={handleClick}>Botão</button>;
};

export default Button;
