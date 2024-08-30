import star from "../assets/star.svg";


const StylishBtn = ({text}) => {
    return (
        <div className="w-fit flex items-center gap-1 border-[1px] border-[#09C9C8] bg-[#09c9c91c] border-secondary rounded-lg px-2 py-[3px]">
            <p className=" text-secondary text-[0.6rem]">{text}</p>
            <img src={star} alt="" />
        </div>
    )
}

export default StylishBtn;