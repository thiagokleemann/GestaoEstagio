import { DataTypes, Model } from "sequelize";

class Curso extends Model {
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

                obrigatorio: {
                    type: DataTypes.BOOLEAN,
                    allowNull: false,
                },

                naoObrigatorio: {
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
    }
}

export default Curso;
