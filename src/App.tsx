import "./App.css";
import { Suspense, useState } from "react";
import SpeechToText from "./Pages/Speech/speechTotext";
import MapView from "./Pages/Map/mapView";

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <MapView searchTerm={searchTerm} />
        <SpeechToText onSearch={handleSearch} />
      </Suspense>
    </>
  );
}

export default App;
