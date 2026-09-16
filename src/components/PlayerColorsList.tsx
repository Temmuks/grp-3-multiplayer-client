import CircleComponent from "./CircleComponent"

type PlayerColorsListProps = {
    maxPlayers: number,
    colors: string[]
}

function PlayerColorsList({maxPlayers, colors} : PlayerColorsListProps) {
    const UNOCCUPIED_SPOT_COLOR = "darkgray";
    const circles: React.ReactNode[] = [];
    colors.forEach((color) => {
        circles.push(
            <CircleComponent key={"color-" + color} color={color}/>
        )
    })
    for (let i = colors.length; i<maxPlayers; i++){
        circles.push(
            <CircleComponent key={"color-" + i} color={UNOCCUPIED_SPOT_COLOR} />
        )
    }
  return (
    <div className="colors-list">
        {circles}
    </div>
  )
}

export default PlayerColorsList