import React from 'react'
import { Helmet } from "react-helmet-async";

const Meta = ({title, description, keywords}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  )
}

Meta.defaultProps = {
  title: "Adhunika",
  description: "One stop solution for your favourite fashionware",
  keywords: "fashion, buy desses, branded product in best price"
}

export default Meta
