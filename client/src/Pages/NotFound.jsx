import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div 
            style={{ textAlign: "center", marginTop: "4rem" }}>
                <h1>404</h1>
                <p>Page Not Found</p>

                <Link to="/" 
                    style={{color: "blue" }}>Go Back Home</Link>
            </div>
    )
}