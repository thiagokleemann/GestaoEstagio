import { DataTypes, Model } from "sequelize";

class Usuario extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                email: {
                    type: DataTypes.STRING,
                    allowNull: false,
                    unique: true,
                },

                nome: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },

                ativo: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },
            },
            {
                sequelize,
            }
        );

        return this;
    }
    
    static associate(models) {
        this.belongsTo(models.Campus, { foreignKey: "campus" });
        this.belongsTo(models.TipoUsuario, { foreignKey: "tipo" });
    }
}

export default Usuario;