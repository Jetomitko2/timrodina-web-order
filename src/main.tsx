import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log("main.tsx: Starting app render");
console.log("main.tsx: Root element found:", document.getElementById("root"));
createRoot(document.getElementById("root")!).render(<App />);
