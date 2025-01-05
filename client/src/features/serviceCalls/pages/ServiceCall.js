import React from 'react'
import { useParams } from 'react-router-dom';

const ServiceCall = () => {
  const { id } = useParams();

  return (
    <div>ServiceCall: {id}</div>
  )
}

export default ServiceCall