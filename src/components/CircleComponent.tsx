import crownImage from "../assets/crown.png"
interface Props {
  color: string;
  isWinner: boolean;
}

const CircleComponent = ({ color, isWinner}: Props) => {
  return <div className="circle-container">
      {isWinner ? (
        <img className="circle-crown" src={crownImage} alt="" />
      ) : (
        <></>
      )}
      <div className="circle" style={{ background: color }}></div>
    </div>
};

export default CircleComponent;
