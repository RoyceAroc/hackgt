import React, {useEffect, useState} from 'react';
import './bookreader.css';
import microphoneImg from "./assets/microphone.svg";
const BookReader = ({auth}) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [text, setText] = useState(["Click the mic to start recording your story"])
    const [pics, setPics] = useState(["https://static.thenounproject.com/png/4974686-200.png"]);
    const [divs, setDivs] = useState([
        <div style={{backgroundColor: "#f0f0f0", width: "25vw", height: 550, border: '1px solid #444', borderBottomLeftRadius: 25, borderTopLeftRadius: 25}}/>,
        <div style={{backgroundColor: "#f0f0f0", width: "25vw", height: 550, border: '1px solid #444', borderBottomRightRadius: 25, borderTopRightRadius: 25}}/>
    ]);

    const [listening, setListening] = useState(false)
    const [recognition, setRecognition] = useState();


    const apiUrl = "http://127.0.0.1:5000/process_image";
    const [transcription, setTranscription] = useState('');
    let sentences = [];
    let images = [];
    function recursion() {
        var image, prompt_before;
        if (images.length == 0) {
            image = "none"
            prompt_before = "none"
        } else {
            image = images[images.length-1];
            prompt_before = sentences[sentences.length-2];
        }

        prompt = sentences[sentences.length-1]
        const requestBody = {
            image: image,
            prompt: prompt,
            prompt_before: prompt_before
        };

        const requestOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        };

        return fetch(apiUrl, requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }


    const startListening = () => {
        let before = 0;
        setListening(true);
        setTranscription('');

        let recognition = (new window.webkitSpeechRecognition() || window.speechRecognition());
        setRecognition(recognition)
        recognition.lang = 'en-US';
        recognition.interimResults = true;
        recognition.continuous = true;

        recognition.onresult = (event) => {
            if(before === event.results.length-3) {
                before++;
                let prompt = event.results[event.results.length - 3][0].transcript;
                sentences.push(prompt);
                text.push(prompt)
                setText(text)
                recursion()
                    .then((data) => {
                        console.log(text)
                        console.log("Sentence: " + prompt);
                        console.log(data);
                        console.log(data["output"][0])
                        images.push(data["output"][0])
                        pics.push(data["output"][0])
                        setPics(pics)
                        console.log(pics)
                        console.log("Corresponding Image: " + data);

                        const divs = [];

                        for (let i = 0; i < pics.length; i++) {
                            divs.push(<div className="demoPage">
                                <div style={{backgroundColor: "#f0f0f0", width: "25vw", height: 550, border: '1px solid #444', borderBottomLeftRadius: 25, borderTopLeftRadius: 25}}>
                                    <img src={pics[i]} alt="Microphone" width={200} height={200}/>
                                </div>
                            </div>);
                            divs.push(<div className="demoPage">
                                <div style={{backgroundColor: "#f0f0f0", width: "25vw", height: 550, border: '1px solid #444', borderBottomRightRadius: 25, borderTopRightRadius: 25}}>
                                    <div className="styled-text">{text[i]}</div>
                                </div>
                            </div>);
                        }
                        setDivs(divs)

                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            }
        };

        recognition.onend = () => {
            setListening(false);
        };

        recognition.start();
    };

    const stopListening = () => {
        if (recognition) {
            recognition.stop();
        }
    };

    const turnPage = (direction) => {
        if (direction === 'next' && currentPage < getPageCount() - 2) {
            setCurrentPage(currentPage + 2);
        } else if (direction === 'prev' && currentPage > 1) {
            setCurrentPage(currentPage - 2);
        }
    };

    const getPageCount = () => text.length * 2


    return (
        <div className="container">
            {auth && <div className="nav-bar">

            </div>}
            <div>
                {<button id="startButton" className="fab" disabled={listening} style={{visibility: listening ? "hidden" : "visible"}}>
                    <img src={microphoneImg} alt="Microphone" onClick={startListening}/>
                </button>}
                {<button id="stopButton" className="fab" disabled={!listening} style={{visibility: listening ? "visible" : "hidden"}}>
                    <img src={microphoneImg} alt="Microphone" onClick={stopListening}/>
                </button>}
                <div id="elapsedTime" className="styled-text">0:00</div>
            </div>
            <div className="book-reader">
                <div className="book">
                    <div className={currentPage === 0 ? "start-page" : "left-page"} onClick={() => turnPage('prev')}>
                        <div className="page-text">{text[currentPage / 2]}</div>
                    </div>
                    <div className="divider"></div>
                    <div className={currentPage < getPageCount() - 2 ? "right-page" : "end-page"} onClick={() => turnPage('next')}>
                    <div className="page-image">
                        <img src={pics[(currentPage / 2)]} width="300" alt="Page Image" />
</div>
                </div>
            </div>
            </div>

        </div>
    );
};


export default BookReader;