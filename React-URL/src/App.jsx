import { useState } from "react";
import axios from "axios";
import { ShaderGradientCanvas, ShaderGradient } from "shadergradient";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("https://nex-link.onrender.com/api/shorten", {
        originalUrl: url,
      });
      setShortUrl(`https://nex-link.onrender.com/${res.data.shortId}`);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="app-wrapper">
      <div className="gradient-bg">
        <ShaderGradientCanvas
          style={{ width: "100%", height: "100%" }}
          pointerEvents="none"
          pixelDensity={1}
        >
          <ShaderGradient
            control="query"
            urlString="https://www.shadergradient.co/customize?animate=on&axesHelper=off&bgColor1=%23000000&bgColor2=%23000000&brightness=1&cAzimuthAngle=180&cDistance=2.8&cPolarAngle=80&cameraZoom=9.1&color1=%23242880&color2=%238d7dca&color3=%23212121&destination=onCanvas&embedMode=off&envPreset=city&format=gif&fov=45&frameRate=10&gizmoHelper=hide&grain=off&lightType=3d&pixelDensity=1&positionX=0&positionY=0&positionZ=0&range=enabled&rangeEnd=40&rangeStart=0&reflection=0.1&rotationX=50&rotationY=0&rotationZ=-60&shader=defaults&type=waterPlane&uAmplitude=0&uDensity=1.5&uFrequency=0&uSpeed=0.3&uStrength=1.5&uTime=8&wireframe=false&zoomOut=false"
          />
        </ShaderGradientCanvas>
      </div>
      <div className="content-overlay">
        <div className="glass-card">
          <h1>Nex Link</h1>
          <p className="subtitle">Make your long URLs short & sweet.</p>

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input
                type="text"
                placeholder="Paste your long link here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="shorten-btn" disabled={loading}>
              {loading ? "Shrinking..." : "Shorten It"}
            </button>
          </form>

          {shortUrl && (
            <div className="result-box">
              <span className="short-link">{shortUrl}</span>

              <button
                onClick={handleCopy}
                className={`copy-btn ${copied ? "copied" : ""}`}
              >
                {copied ? "Copied! 🎉" : "Copy 📋"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;

