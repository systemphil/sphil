function RingLg() {
    return <span className="d-loading d-loading-ring d-loading-lg"></span>;
}

function RingMd() {
    return <span className="d-loading d-loading-ring d-loading-md"></span>;
}

function RingXs() {
    return <span className="d-loading d-loading-ring d-loading-xs"></span>;
}

function RingFullPage() {
    return (
        <div className="flex w-full justify-center mt-10 min-h-screen">
            <RingLg />
        </div>
    );
}

function SkeletonFullPage() {
    return <div className="d-skeleton w-full h-full"></div>;
}

const Loading = {
    RingXs,
    RingMd,
    RingLg,
    RingFullPage,
    SkeletonFullPage,
};

export { Loading };
