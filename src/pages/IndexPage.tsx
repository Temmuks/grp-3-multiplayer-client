import GameRoomsList from "../components/GameRoomsList"
import "../App.css"

function IndexPage() {
  return (
    <div className="landingpagecontainer">
        <h1>Snake Attack</h1>
        <GameRoomsList />
    </div>
  )
}

export default IndexPage