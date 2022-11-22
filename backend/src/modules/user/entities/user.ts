import ProductEntity from "../../products/entities/product";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import RoleEnum from "../enums/role";

@Entity("user")
export default class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: "varchar", unique: true })
  username: string;

  @Column({ nullable: false, type: "varchar" })
  password: string;

  @Column({ nullable: false, type: "integer", default: 0 })
  deposit: number;

  @Column({ nullable: false, type: "enum", enum: RoleEnum })
  role: RoleEnum;

  @OneToMany(() => ProductEntity, (product) => product.seller, {
    nullable: true,
  })
  products: ProductEntity[];
}
