import {  RingLoader } from "react-spinners";

const Loading = () => {

    const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)" };


    return (
        <div style={style}>
            <RingLoader
                color="#0d00ff"
                cssOverride={null}
                size={100}
                speedMultiplier={1}
            />            
        </div>
    )
}

export default Loading