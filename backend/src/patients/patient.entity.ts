import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Hospital } from '../hospitals/hospital.entity';

@Entity()
export class Patient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  contactNumber?: string;

  @Column({ nullable: true })
  doctorsNotes?: string;

  @ManyToOne(() => Hospital, hospital => hospital.patients)
  hospital: Hospital;
}