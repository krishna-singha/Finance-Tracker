import StylishBtn from "../StylishBtn";

const Suggesions = () => {
    return (
        <div className='bg-[#181C3A] text-[#09C9C8] rounded-xl p-4 w-full h-[35rem] relative'>
            <h1 className="text-center">Suggesion by AI</h1>
            <div className="absolute top-3 right-3">
                <StylishBtn text="BETA" />
            </div>
            <div className="h-[30rem] flex items-center justify-center">
                <h1 className="text-[#09C9C8] text-xl">Coming Soon</h1>
            </div>
        </div>
    );
}

export default Suggesions;