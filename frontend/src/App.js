import "./App.css";
import RegistrationForm from "./RegistrationForm";
const imgsrc = require('./p3.jpg')

function App() {
  
  return (
    <div className="App dynamic-gradient">
      <div className="header">WELCOME TO XYZ ESPORTS</div>
      <div className="info-form">
        <div className="image-container">
          <img src={imgsrc}alt="image1" className="adjusted-image" />
        </div>
        <div className="form"><RegistrationForm /></div>
      </div>
    </div>
  );
}

export default App;
