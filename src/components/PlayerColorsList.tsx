import CircleComponent from "./CircleComponent"

type PlayerColorsListProps = {
    colors: string[]
}

function PlayerColorsList({colors} : PlayerColorsListProps) {
  return (
    <div className="colors-list">{colors.map(color => {
        return <CircleComponent color={color}/>
    })}</div>
  )
}

export default PlayerColorsList