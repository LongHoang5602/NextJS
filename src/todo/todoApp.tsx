import { useState } from "react"
import { Link } from "react-router-dom"

const TodoApp = () => {
    const [name, setName] = useState("")
    const handleSubmit = (event: any) => {
        setName(event.target.value)
    }
    return (
        <>
            <Link to="/" >
                <div>Input</div>
                <input type="text" onChange={(event) => {
                    handleSubmit(event)
                }} />
                <button onClick={() => {
                    alert(name)
                }}>Save</button>
            </Link>
        </>
    )
}
export default TodoApp