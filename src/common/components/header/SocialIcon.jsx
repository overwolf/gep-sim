import React from 'react';

function SocialIcon(props) {
  return (
    <a target="_blank" href={props.href}>
      <img src={props.src}/>
    </a>
  )
}

export default SocialIcon;