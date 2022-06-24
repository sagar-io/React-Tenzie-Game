export default function Die(props) {
  const style = {
    background: props.isHeld ? "#59E391" : "#FFFFFF",
  };
  return (
    <div
      style={style}
      className= "die-container"
      onClick={props.handleHold}
    >
      <div className= {"die" + " " + "die-" + props.value}>
        <div className="dot dot-1"></div>
        <div className="dot dot-2"></div>
        <div className="dot dot-3"></div>
        <div className="dot dot-4"></div>
        <div className="dot dot-5"></div>
        <div className="dot dot-6"></div>
      </div>
    </div>
  );
}
