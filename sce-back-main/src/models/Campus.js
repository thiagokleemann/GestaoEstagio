import { DataTypes, Model } from "sequelize";

class Campus extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                descricao: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                dominio: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                sequelize,
            }
        );

        return this;
    }
}

export default Campus;
