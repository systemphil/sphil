function Ball() {
    return <span className="loading loading-ring loading-lg"></span>;
}

function BallFullPage() {
    return (
        <div className="flex w-full justify-center mt-10 min-h-screen">
            <Ball />
        </div>
    );
}

function SkeletonFullPage() {
    return <div className="skeleton w-full h-full"></div>;
}

const Loading = {
    Ball,
    BallFullPage,
    SkeletonFullPage,
};

export { Loading };
