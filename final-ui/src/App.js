import React, {useState} from 'react';
import styles from './styles.css';
import BookReader from "./BookReader";
import LandingPage from "./LandingPage";
const MyComponent = () => {


    const [authenticated, setAuthenticated] = useState(false)

    return (
        <div>
            {!authenticated && <div className="outer">
                <LandingPage setAuth={setAuthenticated}/>
                <BookReader/>
            </div>}
            {authenticated && <BookReader auth={authenticated}/>}
        </div>
    );
};

export default MyComponent;