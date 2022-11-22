import UserEntity from "../../user/entities/user";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("product")
export default class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, type: "varchar" })
  productName: string;

  @Column({ nullable: false, type: "integer" })
  amountAvailable: number;

  @Column({ nullable: false, type: "integer" })
  cost: number;

  @Column({ nullable: false, type: "integer" })
  sellerId: number;

  @ManyToOne(() => UserEntity, (user) => user.products, { nullable: false })
  seller: UserEntity;
}
