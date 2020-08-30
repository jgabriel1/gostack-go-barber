import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

@Entity('appointments')
class Appointment {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  provider: string

  // @Column('timestamp with time zone') // when using postgres
  @Column('timestamp')
  date: Date
}

export default Appointment
