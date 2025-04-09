import { useState } from 'react'
import reactLogo from './assets/react.svg'
import { Table } from './components/table/Table'

export const App = () => {
    const [count, setCount] = useState(0)

    return (
        <>
            <div>
                <a href="https://vite.dev" target="_blank"/>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
            </div>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/ui/App.tsx</code> and save to test HMR
                </p>
                <Table columns={["Nome", "Idade"]} rows={}/>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </>
    )
}
