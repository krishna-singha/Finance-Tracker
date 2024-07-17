import { useNavigate } from "react-router-dom";

const Error = () => {
    const navigate = useNavigate();
    const navigateTo = (path) => {
        navigate(path);
    }

    return (
        <section className="min-h-screen flex items-center justify-center">
            <div className="text-2xl flex flex-col items-center gap-4">
                <h1>404! Page Not Found</h1>
                <button onClick={() => navigateTo("/")} className="bg-blue-600 text-white px-4 py-2 rounded-xl">Go Back</button>
            </div>
        </section>
    )
}

export default Error;