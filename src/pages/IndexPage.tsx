import GameRoomsList from "../components/GameRoomsList"
import "../App.css"

function IndexPage() {
  return (
    <div className="landingpagecontainer">
        <h1 className="typewriter">Snake Attack</h1>
        <div className="game-list-decoration">
          <span className="side-snake side-snake--left" aria-hidden="true" />
          <span className="snake-turn-trail snake-turn-trail--left" aria-hidden="true" />
          <GameRoomsList />
          <span className="side-snake side-snake--right" aria-hidden="true" />
          <span className="snake-turn-trail snake-turn-trail--right" aria-hidden="true" />
          <span className="snake-collision" aria-hidden="true">X</span>
        </div>
    </div>
  )
}

export default IndexPage