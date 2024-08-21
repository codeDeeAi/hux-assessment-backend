import bcrypt from "bcryptjs";
import JWT from "../../../libs/jwt";
import User, { IUser } from "../../../models/User.model";
import HttpStatus from "../../../libs/support/statusCode";
import { IRegister, IRegisterRes, IAuthFailed, IAuthSuccess } from "./type";

/**
 * Class responsible for handling user authentication, including registration and login.
 * @class Authentication
 * @author Adeola Bada
 */
export default class Authentication {

    constructor() {
        //
    }

    /**
     * Registers a new user by hashing the password and saving the user data.
     * @param {IRegister} options - The registration options containing email, password, and name.
     * @returns {Promise<IRegisterRes>} The registered user data including the user ID, name, and email.
     * @throws {Error} If registration fails.
     */
    public async Register(options: IRegister): Promise<IRegisterRes> {
        try {
            const { email, password, name } = options;

            const salt = await bcrypt.genSalt();

            const hashed_password = await bcrypt.hash(password, salt);

            const user = await new User({
                name,
                email,
                password: hashed_password,
            }).save();

            if (!user)
                throw new Error("Error creating user");

            return {
                name,
                email,
                _id: user.id,
            } as IRegisterRes;

        } catch (error: any) {

            throw new Error(error?.message || JSON.stringify(error));

        }
    }

    /**
    * Logs in a user by verifying the email and password.
    * @param {string} email - The user's email address.
    * @param {string} password - The user's password.
    * @returns {Promise<IAuthSuccess | IAuthFailed>} The authentication result, either success or failure.
    */
    public async Login(email: string, password: string) {
        try {

            const user = await User.findOne({ email: email });

            if (!user || user == undefined)
                return {
                    code: 400,
                    message: 'Incorrect credentials',
                    error: 'Incorrect credentials'
                } as IAuthFailed;

            if (user == undefined)
                return {
                    code: 400,
                    message: 'Incorrect credentials',
                    error: 'Incorrect credentials'
                } as IAuthFailed;

            if (!bcrypt.compareSync(user.password, password))
                return {
                    code: 400,
                    message: 'Incorrect credentials',
                    error: 'Incorrect credentials'
                } as IAuthFailed;

            return await this.successRes(user as IUser) as IAuthSuccess;

        } catch (error: any) {
            return {
                code: 500,
                message: error?.message || "Error authenticating user",
                error: error?.message || "Error authenticating user",
            } as IAuthFailed;
        }
    }

    /**
     * Logs out a user by blacklisting their JWT token.
     * @param {string} token - The JWT token to be blacklisted.
     * @returns {Promise<boolean>} A promise that resolves to `true` if the token is successfully blacklisted, or `false` if an error occurs.
     * @async
     */
    public async Logout(token: string): Promise<boolean> {
        try {
            const res = await JWT.BlacklistToken(token);

            return res;

        } catch (error: any) {
            return false;
        }
    }

    /**
    * Generates a successful authentication response, including a JWT token.
    * @private
    * @param {IUser} user - The authenticated user.
    * @returns {Promise<IAuthSuccess>} The successful authentication result including the user ID, name, email, and token.
    * @throws {Error} If generating the response fails.
    */
    private async successRes(user: IUser): Promise<IAuthSuccess> {
        try {
            const { id, email, name } = user;

            const token = JWT.Sign(id, 1);

            return {
                code: HttpStatus.OK,
                message: `Login successful. Welcome back, ${name} !`,
                data: {
                    id,
                    name,
                    email,
                    token,
                }
            } as IAuthSuccess;
        } catch (error: any) {
            throw new Error(error?.message || "Error signing user in");
        }
    }
}