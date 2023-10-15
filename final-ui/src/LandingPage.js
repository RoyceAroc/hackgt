import sample from "./assets/sample-1.png";
import s from "./landing.css";
import React, {useState} from "react";
import microphoneImg from "./assets/microphone.svg";
import VideoPlayer from "./VideoPlayer";

const LandingPage = (props) => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    

    return (
        <div >
            <div className="wrapper">
                <div>
                    <div style={{fontSize: 96, fontFamily: "Trebuchet MS"}}>
                        ART.iculate
                    </div>
                   
                    <div style={{fontSize: 32, fontFamily: "Trebuchet MS", marginLeft: 96, marginRight: 96, marginTop: 16, marginBottom: 16}}>
                        Tell YOUR story one AI-generated art-piece at a time
                    </div>
                    <button id="startButton" className="elevated-button" onClick={() => {window.scrollBy(0, window.innerHeight)}}>
                        Get Started 🎨
                    </button>

                </div>
                <img src={sample} alt="shipwreck-ai-generated" className="img" />
            </div>
            
        </div>
    )
}

export default LandingPage;