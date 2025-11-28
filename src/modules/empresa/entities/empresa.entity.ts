import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Usuario } from '../../usuario/entities/usuario.entity';
import { Encuesta } from '../../encuesta/entities/encuesta.entity';

@Entity('empresas')
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  id_empresa: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  nit: string;

  @Column({ type: 'date' })
  fecha_inicio: Date;

  @Column({ type: 'date' })
  fecha_expiracion: Date;

  @Column({ type: 'varchar', length: 20, default: 'activa' })
  estado: string; // activa | inactiva

  @OneToMany(() => Usuario, (usuario) => usuario.empresa)
  usuarios: Usuario[];

  @OneToMany(() => Encuesta, (encuesta) => encuesta.empresa)
  encuestas: Encuesta[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
