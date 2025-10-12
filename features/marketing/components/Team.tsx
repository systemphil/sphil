import { EmbedTeacherProfile } from "features/editor/components/EmbedTeacherProfile";

export const Team = () => {
    return (
        <div className="flex flex-col container justify-center w-full items-center">
            <h1 className="text-4xl font-bold my-16">Meet Our Team</h1>
            <div className="flex justify-center gap-16 flex-wrap mb-60 ">
                <EmbedTeacherProfile
                    maxWidth="400px"
                    teacherInput="filip:Tech Lead"
                    altText
                />
                <EmbedTeacherProfile
                    maxWidth="400px"
                    teacherInput="ahilleas:Business Lead"
                    altText
                />
            </div>
        </div>
    );
};
