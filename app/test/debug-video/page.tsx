import { Heading } from "lib/components/ui/Heading";
import { VideoViewerTest } from "lib/components/VideoViewerTest";

// TODO remove after testing

export default function TestVideoPage() {
    return (
        <div className="flex ">
            <VideoViewerTest videoUrl="/static/video/vid1.mp4" />
            <div className="p-4">
                <Heading>Testing video</Heading>
                <p>Do you see the video on the left? Does it play?</p>
            </div>
        </div>
    );
}
