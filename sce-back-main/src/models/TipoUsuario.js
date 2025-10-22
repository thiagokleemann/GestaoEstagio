import { DataTypes, Model } from "sequelize";

class TipoUsuario extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                },

                descricao: {
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

export default TipoUsuario;
