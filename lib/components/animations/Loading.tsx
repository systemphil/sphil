function RingLg() {
    return <span className="loading loading-ring loading-lg"></span>;
}

function RingMd() {
    return <span className="loading loading-ring loading-md"></span>;
}

function RingXs() {
    return <span className="loading loading-ring loading-xs"></span>;
}

function RingFullPage() {
    return (
        <div className="flex w-full justify-center mt-10 min-h-screen">
            <RingLg />
        </div>
    );
}

function SkeletonFullPage() {
    return <div className="skeleton w-full h-full"></div>;
}

const Loading = {
    RingXs,
    RingMd,
    RingLg,
    RingFullPage,
    SkeletonFullPage,
};

export { Loading };
