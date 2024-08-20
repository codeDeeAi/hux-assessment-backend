// import { Request, Response } from 'express';
// import { validate } from "../../../../../utils/validator";
// import {
//     loginValidation,
//     logoutValidation
// } from './validations/authValidations';
// import bcrypt from 'bcrypt';
// import { deleteAllTokensAndLogoutUser, deleteToken, saveToken } from '../../../../common/services/v1/accessTokens';
// import PassportAuth from '../../../../../libraries/auth/passport';
// import { AdminInterface } from '../../../types/user';
// import ApiResponse from '../../../../../libraries/support/apiResponse';
// import Admin, { IAdmin } from '../../../models/Admin.model';
// import AdminGuard from '../../../middleware/adminGuard';
// import PersonalAccessToken from '../../../../common/models/PersonalAccessToken.model';
// import Events from '../../../../../libraries/processes/events';
// import { ELogClassNames } from '../../../../../utils/logClassNames';
// import { generateDeviceFingerprint } from '../../../../../utils/helpers';
// import HttpStatus from '../../../../../libraries/support/statusCode';

// /**
//  * Login Admin with email/userName and password
//  * @param {Request} req
//  * @param {Response} res
//  * @return {Response}
//  */
// export const login = [validate(loginValidation), async (req: Request, res: Response) => {

//     try {
//         const { email, userName, password } = req.body;

//         const query = (email) ? { email: email } : { userName: userName }

//         const user = await Admin.findOne(query);

//         if (!user)
//             return ApiResponse.error(
//                 res,
//                 HttpStatus.BAD_REQUEST,
//                 "Incorrect credentials",
//                 "Incorrect credentials"
//             );

//         if (!user.password)
//             return ApiResponse.error(
//                 res,
//                 HttpStatus.BAD_REQUEST,
//                 "Incorrect credentials",
//                 "Incorrect credentials"
//             );

//         if (user.disabled)
//             return ApiResponse.error(
//                 res,
//                 HttpStatus.UNAUTHORIZED,
//                 "Account is currently disabled",
//                 "Account is currently disabled");

//         const passwordCheck = await bcrypt.compare(
//             password,
//             user.password
//         );

//         if (!passwordCheck)
//             return ApiResponse.error(
//                 res,
//                 HttpStatus.BAD_REQUEST,
//                 "Incorrect credentials",
//                 "Incorrect credentials"
//             );

//         await successLoginResponse(req, user as AdminInterface, res);

//     } catch (error) {

//         return ApiResponse.serverError(res, "Error authenticating admin");
//     }
// }];

// /**
//  * Logout Admin
//  * @param {Request} req
//  * @param {Response} res
//  * @return {Response}
//  */
// export const logout = [validate(logoutValidation), async (req: Request, res: Response) => {

//     try {
//         const { all } = req.query;

//         const user = req.user;

//         const bearer = (req.headers.authorization)?.split(" ") || [];

//         const token = (bearer?.length > 1) ? bearer[1] : '';

//         const IDENTIFIER = 'AdminModel';

//         let message = "";

//         if (all !== null && Boolean(all)) {

//             // Remove all tokens
//             if (user) deleteAllTokensAndLogoutUser(user._id, IDENTIFIER);

//             message = "User logged out of all devices successfully";
//         } else {
//             // Remove single token

//             const accessToken = await PersonalAccessToken.findOne({ token: token });

//             if (accessToken) deleteToken(accessToken._id, IDENTIFIER);

//             message = "User logged out successfully";
//         }

//         return ApiResponse.success(res, message);

//     } catch (error) {

//         return ApiResponse.serverError(res, "Error logging out user", JSON.stringify(error));
//     }
// }];

// /**
//  * Activity Log for user login
//  * @param {Request} req 
//  * @param {UserInterface} user 
//  * @param {Boolean} resumeSession
//  * @return {void}
//  */
// const logAdminSignin = (req: Request, user: IAdmin, resumeSession = false): void => {

//     // Log login time
//     const ipAddress = req.ip;
//     const userAgent = req.headers['user-agent'];
//     const loginTime = Date.now();

//     Events.dispatch(ELogClassNames.ADMIN_LOGIN, {
//         user,
//         ipAddress,
//         userAgent,
//         loginTime,
//         resumeSession
//     });
// }

// /**
//  * Successful Admin Login Response
//  * @param {Request} req
//  * @param {AdminInterface} user 
//  * @param {Response} res 
//  */
// const successLoginResponse = async (req: Request, user: AdminInterface, res: Response) => {
//     const token = PassportAuth.genBearerToken();

//     const deviceFingerprint = generateDeviceFingerprint(req);

//     const { _id, firstName, lastName, disabled, email, roles } = user;

//     const permissions = await AdminGuard.getPermissions(roles);

//     const allRoles = await AdminGuard.getAdminRoles(roles);

//     const accessToken = await saveToken(
//         user._id,
//         token,
//         5,
//         deviceFingerprint,
//         true,
//         'AdminModel'
//     );

//     logAdminSignin(req, user as AdminInterface)

//     return ApiResponse.success(
//         res,
//         "User logged in successfully",
//         {
//             user: {
//                 _id,
//                 firstName,
//                 lastName,
//                 disabled,
//                 roles: allRoles,
//                 permissions,
//                 email,
//                 token: accessToken.data.token,
//             }
//         }
//     );
// }

