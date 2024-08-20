import bcrypt from "bcryptjs";
import { Request } from "express";
import { eq, or } from "drizzle-orm";
import { IAuthSuccess, IAuthFailed } from "./type";
import { admin } from "../../../../database/models";
import { IAdminWithRelations } from "../../../../database/models/admin/type";
import HttpStatus from "../../../libs/support/statusCode";
// import { EPersonalAccessTokensIdentifiers } from "../../../../database/models/auth/type";
// import { generateDeviceFingerprint } from "../../../utils/helpers";

export default class AdminAuthentication {
    private req: Request;
    public token_can_expire: boolean = true;
    public token_expiry_in_hrs: number = 1;

    constructor(req: Request) {
        this.req = req;
    }

    // public async loginWithEmailOrStaffIdAndPassword(email_or_staff_id: string, password: string): Promise<IAuthFailed | IAuthSuccess> {
    //     try {

    //         const db = AppConfig.getConfigKey('db');

    //         const user = await db?.query.admin.findFirst({
    //             where: or(
    //                 eq(admin.email, email_or_staff_id),
    //                 eq(admin.staff_id, email_or_staff_id)
    //             ),
    //             with: {
    //                 avatar: true,
    //             }
    //         })

    //         if (!user || user == undefined)
    //             return {
    //                 code: 400,
    //                 message: 'Incorrect credentials',
    //                 error: 'Incorrect credentials'
    //             } as IAuthFailed;

    //         if (user == undefined)
    //             return {
    //                 code: 400,
    //                 message: 'Incorrect credentials',
    //                 error: 'Incorrect credentials'
    //             } as IAuthFailed;

    //         if (!bcrypt.compareSync(admin.password as unknown as string, password))
    //             return {
    //                 code: 400,
    //                 message: 'Incorrect credentials',
    //                 error: 'Incorrect credentials'
    //             } as IAuthFailed;

    //         if (!user.enabled)
    //             return {
    //                 code: 400,
    //                 message: 'Account is currently disabled',
    //                 error: 'Account is currently disabled'
    //             } as IAuthFailed;

    //         return await this.successRes(user as IAdminWithRelations) as IAuthSuccess;

    //     } catch (error: any) {
    //         return {
    //             code: 500,
    //             message: error?.message || "Error authenticating user",
    //             error: error?.message || "Error authenticating user",
    //         } as IAuthFailed;
    //     }
    // }

    // private async successRes(user: IAdminWithRelations): Promise<IAuthSuccess> {
    //     try {
    //         const { id, first_name, last_name, email, staff_id, avatar } = user;

    //         const adminWithRelations = await AdminRepository.getAdminWithRolesAndPermissions(id);

    //         const token = await generateAndSaveToken({
    //             user: id,
    //             identifier: EPersonalAccessTokensIdentifiers.ADMIN_MODEL,
    //             deviceFingerprint: generateDeviceFingerprint(this.req),
    //             canExpire: this.token_can_expire || true,
    //             expiryInHrs: this.token_expiry_in_hrs || null,
    //             abilities: {}
    //         } as IGenerateAndSaveTokenOptions);

    //         if (token == null)
    //             throw new Error("Unable to generate token");

    //         const roles = [] as Array<any>;
            
    //         const permissions = [] as Array<string>;

    //         adminWithRelations?.roles?.forEach((role: any) => {
    //             const role_template = { id: role.id, name: role.name };

    //             roles.push(role_template);

    //             role.permissions?.forEach((perm: any) => permissions.push(perm.identifier))
    //         });

    //         return {
    //             code: HttpStatus.OK,
    //             message: `Login successful. Welcome back, ${first_name} !`,
    //             data: {
    //                 id,
    //                 first_name,
    //                 last_name,
    //                 email,
    //                 staff_id,
    //                 avatar: avatar?.media.secure_url || null,
    //                 roles,
    //                 permissions,
    //                 token,
    //             }
    //         } as IAuthSuccess;
    //     } catch (error: any) {
    //         throw new Error(error?.message || "Error signing user in");
    //     }
    // }
}