import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Encuesta } from '../../encuesta/entities/encuesta.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('respuestas')
export class Respuesta {
  @PrimaryGeneratedColumn('uuid')
  id_respuesta: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'jsonb', nullable: true })
  datos_tercero: Record<string, any>; // Información del respondedor

  @Column({ type: 'jsonb' })
  respuestas_json: Record<string, any>; // Respuestas por pregunta

  @ManyToOne(() => Encuesta, (encuesta) => encuesta.respuestas)
  @JoinColumn({ name: 'encuesta_id' })
  encuesta: Encuesta;

  @Column({ type: 'uuid' })
  encuesta_id: string;

  @ManyToOne(() => Usuario, (usuario) => usuario.respuestas, { nullable: true })
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'uuid', nullable: true })
  usuario_id: string;

  @CreateDateColumn()
  created_at: Date;
}
