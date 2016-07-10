import { Router, Request, Response, RequestHandler } from 'express';
import { User, UserDataStore } from '../services/user-datastore';

import { router as usersRouter } from './users';
import { router as documentsRouter } from './documents';
import { router as sharesRouter } from './shares';
import { router as authRouter } from './auth';

export var router = Router( );

router.use( '/users/', usersRouter );
router.use( '/auth/', authRouter );
router.use( '/documents/', documentsRouter );
router.use( '/shares/', sharesRouter );
