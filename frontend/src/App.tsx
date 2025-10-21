import { useState } from 'react'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Apologize Is All You Need
        </h1>
        <p className="text-gray-600 mb-4">
          道歉应用正在开发中...
        </p>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => setCount((count) => count + 1)}
        >
          点击次数: {count}
        </button>
      </div>
    </div>
  )
}

export default App
