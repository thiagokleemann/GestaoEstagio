import { Model, DataTypes } from "sequelize";

class CursoUsuario extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                },
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models) {
        this.belongsTo(models.Usuario, { foreignKey: "usuario" });
        this.belongsTo(models.Curso, { foreignKey: "curso" });
    }
}

export default CursoUsuario;
