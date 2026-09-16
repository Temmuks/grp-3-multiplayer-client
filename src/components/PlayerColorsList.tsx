import CircleComponent from "./CircleComponent"

type PlayerColorsListProps = {
    maxPlayers: number,
    colors: string[]
}

function PlayerColorsList({maxPlayers, colors} : PlayerColorsListProps) {
    const UNOCCUPIED_SPOT_COLOR = "#202023";
    const circles: React.ReactNode[] = [];

    // Add circles for each joined player's color
    colors.forEach((color) => {
        circles.push(
            <CircleComponent key={"color-" + color} color={color}/>
        )
    })

    // Add unoccupied player slots represented by some color 'UNOCCUPIED_SPOT_COLOR'
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