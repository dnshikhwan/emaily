import { Campaign } from 'src/campaigns/entities/campaign.entity';
import { RecepientList } from 'src/recepients/entities/recepient_list.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum Role {
  BASIC = 'basic',
  VIP = 'vip',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.BASIC,
  })
  role: Role;

  // campaigns
  @OneToMany(() => Campaign, (campaign) => campaign.user)
  campaigns: Campaign[];

  // recepients_list
  @OneToMany(() => RecepientList, (recepients_list) => recepients_list.user)
  recepients_list: RecepientList[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
