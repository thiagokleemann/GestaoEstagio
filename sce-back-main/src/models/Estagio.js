import { DataTypes, Model, Sequelize } from "sequelize";


class Estagio extends Model {
    static init(sequelize) {
        super.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
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


    static associate(models){
        this.belongsTo(models.Usuario,{foreignKey:"idAluno"})
        this.belongsTo(models.Usuario,{foreignKey:"idOrientador"})
    }

}

export default Estagio;