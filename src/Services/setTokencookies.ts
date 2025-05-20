const setTokensCookies = (
    res: any,
    email_verified: boolean,
    phone_verified: boolean,
    role: string,
    access_token: string,
    refresh_token: string,
) => {
    res.cookie('email_verified', email_verified, {
        httpOnly: false,
        secure: false,
    });

    res.cookie('phone_verified', phone_verified, {
        httpOnly: false,
        secure: false,
    });

    res.cookie('role', role, {
        httpOnly: false,
        secure: false,
    });

    res.cookie('access_token', access_token, {
        httpOnly: false,
        secure: false,
    });

    res.cookie('refresh_token', refresh_token, {
        httpOnly: false,
        secure: false,
    });
};

export default setTokensCookies;
