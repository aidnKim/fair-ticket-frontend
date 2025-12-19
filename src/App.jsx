// src/App.jsx

import { useOutlet } from 'react-router-dom';

function App() {
    //React Router v6 에서 제공하는 hook
    //현재 경로에 맞는 자식 route component 를 반환한다
    const currentOutlet=useOutlet();

    return (
        <div className="container">
            {currentOutlet}
        </div>
    );
}

export default App;