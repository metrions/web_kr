import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import TextsPanel from './TextsPanel';
import EditorPanel from "./EditorPanel";

function AppRoutes() {
    let routes = useRoutes([
        { path: '/texts', element: <TextsPanel /> },
        { path: '/text/:uuid', element: <EditorPanel /> },
    ]);
    return routes;
}

function App() {
    return (
        <BrowserRouter> {/* Убедитесь, что Routes находится внутри BrowserRouter */}
            <AppRoutes />
        </BrowserRouter>
    );
}

export default App;
