import Image from "next/image";

type CardTeamMemberProps = {
    name: string;
    title: string;
    image: string;
    children?: React.ReactNode;
}

const CardTeamMember = ({ name, title, image, children }: CardTeamMemberProps) => {
    return (
        <div className="flex flex-col w-72 md:w-[450px] min-h-[600px] rounded-md shadow-lg bg-gradient-to-b from-gray-100 to-gray-300 dark:from-neutral-950/90 dark:to-neutral-800/90 dark:outline-1 dark:outline-solid dark:outline-dark-green-hsl outline outline-1 outline-gray-300">
            <div className="flex p-8">
                <Image 
                    height={125} 
                    width={125} 
                    src={image} 
                    alt={name} 
                    priority 
                    style={{
                        borderRadius: "50%", 
                        outline: "5px solid lightgray",
                        boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.75)",
                        border: "2px solid white"
                    }}
                />
                <div className="flex flex-col justify-center align-center ml-4 md:ml-10 -translate-y-4 gap-2">
                    <h3 className="text-3xl font-semibold">{name}</h3>
                    <p className="text-lg font-sans text-gray-400">{title}</p>
                </div>
            </div>
            <div className="px-6 pb-6">
                <p className="text-justify">{children}</p>
            </div>
        </div>
    );
}

export default CardTeamMember;