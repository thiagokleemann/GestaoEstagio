import { DataTypes,Model } from "sequelize";

class Documento extends Model{
    static init(sequelize){
        super.init(
            {
                id:{
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    autoIncrement: true
                },
                path: {
                    type: DataTypes.STRING,
                },
                tipo: {
                    type: DataTypes.INTEGER,
                },
                status: {
                    type: DataTypes.INTEGER,
                }
            },
            {
                sequelize,
            }
        );

        return this;
    }

    static associate(models){
        this.belongsTo(models.Estagio,{foreignKey: "idEstagio"})
        this.belongsTo(models.Usuario,{foreignKey: "idPostador"})
    }
}

export default Documento;