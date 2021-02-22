import React from 'react';

function SVG(props) {
  return (
    <svg>
        <use xlinkHref={`${props.file}#${props.name || ''}`} />
    </svg>
  )
}

export default SVG;