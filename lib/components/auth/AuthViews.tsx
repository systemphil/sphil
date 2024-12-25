import { SignInButton } from "./SignInButton";

function MustBeLoggedIn() {
    return (
        <div className="flex justify-center flex-col items-center py-48 gap-4">
            <p>You must be logged in to view this page.</p>
            <SignInButton className="btn btn-primary" />
        </div>
    );
}

export const AuthViews = {
    MustBeLoggedIn,
};
