import React from 'react';
import { useParams } from 'react-router-dom';

const User = () => {
  const { id } = useParams();

  return <div>Manage User: {id}</div>;
};

export default User;
