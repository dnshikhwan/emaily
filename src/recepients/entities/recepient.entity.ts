import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecepientList } from './recepient_list.entity';
import { CampaignRecepient } from 'src/campaigns/entities/campaign-recepient.entity';

@Entity('recepients')
export class Recepient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @ManyToOne(() => RecepientList, (recepient_list) => recepient_list.recepients)
  @JoinColumn({ name: 'recepient_list_id' })
  recepientsList: RecepientList;

  @OneToMany(
    () => CampaignRecepient,
    (campaignRecepient) => campaignRecepient.recepient,
  )
  campaignRecepient: CampaignRecepient[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
