const Profile = () => {
    return (
        <div className="flex items-center gap-2 w-fit">
            <div className="flex flex-col items-end">
                {/* <h1 className="text-white font-bold text-2xl">Welcome, User</h1> */}
                <span className="font-bold text-white">Krishna Singha</span>
                <span className="text-[#ffffffb3]">Student</span>
            </div>
            <div className="cursor-pointer p-1 rounded-full ">
                <img src="https://lh3.googleusercontent.com/a/ACg8ocJWZH0de9SgFZanSPr0WNwZsSr7TpxfzqFKsVkSifEqRMR3Ywvp=s96-c" alt="profile" className="rounded-full size-[3.5rem]" />
            </div>
        </div>
    );
}

export default Profile;