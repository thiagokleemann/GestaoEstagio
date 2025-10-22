import { DataTypes, Model } from "sequelize";
import bcrypt from "bcryptjs";

class Admin extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                nome: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },

                passwordHash: {
                    type: DataTypes.STRING,
                },

                password: {
                    type: DataTypes.VIRTUAL,
                },
            },
            {
                sequelize,
            }
        );

        this.addHook("beforeSave", async (Admin) => {
            if (Admin.password) {
                Admin.passwordHash = await bcrypt.hash(Admin.password, 8);
            }
        });

        return this;
    }

    async checkPassword(password) {
        return await bcrypt.compare(password, this.passwordHash);
    }
}

export default Admin;
