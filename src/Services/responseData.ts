const responseData = (
    res: any,
    email_verified: boolean,
    phone_verified: boolean,
    role: string,
    access_token: string,
    refresh_token: string,
) => {
    res.json({
        email_verified,
        phone_verified,
        role,
        access_token,
        refresh_token,
    });
};

export default responseData;
