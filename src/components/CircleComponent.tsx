import React from "react";

interface Props {
  color: string;
}

const CircleComponent = ({ color }: Props) => {
  return <div className="circle" style={{ background: color }}></div>;
};

export default CircleComponent;
