import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Encuesta } from '../../encuesta/entities/encuesta.entity';

export enum TipoPregunta {
  TEXTO = 'texto',
  OPCION_UNICA = 'opcion_unica',
  SI_NO = 'si_no',
  NUMERICA = 'numerica',
  ESTRELLAS = 'estrellas',
}

@Entity('preguntas')
export class Pregunta {
  @PrimaryGeneratedColumn('uuid')
  id_pregunta: string;

  @Column({ type: 'text' })
  texto: string;

  @Column({
    type: 'enum',
    enum: TipoPregunta,
    default: TipoPregunta.TEXTO,
  })
  tipo: TipoPregunta;

  @Column({ type: 'jsonb', nullable: true })
  opciones: string[]; // Para opción única

  @Column({ type: 'jsonb', nullable: true })
  rango: { min: number; max: number }; // Para numérica y estrellas

  @Column({ type: 'int', default: 0 })
  orden: number;

  @ManyToOne(() => Encuesta, (encuesta) => encuesta.preguntas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'encuesta_id' })
  encuesta: Encuesta;

  @Column({ type: 'uuid' })
  encuesta_id: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
