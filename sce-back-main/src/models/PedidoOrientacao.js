import { DataTypes, Model } from "sequelize";

class PedidoOrientacao extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },

                obrigatorio: {
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
        this.belongsTo(models.Usuario, {
            foreignKey: "aluno",
            as: "orientando",
        });
        this.belongsTo(models.Usuario, { foreignKey: "orientador" });
    }
}

export default PedidoOrientacao;
