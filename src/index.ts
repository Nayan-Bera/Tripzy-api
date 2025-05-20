import express, { Express, Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import passport from 'passport';

import { config } from './config';

import './services/googleStrategy';
import responseData from './services/responseData';
import setTokensCookies from './Services/setTokencookies';
import errorHandler from './Services/errorhandler';


const app: Express = express();
app.use(express.urlencoded({ extended: true }));

/* ----------------middlewares---------------- */
app.use(express.json());
app.use(
    cors({
        origin: [`${config.ORIGIN_FRONTEND}`, `${config.ORIGIN_ADMIN}`, `${config.ORIGIN_FRONTEND_WWW}`],
        credentials: true,
    }),
);
app.use(passport.initialize());
app.use(cookieParser());


/* ----------------test route---------------- */
app.get('/', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        message: 'Welcome to MyDearProperty API',
    });
});

app.get('/healthcheck', (req: Request, res: Response) => {
    res.json({
        status: 'OK',
        uptime: process.uptime(),
        responsetime: process.hrtime(),
        timestamp: Date.now(),
    });
});

/* ----------------all routes---------------- */

app.get(
    '/auth/google',
    passport.authenticate('google', {
        session: false,
        scope: ['profile', 'email'],
    }),
);
app.get(
    '/auth/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: `${config.ORIGIN_FRONTEND}/auth/login`,
    }),
    function (req: any, res: any) {
        const {
            email_verified,
            phone_verified,
            role,
            access_token,
            refresh_token,
        } = req.user;

        setTokensCookies(
            res,
            email_verified,
            phone_verified,
            role,
            access_token,
            refresh_token,
        );

        if (req.query.jsonResponse) {
            responseData(
                res,
                email_verified,
                phone_verified,
                role,
                access_token,
                refresh_token,
            );
        } else {
            res.redirect(`${config.ORIGIN_FRONTEND}/dashboard/home`);
        }
    },
);

/* ----------------404 not found---------------- */
app.use((req: Request, res: Response) => {
    res.status(404).json({
        status: 404,
        message: '404 not found',
    });
});

/* ----------------Custom middlewares---------------- */
app.use(errorHandler);

/* ----------------Server starts---------------- */
app.listen(config.PORT, async () => {
    console.log(`Server is running on port ${config.PORT}`);
    // await cronJobService();
});
