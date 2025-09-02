import { Heading } from "lib/components/ui/Heading";

export default function DebugVideo3() {
    return (
        <div className="flex flex-col flex-wrap ">
            <div className="p-4">
                <Heading>Testing video 3</Heading>
                <p>Do you see the video below? Does it play?</p>
            </div>
            <video controls poster="/static/images/sphil_owl.webp" lang="en">
                <source src="/static/video/vid1.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </div>
    );
}
