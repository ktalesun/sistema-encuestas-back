import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Empresa } from '../../empresa/entities/empresa.entity';
import { Pregunta } from '../../pregunta/entities/pregunta.entity';
import { Respuesta } from '../../respuesta/entities/respuesta.entity';

@Entity('encuestas')
export class Encuesta {
  @PrimaryGeneratedColumn('uuid')
  id_encuesta: string;

  @Column({ type: 'varchar', length: 255 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_fin: Date;

  @Column({ type: 'varchar', length: 20, default: 'borrador' })
  estado: string; // borrador | publicada | inactiva | archivada

  @Column({ type: 'text', nullable: true })
  url_publica: string;

  @ManyToOne(() => Empresa, (empresa) => empresa.encuestas)
  @JoinColumn({ name: 'empresa_id' })
  empresa: Empresa;

  @Column({ type: 'uuid' })
  empresa_id: string;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.encuesta, { cascade: true })
  preguntas: Pregunta[];

  @OneToMany(() => Respuesta, (respuesta) => respuesta.encuesta)
  respuestas: Respuesta[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
